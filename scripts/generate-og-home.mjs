import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const outDir = join(root, "public", "og");
const outFile = join(outDir, "home.png");

const moduleUrl = pathToFileURL(join(root, "src/app/opengraph-image.tsx")).href;
const { default: render } = await import(moduleUrl);
const response = await render();
const buffer = Buffer.from(await response.arrayBuffer());

mkdirSync(outDir, { recursive: true });
writeFileSync(outFile, buffer);
console.log(`Wrote ${outFile} (${buffer.length} bytes)`);
