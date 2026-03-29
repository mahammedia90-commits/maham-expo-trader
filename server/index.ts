import express from "express";
import { createServer } from "http";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const server = createServer(app);

  // In Docker: dist/index.js runs from /app, static files in /app/dist/public
  // In dev: static files in ./dist/public relative to project root
  const staticPath =
    process.env.NODE_ENV === "production"
      ? path.resolve(process.cwd(), "dist", "public")
      : path.resolve(__dirname, "..", "dist", "public");

  console.log(`[Static] Serving from: ${staticPath}`);

  app.use(express.static(staticPath, {
    maxAge: '7d',
    immutable: true,
  }));

  // Handle client-side routing - serve index.html for all non-asset routes
  app.get("*", (_req, res) => {
    res.sendFile(path.join(staticPath, "index.html"));
  });

  const port = process.env.PORT || 3000;

  server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}/`);
  });
}

startServer().catch(console.error);
