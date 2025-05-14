export interface Dot {
  x: number;
  y: number;
  size: number;
  color: string;
}

export interface PointerPosition {
  x: number;
  y: number;
}

export const colors: string[] = [
  "#eee", // Lightest shade
  "#ddd", // Slightly darker
  "#ccc", // Mid-light shade
  "#999", // Mid-dark shade
  "#888", // Darker shade
];

export const generateDots = (
  width: number,
  height: number,
  count: number
): Dot[] => {
  return Array.from({ length: count }, () => ({
    x: Math.random() * width,
    y: Math.random() * height,
    size: Math.random() * 2 + 4,
    color: colors[Math.floor(Math.random() * colors.length)],
  }));
};

export const initCanvas = (
  canvas: HTMLCanvasElement,
  container: HTMLElement
) => {
  const { width, height } = container.getBoundingClientRect();
  canvas.width = width;
  canvas.height = height;
  return { width, height };
};

export const drawScene = (
  ctx: CanvasRenderingContext2D,
  dots: Dot[],
  pointerPos: PointerPosition | null
) => {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

  // Draw dots
  dots.forEach((dot) => {
    ctx.fillStyle = dot.color;
    ctx.beginPath();
    ctx.arc(dot.x, dot.y, dot.size, 0, Math.PI * 2);
    ctx.fill();
  });

  // Draw lines if pointer position exists
  if (pointerPos) {
    ctx.save();
    dots.forEach((dot) => {
      const distance = Math.sqrt(
        (pointerPos.x - dot.x) ** 2 + (pointerPos.y - dot.y) ** 2
      );
      if (distance < 300) {
        ctx.strokeStyle = dot.color;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(dot.x, dot.y);
        ctx.lineTo(pointerPos.x, pointerPos.y);
        ctx.stroke();
      }
    });
    ctx.restore();
  }
};

export const getPointerPosition = (
  e: MouseEvent | TouchEvent,
  container: HTMLElement
): PointerPosition | null => {
  const rect = container.getBoundingClientRect();
  let clientX, clientY;

  if (e instanceof TouchEvent) {
    if (e.touches.length === 0) return null;
    clientX = e.touches[0].clientX;
    clientY = e.touches[0].clientY;
  } else {
    clientX = e.clientX;
    clientY = e.clientY;
  }

  return {
    x: clientX - rect.left,
    y: clientY - rect.top,
  };
};
