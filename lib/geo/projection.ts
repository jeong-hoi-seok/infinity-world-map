import { type GeoPath, type GeoProjection, geoMercator, geoPath } from "d3-geo";

/**
 * 줌 100%(k=1) 기준 월드 타일 한 장의 픽셀 크기.
 * Web Mercator: 위도 ±85.05113°가 정확히 정사각형(폭=높이)에 매핑된다.
 * 등각(conformal) 투영이라 국가 모양이 보존되며 Google Maps와 동일한 느낌.
 * 가로(경도)는 무한 반복 가능, 세로는 ±85°에서 클램프.
 */
export const WORLD_WIDTH = 2048;
export const WORLD_HEIGHT = WORLD_WIDTH;

/** 대한민국 중심 경위도 */
export const KOREA_COORDINATES: [number, number] = [127.7669, 35.9078];

/**
 * 전 세계(경도 360°)가 WORLD_WIDTH 픽셀에 들어가도록 스케일 고정.
 * geoMercator 전체 폭 = scale * 2π.
 * clipExtent는 d3-geo Canvas 렌더링과 상호작용 시 일부 지오메트리가 누락될 수 있어 사용하지 않는다.
 */
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
