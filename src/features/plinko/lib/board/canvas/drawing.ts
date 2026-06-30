import {
  type BallPosition,
  type BoardLayout,
  getBallRadius,
  getPegPosition,
  getPegRadius,
} from "@/features/plinko/lib/board/animation";

type CanvasSize = {
  height: number;
  pixelRatio?: number;
  width: number;
};

export type BallFrame = {
  ballPosition?: BallPosition;
  impactPosition?: BallPosition;
  impactProgress?: number;
};

type SceneParams = CanvasSize & {
  layout?: BoardLayout;
  rows: number;
};

type BallLayerParams = SceneParams & {
  ballFrames?: BallFrame[];
  pixelRatio?: number;
};

export function configureCanvas(canvas: HTMLCanvasElement, size: CanvasSize) {
  const context = canvas.getContext("2d");

  if (!context) {
    return null;
  }

  const pixelRatio = size.pixelRatio ?? window.devicePixelRatio ?? 1;

  canvas.width = size.width * pixelRatio;
  canvas.height = size.height * pixelRatio;
  canvas.style.width = `${size.width}px`;
  canvas.style.height = `${size.height}px`;
  context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);

  return context;
}

function drawPeg(
  context: CanvasRenderingContext2D,
  position: BallPosition,
  radius: number,
  borderColor = "#46576f",
  shadowColor = "rgba(104, 125, 153, 0.35)",
  lineWidth = 2,
) {
  context.save();
  context.shadowBlur = 8;
  context.shadowColor = shadowColor;
  context.strokeStyle = borderColor;
  context.lineWidth = lineWidth;
  context.beginPath();
  context.arc(position.x, position.y, radius + 1.8, 0, Math.PI * 2);
  context.stroke();
  context.restore();
}

export function getPegImpactBorderAlpha(progress: number) {
  return Math.max(0, Math.min(1, 1 - progress));
}

export function getPegImpactBorderColor() {
  return "#facc15";
}

function drawPegImpactBorder(
  context: CanvasRenderingContext2D,
  position: BallPosition,
  progress: number,
  pegRadius: number,
) {
  const alpha = getPegImpactBorderAlpha(progress);

  if (alpha <= 0) {
    return;
  }

  context.save();
  context.globalAlpha = alpha;
  drawPeg(
    context,
    position,
    pegRadius,
    getPegImpactBorderColor(),
    "rgba(250, 204, 21, 0.72)",
    2.6,
  );
  context.restore();
}

type BallSprite = {
  canvas: HTMLCanvasElement;
  half: number;
};

const ballSpriteCache = new Map<string, BallSprite>();

function paintBall(
  context: CanvasRenderingContext2D,
  centerX: number,
  centerY: number,
  radius: number,
) {
  const gradient = context.createRadialGradient(
    centerX - radius * 0.38,
    centerY - radius * 0.5,
    Math.max(1, radius * 0.12),
    centerX,
    centerY,
    radius * 1.12,
  );

  gradient.addColorStop(0, "#FF8A92");
  gradient.addColorStop(0.48, "#D93A43");
  gradient.addColorStop(1, "#580C12");

  context.save();
  context.shadowBlur = radius * 1.6;
  context.shadowColor = "rgba(200, 40, 49, 0.58)";
  context.fillStyle = gradient;
  context.beginPath();
  context.arc(centerX, centerY, radius, 0, Math.PI * 2);
  context.fill();
  context.restore();
}

function getBallSprite(radius: number, pixelRatio: number): BallSprite | null {
  const key = `${radius.toFixed(2)}:${pixelRatio}`;
  const cached = ballSpriteCache.get(key);

  if (cached) {
    return cached;
  }

  const half = Math.ceil(radius * 3.4) + 2;
  const size = half * 2;
  const canvas = document.createElement("canvas");

  canvas.width = size * pixelRatio;
  canvas.height = size * pixelRatio;

  const context = canvas.getContext("2d");

  if (!context) {
    return null;
  }

  context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
  paintBall(context, half, half, radius);

  const sprite: BallSprite = { canvas, half };
  ballSpriteCache.set(key, sprite);

  return sprite;
}

function drawBall(
  context: CanvasRenderingContext2D,
  position: BallPosition,
  radius: number,
  pixelRatio: number,
) {
  const sprite = getBallSprite(radius, pixelRatio);

  if (!sprite) {
    return;
  }

  const size = sprite.half * 2;
  context.drawImage(
    sprite.canvas,
    position.x - sprite.half,
    position.y - sprite.half,
    size,
    size,
  );
}

function drawImpact(
  context: CanvasRenderingContext2D,
  position: BallPosition,
  progress: number,
  ballRadius: number,
) {
  const radius = ballRadius * 0.75 + progress * ballRadius * 1.25;

  context.save();
  context.globalAlpha = 1 - progress;
  context.strokeStyle = getPegImpactBorderColor();
  context.lineWidth = 1.5;
  context.beginPath();
  context.arc(position.x, position.y, radius, 0, Math.PI * 2);
  context.stroke();
  context.restore();
}

export function drawPegLayer(
  context: CanvasRenderingContext2D,
  { height, layout = "regular", rows, width }: SceneParams,
) {
  context.clearRect(0, 0, width, height);

  const pegRadius = getPegRadius(rows, layout);

  for (let rowIndex = 0; rowIndex < rows; rowIndex += 1) {
    for (let pegIndex = 0; pegIndex < rowIndex + 3; pegIndex += 1) {
      drawPeg(
        context,
        getPegPosition(rowIndex, pegIndex, rows, layout),
        pegRadius,
      );
    }
  }
}

export function drawBallLayer(
  context: CanvasRenderingContext2D,
  {
    ballFrames = [],
    height,
    layout = "regular",
    pixelRatio = window.devicePixelRatio || 1,
    rows,
    width,
  }: BallLayerParams,
) {
  context.clearRect(0, 0, width, height);

  const ballRadius = getBallRadius(rows, layout);
  const pegRadius = getPegRadius(rows, layout);

  ballFrames.forEach(({ impactPosition, impactProgress = 1 }) => {
    if (impactPosition && impactProgress < 1) {
      drawPegImpactBorder(context, impactPosition, impactProgress, pegRadius);
      drawImpact(context, impactPosition, impactProgress, ballRadius);
    }
  });

  ballFrames.forEach(({ ballPosition }) => {
    if (ballPosition) {
      drawBall(context, ballPosition, ballRadius, pixelRatio);
    }
  });
}
