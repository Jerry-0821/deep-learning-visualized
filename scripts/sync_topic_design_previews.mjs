import { mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const sourceDirectory = path.join(root, "topic-design-previews");
const publicDirectory = path.join(root, "public", "topic-design-previews");
const copiedFiles = readdirSync(sourceDirectory).filter(
  (fileName) => fileName.endsWith(".html") || fileName === "topic-preview-shell.css" || fileName === "topic-preview-shell.js",
);

mkdirSync(publicDirectory, { recursive: true });

for (const fileName of copiedFiles) {
  const source = readFileSync(path.join(sourceDirectory, fileName), "utf8");
  const published = source
    .replaceAll("../public/prototypes/", "../prototypes/")
    .replaceAll("https://deep-learning-visualized.vercel.app/module/", "/module/");
  writeFileSync(path.join(publicDirectory, fileName), published, "utf8");
}

console.log(`Synchronized ${copiedFiles.length} redesigned topic preview assets.`);
