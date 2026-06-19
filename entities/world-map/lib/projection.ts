import { type GeoPath, type GeoProjection, geoMercator, geoPath } from "d3-geo";

/**
 * 줌 100%(k=1) 기준 월드 타일 한 장의 픽셀 크기.
 * Web Mercator: 위도 ±85.05113°가 정확히 정사각형(폭=높이)에 매핑된다.
 */
export const WORLD_WIDTH = 2048;
export const WORLD_HEIGHT = WORLD_WIDTH;

/** 대한민국 중심 경위도 */
export const KOREA_COORDINATES: [number, number] = [127.7669, 35.9078];

export const worldProjection: GeoProjection = geoMercator()
  .scale(WORLD_WIDTH / (2 * Math.PI))
  .translate([WORLD_WIDTH / 2, WORLD_HEIGHT / 2])
  .precision(0.1);

/** 한국의 월드 타일 내 픽셀 좌표 */
export const KOREA_POINT: [number, number] = worldProjection(KOREA_COORDINATES) ?? [
  WORLD_WIDTH / 2,
  WORLD_HEIGHT / 2,
];

/** Canvas 컨텍스트에 직접 그리는 geoPath 생성기 */
export const createPathRenderer = (context: CanvasRenderingContext2D): GeoPath =>
  geoPath(worldProjection, context);
