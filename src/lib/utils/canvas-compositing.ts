export interface GradientConfig {
  colors: [string, string];
  direction: "horizontal" | "vertical" | "radial";
}

function createCanvas(width: number, height: number): [HTMLCanvasElement, CanvasRenderingContext2D] {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d")!;
  return [canvas, ctx];
}

async function blobToImage(blob: Blob): Promise<HTMLImageElement> {
  const url = URL.createObjectURL(blob);
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Failed to load image"));
    };
    img.src = url;
  });
}

function canvasToBlob(canvas: HTMLCanvasElement): Promise<Blob> {
  return new Promise((resolve, reject) => {
    try {
      canvas.toBlob(
        (blob) => {
          if (blob) resolve(blob);
          else reject(new Error("Failed to create blob"));
        },
        "image/png"
      );
    } catch (err) {
      reject(err instanceof Error ? err : new Error("Canvas export failed"));
    }
  });
}

export async function compositeWithColor(
  foregroundBlob: Blob,
  color: string
): Promise<Blob> {
  const fg = await blobToImage(foregroundBlob);
  const [canvas, ctx] = createCanvas(fg.width, fg.height);

  ctx.fillStyle = color;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(fg, 0, 0);

  return canvasToBlob(canvas);
}

export async function compositeWithGradient(
  foregroundBlob: Blob,
  gradient: GradientConfig
): Promise<Blob> {
  const fg = await blobToImage(foregroundBlob);
  const [canvas, ctx] = createCanvas(fg.width, fg.height);

  let grad: CanvasGradient;

  if (gradient.direction === "radial") {
    const cx = canvas.width / 2;
    const cy = canvas.height / 2;
    const r = Math.max(canvas.width, canvas.height) / 2;
    grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
  } else if (gradient.direction === "vertical") {
    grad = ctx.createLinearGradient(0, 0, 0, canvas.height);
  } else {
    grad = ctx.createLinearGradient(0, 0, canvas.width, 0);
  }

  grad.addColorStop(0, gradient.colors[0]);
  grad.addColorStop(1, gradient.colors[1]);
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(fg, 0, 0);

  return canvasToBlob(canvas);
}

export async function compositeWithImage(
  foregroundBlob: Blob,
  bgImageSrc: string
): Promise<Blob> {
  const fg = await blobToImage(foregroundBlob);
  const [canvas, ctx] = createCanvas(fg.width, fg.height);

  const bgImg = await new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("Failed to load background image"));
    img.src = bgImageSrc;
  });

  // Cover fit the background
  const scale = Math.max(
    canvas.width / bgImg.width,
    canvas.height / bgImg.height
  );
  const w = bgImg.width * scale;
  const h = bgImg.height * scale;
  ctx.drawImage(bgImg, (canvas.width - w) / 2, (canvas.height - h) / 2, w, h);
  ctx.drawImage(fg, 0, 0);

  return canvasToBlob(canvas);
}

export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export async function resizeBlob(
  blob: Blob,
  scale: number
): Promise<Blob> {
  if (scale >= 1) return blob;
  const img = await blobToImage(blob);
  const newW = Math.round(img.width * scale);
  const newH = Math.round(img.height * scale);
  const [canvas, ctx] = createCanvas(newW, newH);
  ctx.drawImage(img, 0, 0, newW, newH);
  return canvasToBlob(canvas);
}
