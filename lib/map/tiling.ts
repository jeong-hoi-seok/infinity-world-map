import { WORLD_WIDTH } from "@/lib/geo/projection";
import type { MapTransform } from "@/store/map-store";

export type HorizontalTileRange = {
  startI: number;
  endI: number;
};

/**
 * 현재 transform 기준으로 뷰포트 가로폭을 덮는 데 필요한 타일 인덱스 범위 계산.
 * 가로(경도)는 무한 반복되므로 좌우 양방향으로 필요한 만큼만 복제한다.
 */
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

/**
 * 보이는 가로 타일마다 drawTile 콜백을 반복 호출해 좌우 무한 반복 지도를 그린다.
 * 세로(상하)는 Mercator 특성상 무한 반복이 불가능하므로 단일 지도만 그리며,
 * 경계 밖 이동은 store의 세로 클램프가 막는다.
 * drawTile은 (0,0) ~ (WORLD_WIDTH, WORLD_HEIGHT) 좌표계 기준으로 한 장만 그리면 된다.
 */
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
