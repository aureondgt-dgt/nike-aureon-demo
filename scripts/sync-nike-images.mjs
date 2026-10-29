import { readFile, writeFile, mkdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";

const root = new URL("../", import.meta.url);
const sources = JSON.parse(
  await readFile(new URL("src/assets/image-sources.json", root), "utf8")
);
const embedded = {};
const previewFolder = new URL(".image-check/", root);
await mkdir(previewFolder, { recursive: true });

for (const [key, source] of Object.entries(sources)) {
  const response = await fetch(source, {
    headers: { "User-Agent": "Mozilla/5.0", Accept: "image/jpeg,image/png,image/webp" },
    signal: AbortSignal.timeout(45_000),
  });
  if (!response.ok) throw new Error(`${key}: HTTP ${response.status}`);

  const bytes = Buffer.from(await response.arrayBuffer());
  const isJpeg = bytes[0] === 0xff && bytes[1] === 0xd8;
  const isPng = bytes.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]));
  const isWebp = bytes.subarray(0, 4).toString() === "RIFF" && bytes.subarray(8, 12).toString() === "WEBP";
  if (!isJpeg && !isPng && !isWebp) throw new Error(`${key}: response is not a valid image`);
  if (bytes.length < 5_000) throw new Error(`${key}: image is unexpectedly small`);

  const mime = isJpeg ? "image/jpeg" : isPng ? "image/png" : "image/webp";
  embedded[key] = `data:${mime};base64,${bytes.toString("base64")}`;
  await writeFile(new URL(`${key}.${mime.split("/")[1]}`, previewFolder), bytes);
  console.log(`${key}: ${(bytes.length / 1024).toFixed(1)} KB, ${mime}`);
}

// Text assets survive export and are included in Vite's single-file build.
const destination = new URL("src/assets/nike-images.json", root);
await writeFile(destination, `${JSON.stringify(embedded, null, 2)}\n`);
console.log(`Embedded ${Object.keys(embedded).length} photos in ${fileURLToPath(destination)}`);