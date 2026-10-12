// Serves the ledger for local preview.
//
// ledger.html has no <head> of its own: the claude.ai artifact runtime supplies
// the <!doctype>/<head> skeleton, including <meta charset="utf-8">. A plain
// static server sends "text/html" with no charset, so browsers fall back to
// windows-1252 and the page fills with mojibake. This one names the charset.
//
//   node study-ledger/tools/serve.mjs [port]

import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { join, extname, normalize } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("..", import.meta.url));
const port = Number(process.argv[2]) || 8000;

const types = {
  ".html": "text/html; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".svg": "image/svg+xml; charset=utf-8",
};

createServer(async (req, res) => {
  const url = new URL(req.url, "http://localhost");
  const rel = normalize(decodeURIComponent(url.pathname)).replace(/^(\.\.[/\\])+/, "");
  const file = join(root, rel === "/" ? "ledger.html" : rel);
  try {
    const body = await readFile(file);
    res.writeHead(200, {
      "content-type": types[extname(file)] || "application/octet-stream",
      "cache-control": "no-store",
    });
    res.end(body);
  } catch {
    res.writeHead(404, { "content-type": "text/plain; charset=utf-8" });
    res.end("Not found\n");
  }
}).listen(port, () => console.log(`Ledger at http://localhost:${port}/`));
