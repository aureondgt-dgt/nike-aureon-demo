import { mkdir, readFile, writeFile } from "node:fs/promises";

const { default: sharp } = await import(process.env.SHARP_MODULE ?? "sharp");
sharp.concurrency(1);
await mkdir(".design-check", { recursive: true });
const originals = JSON.parse(await readFile("src/assets/nike-images.json", "utf8"));
const cutouts = {};
const tiles = [];

for (const [key, source] of Object.entries(originals)) {
  if (key === "campaign") continue;
  const input = Buffer.from(source.split(",")[1], "base64");
  const { data, info } = await sharp(input).removeAlpha().raw().toBuffer({ resolveWithObject: true });
  const { width, height, channels } = info;
  const background = new Float32Array(height * 3);
  for (let y = 0; y < height; y++) {
    for (let c = 0; c < 3; c++) {
      let sum = 0;
      for (let x = 0; x < 8; x++) sum += data[(y * width + x) * channels + c] + data[(y * width + width - 1 - x) * channels + c];
      background[y * 3 + c] = sum / 16;
    }
  }

  // Remove only the studio background connected to the image edges.
  const visited = new Uint8Array(width * height);
  const queue = new Uint32Array(width * height);
  let tail = 0;
  const add = (index) => {
    if (visited[index]) return;
    visited[index] = 1;
    const offset = index * channels;
    const row = Math.floor(index / width) * 3;
    if ([0, 1, 2].some((c) => Math.abs(data[offset + c] - background[row + c]) > 13)) return;
    queue[tail++] = index;
  };
  for (let x = 0; x < width; x++) { add(x); add((height - 1) * width + x); }
  for (let y = 0; y < height; y++) { add(y * width); add(y * width + width - 1); }
  for (let head = 0; head < tail; head++) {
    const index = queue[head];
    const x = index % width;
    if (x > 0) add(index - 1);
    if (x < width - 1) add(index + 1);
    if (index >= width) add(index - width);
    if (index < width * (height - 1)) add(index + width);
  }
  const alpha = new Uint8Array(width * height).fill(255);
  for (let i = 0; i < tail; i++) alpha[queue[i]] = 0;
  if (key === "dunk" || key === "airMax97") {
    // Separate the pale studio shadow from these models' dark rubber outsoles.
    for (let x = 0; x < width; x++) {
      let sole = -1;
      for (let y = 0; y < height; y++) {
        const i = y * width + x, p = i * channels;
        if (alpha[i] && (data[p] + data[p + 1] + data[p + 2]) / 3 < (key === "airMax97" ? 75 : 45)) sole = y;
      }
      for (let y = Math.max(0, sole + 2); y < height; y++) alpha[y * width + x] = 0;
    }
  }
  let materialTop = height, materialBottom = 0;
  for (let i = 0; i < alpha.length; i++) {
    if (alpha[i]) { const row = Math.floor(i / width); materialTop = Math.min(materialTop, row); materialBottom = Math.max(materialBottom, row); }
  }
  const materialLimit = Math.floor(materialTop + (materialBottom - materialTop) * 0.82);
  // White leather can match the backdrop; keep enclosed material opaque.
  for (let x = 0; x < width; x++) {
    let top = height, run = 0, longest = 0, bottom = -1;
    for (let y = 0; y < height; y++) {
      if (alpha[y * width + x]) {
        top = Math.min(top, y);
        if (++run > longest) { longest = run; bottom = y; }
      } else run = 0;
    }
    // Do not fill the gap between the sole and its separate studio shadow.
    for (let y = top; y <= Math.min(bottom, materialLimit); y++) alpha[y * width + x] = 255;
  }
  if (key === "dunk") {
    const tops = new Int32Array(width).fill(height);
    for (let x = 0; x < width; x++) {
      for (let y = 0; y < height; y++) if (alpha[y * width + x]) { tops[x] = y; break; }
    }
    for (let x = 4; x < width - 4; x++) {
      if (tops[x] === height) continue;
      const neighbors = [...tops.slice(x - 4, x + 5)].filter((value) => value < height).sort((a, b) => a - b);
      const edge = neighbors[Math.floor(neighbors.length / 2)];
      if (Math.abs(edge - tops[x]) > 18) continue;
      for (let y = Math.min(edge, tops[x]); y < Math.max(edge, tops[x]); y++) alpha[y * width + x] = y >= edge ? 255 : 0;
    }
  }
  const rgba = Buffer.alloc(width * height * 4);
  let minX = width, minY = height, maxX = 0, maxY = 0;
  for (let i = 0; i < alpha.length; i++) {
    for (let c = 0; c < 3; c++) rgba[i * 4 + c] = data[i * channels + c];
    rgba[i * 4 + 3] = alpha[i];
    if (alpha[i]) {
      const x = i % width, y = Math.floor(i / width);
      minX = Math.min(minX, x); maxX = Math.max(maxX, x);
      minY = Math.min(minY, y); maxY = Math.max(maxY, y);
    }
  }
  const crop = { left: Math.max(0, minX - 16), top: Math.max(0, minY - 16) };
  crop.width = Math.min(width - crop.left, maxX - crop.left + 17);
  crop.height = Math.min(height - crop.top, maxY - crop.top + 17);
  const image = await sharp(rgba, { raw: { width, height, channels: 4 } })
    .extract(crop).resize({ width: 1200, withoutEnlargement: true })
    .webp({ quality: 92, alphaQuality: 100 }).toBuffer();
  cutouts[key] = `data:image/webp;base64,${image.toString("base64")}`;
  await writeFile(`.design-check/${key}.webp`, image);
  const tile = await sharp(image).resize({ width: 450, height: 260, fit: "contain", background: "#dfded8" }).flatten({ background: "#dfded8" }).jpeg().toBuffer();
  tiles.push({ input: tile, left: ((tiles.length % 4) * 470), top: Math.floor(tiles.length / 4) * 280 });
  console.log(`${key}: ${crop.width}x${crop.height}, ${(image.length / 1024).toFixed(1)} KB`);
}
await writeFile("src/assets/editorial-images.json", `${JSON.stringify(cutouts, null, 2)}\n`);
await sharp({ create: { width: 1880, height: 560, channels: 3, background: "#dfded8" } }).composite(tiles).jpeg().toFile(".design-check/cutouts.jpg");

const cssUrl = "https://fonts.googleapis.com/css2?family=Barlow+Condensed:ital,wght@0,800;1,800&family=Inter:wght@400..800&display=swap";
const response = await fetch(cssUrl, { headers: { "User-Agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36" } });
if (!response.ok) throw new Error(`Font CSS: ${response.status}`);
const css = await response.text();
const latinFaces = [...css.matchAll(/\/\*\s*latin\s*\*\/\s*(@font-face\s*\{[^}]+\})/g)].map((match) => match[1]);
if (latinFaces.length < 3) throw new Error("Expected display and body font faces");
const faces = [];
for (const face of latinFaces) {
  const url = face.match(/url\(([^)]+)\)/)[1];
  const font = await fetch(url);
  if (!font.ok) throw new Error(`Font file: ${font.status}`);
  const bytes = Buffer.from(await font.arrayBuffer());
  faces.push(face.replace(url, `data:font/woff2;base64,${bytes.toString("base64")}`));
}
await writeFile("src/assets/fonts.css", `${faces.join("\n\n")}\n`);
console.log(`Embedded ${faces.length} local font faces`);