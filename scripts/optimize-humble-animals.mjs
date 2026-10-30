// 把 art/humble-animals/ 里的原图压成网页用的 WebP，输出到 public/humble-animals/。
// 用法：node scripts/optimize-humble-animals.mjs
import { mkdir } from "node:fs/promises";
import { createRequire } from "node:module";
import path from "node:path";

// sharp 随 Next.js 一起安装，不单独加依赖
const requireFromNext = createRequire(createRequire(import.meta.url).resolve("next/package.json"));
const sharp = requireFromNext("sharp");

const ids = ["rabbit", "chick", "bear", "puppy", "cat"];
const size = 640;
const root = path.resolve(import.meta.dirname, "..");
const srcDir = path.join(root, "art/humble-animals");
const outDir = path.join(root, "public/humble-animals");

await mkdir(outDir, { recursive: true });
/** 找到奶油色圆盘的半径：从中线最左边往里扫，直到颜色明显不同于角落的底色。 */
async function findDiscRadius(file) {
  const { data, info } = await sharp(file).removeAlpha().raw().toBuffer({ resolveWithObject: true });
  const { width, height, channels } = info;
  const cy = Math.floor(height / 2);
  const at = (x, y) => {
    const i = (y * width + x) * channels;
    return [data[i], data[i + 1], data[i + 2]];
  };
  const corner = at(2, 2);
  for (let x = 0; x < width / 2; x++) {
    const px = at(x, cy);
    const diff = Math.max(...px.map((v, i) => Math.abs(v - corner[i])));
    if (diff > 10) return { width, height, radius: width / 2 - x };
  }
  return { width, height, radius: width / 2 };
}

for (const id of ids) {
  const file = path.join(srcDir, `${id}.png`);
  const out = path.join(outDir, `${id}.webp`);
  // 圆盘外面的底色（有的原图是白底）抠成透明，让圆盘直接落在纸面上
  const { width, height, radius } = await findDiscRadius(file);
  const mask = Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">` +
      `<circle cx="${width / 2}" cy="${height / 2}" r="${radius - 1}" fill="#fff"/></svg>`,
  );
  const masked = await sharp(file)
    .ensureAlpha()
    .composite([{ input: mask, blend: "dest-in" }])
    .png()
    .toBuffer();
  const info = await sharp(masked)
    .resize(size, size, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .webp({ quality: 82, alphaQuality: 90, effort: 6 })
    .toFile(out);
  console.log(
    `${id}.webp  ${info.width}x${info.height}  ${(info.size / 1024).toFixed(1)} KB  (disc r=${radius}px of ${width})`,
  );
}
