/**
 * Lightweight Zero-Dependency Confetti Particle Effect
 * 100% offline, smooth 60fps HTML5 Canvas particle physics
 */

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  rotation: number;
  vRot: number;
  opacity: number;
}

export function fireConfetti(): void {
  if (typeof window === 'undefined') return;

  const canvas = document.createElement('canvas');
  canvas.style.position = 'fixed';
  canvas.style.top = '0';
  canvas.style.left = '0';
  canvas.style.width = '100vw';
  canvas.style.height = '100vh';
  canvas.style.pointerEvents = 'none';
  canvas.style.zIndex = '9999';
  document.body.appendChild(canvas);

  const ctx = canvas.getContext('2d');
  if (!ctx) {
    canvas.remove();
    return;
  }

  const dpr = window.devicePixelRatio || 1;
  const width = window.innerWidth;
  const height = window.innerHeight;
  canvas.width = width * dpr;
  canvas.height = height * dpr;
  ctx.scale(dpr, dpr);

  const colors = [
    '#4f46e5', '#06b6d4', '#10b981', '#f59e0b',
    '#ec4899', '#8b5cf6', '#ef4444', '#14b8a6', '#f97316'
  ];

  const particles: Particle[] = [];
  const count = Math.min(80, Math.floor(width / 12));

  // Spawn from center-bottom and center
  for (let i = 0; i < count; i++) {
    const angle = (Math.random() * Math.PI) - (Math.PI / 2) + (Math.PI / 2); // mostly upwards
    const speed = 7 + Math.random() * 9;
    particles.push({
      x: width * 0.5 + (Math.random() - 0.5) * 100,
      y: height * 0.65,
      vx: Math.cos(angle) * speed * (Math.random() > 0.5 ? 1 : -1) * 0.8,
      vy: -Math.abs(Math.sin(angle) * speed) - 3,
      size: 6 + Math.random() * 6,
      color: colors[Math.floor(Math.random() * colors.length)],
      rotation: Math.random() * Math.PI * 2,
      vRot: (Math.random() - 0.5) * 0.2,
      opacity: 1,
    });
  }

  let animationFrameId: number;
  let startTime = performance.now();

  function animate(now: number) {
    const elapsed = now - startTime;
    if (!ctx) return;
    ctx.clearRect(0, 0, width, height);

    let activeCount = 0;

    particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.35; // gravity
      p.vx *= 0.98; // air drag
      p.rotation += p.vRot;

      if (elapsed > 1000) {
        p.opacity = Math.max(0, p.opacity - 0.025);
      }

      if (p.opacity > 0 && p.y < height + 50) {
        activeCount++;
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.globalAlpha = p.opacity;
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
        ctx.restore();
      }
    });

    if (activeCount > 0 && elapsed < 3500) {
      animationFrameId = requestAnimationFrame(animate);
    } else {
      cancelAnimationFrame(animationFrameId);
      canvas.remove();
    }
  }

  animationFrameId = requestAnimationFrame(animate);
}
