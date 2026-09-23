// server.ts
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
var __filename = fileURLToPath(import.meta.url);
var __dirname = path.dirname(__filename);
var app = express();
var PORT = process.env.PORT || 3e3;
app.use(express.json());
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", timestamp: (/* @__PURE__ */ new Date()).toISOString() });
});
var distPath = path.join(__dirname, "dist");
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
  app.get("*", (_req, res) => {
    res.sendFile(path.join(distPath, "index.html"));
  });
} else {
  app.get("*", (_req, res) => {
    res.status(200).send("Aplicaci\xF3n iniciada. Ejecute el comando de compilaci\xF3n para servir los archivos est\xE1ticos.");
  });
}
var server = app.listen(Number(PORT), "0.0.0.0", () => {
  console.log(`Server listening on 0.0.0.0:${PORT}`);
});
process.on("SIGTERM", () => {
  server.close(() => {
    process.exit(0);
  });
});
