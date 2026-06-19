import { WORLD_HEIGHT, WORLD_WIDTH } from "@/entities/world-map";
import { MAX_ZOOM, MIN_ZOOM } from "../config/map-config";

export type MapTransform = {
  x: number;
  y: number;
  k: number;
};

export type Viewport = {
  width: number;
  height: number;
};

export type HorizontalTileRange = {
  startI: number;
  endI: number;
};

const clampZoom = (k: number): number => Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, k));

/**
 * 세로(상하) 방향은 무한 반복하지 않고 지도 경계에서 막는다.
 */
const clampY = (y: number, k: number, viewportHeight: number): number => {
  if (viewportHeight <= 0) return y;

  const worldHeight = WORLD_HEIGHT * k;
  if (worldHeight <= viewportHeight) {
    return (viewportHeight - worldHeight) / 2;
  }

  const maxY = 0;
  const minY = viewportHeight - worldHeight;
  return Math.min(maxY, Math.max(minY, y));
};

export const clampTransform = (transform: MapTransform, viewport: Viewport): MapTransform => ({
  ...transform,
  y: clampY(transform.y, transform.k, viewport.height),
});

export const koreaCenteredTransform = (
  viewport: Viewport,
  k: number,
  koreaPoint: [number, number],
): MapTransform =>
  clampTransform(
    {
      x: viewport.width / 2 - koreaPoint[0] * k,
      y: viewport.height / 2 - koreaPoint[1] * k,
      k,
    },
    viewport,
  );

export const zoomTransformAt = (
  transform: MapTransform,
  anchorX: number,
  anchorY: number,
  factor: number,
): MapTransform => {
  const nextK = clampZoom(transform.k * factor);
  const ratio = nextK / transform.k;

  return {
    x: anchorX - (anchorX - transform.x) * ratio,
    y: anchorY - (anchorY - transform.y) * ratio,
    k: nextK,
  };
};

export const getVisibleHorizontalRange = (
  transform: MapTransform,
  width: number,
): HorizontalTileRange => {
  const scaledWidth = WORLD_WIDTH * transform.k;

  return {
    startI: Math.floor(-transform.x / scaledWidth),
    endI: Math.floor((width - transform.x) / scaledWidth),
  };
};

export const drawTiledWorld = (
  context: CanvasRenderingContext2D,
  transform: MapTransform,
  width: number,
  drawTile: (context: CanvasRenderingContext2D) => void,
): void => {
  const scaledWidth = WORLD_WIDTH * transform.k;
  const { startI, endI } = getVisibleHorizontalRange(transform, width);

  for (let i = startI; i <= endI; i++) {
    context.save();
    context.translate(transform.x + i * scaledWidth, transform.y);
    context.scale(transform.k, transform.k);
    drawTile(context);
    context.restore();
  }
};
