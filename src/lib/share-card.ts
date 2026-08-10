import { toSvg } from "@/components/mascot/mascot-art";
import type { CatHead } from "@/lib/cats";

const CARD_SIZE = 1200;

function roundedRect(
  context: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number,
) {
  context.beginPath();
  context.roundRect(x, y, width, height, radius);
}

async function svgToImage(svg: string): Promise<HTMLImageElement> {
  const url = URL.createObjectURL(
    new Blob([svg], { type: "image/svg+xml;charset=utf-8" }),
  );
  try {
    const image = new Image();
    image.decoding = "async";
    image.src = url;
    await image.decode();
    return image;
  } finally {
    URL.revokeObjectURL(url);
  }
}

function canvasToBlob(canvas: HTMLCanvasElement): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) resolve(blob);
      else reject(new Error("Could not create PNG"));
    }, "image/png");
  });
}

export function safeFilename(value: string, fallback = "meow-wall"): string {
  const cleaned = value
    .trim()
    .replace(/[\\/:*?"<>|\u0000-\u001f]/g, "-")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^[-.]+|[-.]+$/g, "")
    .slice(0, 80);
  return cleaned || fallback;
}

export async function createSpeechCardFile(
  cat: CatHead,
  message: string,
): Promise<File> {
  const canvas = document.createElement("canvas");
  canvas.width = CARD_SIZE;
  canvas.height = CARD_SIZE;
  const context = canvas.getContext("2d");
  if (!context) throw new Error("Canvas is unavailable");

  context.fillStyle = "#fbf3df";
  context.fillRect(0, 0, CARD_SIZE, CARD_SIZE);

  context.fillStyle = "#f4dfaa";
  roundedRect(context, 72, 72, 1056, 1056, 72);
  context.fill();

  context.fillStyle = "#fffdf7";
  roundedRect(context, 156, 130, 888, 260, 44);
  context.fill();
  context.strokeStyle = "rgba(92, 61, 43, .18)";
  context.lineWidth = 6;
  context.stroke();

  context.beginPath();
  context.moveTo(515, 386);
  context.lineTo(600, 470);
  context.lineTo(685, 386);
  context.closePath();
  context.fillStyle = "#fffdf7";
  context.fill();

  context.fillStyle = "#4a352c";
  context.font = '700 56px "DM Sans", system-ui, sans-serif';
  context.textAlign = "center";
  context.textBaseline = "middle";
  const display = message.length > 18
    ? [message.slice(0, 18), message.slice(18)]
    : [message];
  display.forEach((line, index) => {
    const offset = (index - (display.length - 1) / 2) * 72;
    context.fillText(line, 600, 260 + offset, 760);
  });

  const svg = toSvg(cat.palette, {
    ariaLabel: cat.label,
    accessories: cat.accessories,
    markings: cat.markings,
    state: "thinking",
  });
  const catImage = await svgToImage(svg);
  context.imageSmoothingEnabled = false;
  context.drawImage(catImage, 248, 455, 704, 525);

  context.fillStyle = "#4a352c";
  context.font = '700 42px "DM Sans", system-ui, sans-serif';
  context.fillText(cat.label, 600, 1020, 760);
  context.fillStyle = "rgba(74, 53, 44, .62)";
  context.font = '700 25px ui-monospace, monospace';
  context.fillText("MEOW WALL", 600, 1080);

  const blob = await canvasToBlob(canvas);
  return new File([blob], `${safeFilename(cat.label)}-says.png`, {
    type: "image/png",
  });
}

export function downloadFile(file: File): void {
  const url = URL.createObjectURL(file);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = file.name;
  anchor.click();
  setTimeout(() => URL.revokeObjectURL(url), 0);
}

export async function shareFile(
  file: File,
  title: string,
  text: string,
): Promise<"shared" | "downloaded"> {
  const data: ShareData = { files: [file], title, text };
  if (navigator.share && (!navigator.canShare || navigator.canShare(data))) {
    await navigator.share(data);
    return "shared";
  }
  downloadFile(file);
  return "downloaded";
}
