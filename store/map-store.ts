import { create } from "zustand";
import { KOREA_POINT, WORLD_HEIGHT } from "@/lib/geo/projection";

/** 줌 제한: 50% ~ 200% */
export const MIN_ZOOM = 0.5;
export const MAX_ZOOM = 2;

export type MapTransform = {
  x: number;
  y: number;
  k: number;
};

export type Viewport = {
  width: number;
  height: number;
};

type MapState = {
  transform: MapTransform;
  viewport: Viewport;
  /** 뷰포트 측정 후 한국 포커스 초기화가 끝났는지 여부 */
  isReady: boolean;
  setViewport: (viewport: Viewport) => void;
  setTransform: (transform: MapTransform) => void;
  panBy: (deltaX: number, deltaY: number) => void;
  /** 앵커(화면 픽셀 좌표)를 고정점으로 줌 */
  zoomAt: (anchorX: number, anchorY: number, factor: number) => void;
  /** 뷰포트 중앙을 앵커로 줌 (컨트롤 버튼용) */
  zoomBy: (factor: number) => void;
  resetToKorea: () => void;
};

const clampZoom = (k: number): number => Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, k));

/**
 * 세로(상하) 방향은 무한 반복하지 않고 지도 경계에서 막는다.
 * - 지도가 뷰포트보다 크면: 지도 위/아래 끝이 뷰포트 안으로 들어오지 못하게 막는다.
 * - 지도가 뷰포트보다 작으면(줌 아웃): 세로 중앙에 고정한다.
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

const clampTransform = (transform: MapTransform, viewport: Viewport): MapTransform => ({
  ...transform,
  y: clampY(transform.y, transform.k, viewport.height),
});

const koreaCenteredTransform = (viewport: Viewport, k: number): MapTransform =>
  clampTransform(
    {
      x: viewport.width / 2 - KOREA_POINT[0] * k,
      y: viewport.height / 2 - KOREA_POINT[1] * k,
      k,
    },
    viewport,
  );

const zoomTransformAt = (
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

export const useMapStore = create<MapState>((set, get) => ({
  transform: { x: 0, y: 0, k: 1 },
  viewport: { width: 0, height: 0 },
  isReady: false,

  setViewport: (viewport) => {
    const { isReady, transform } = get();
    if (!isReady && viewport.width > 0 && viewport.height > 0) {
      set({ viewport, transform: koreaCenteredTransform(viewport, 1), isReady: true });
      return;
    }
    set({ viewport, transform: clampTransform(transform, viewport) });
  },

  setTransform: (transform) =>
    set((state) => ({ transform: clampTransform(transform, state.viewport) })),

  panBy: (deltaX, deltaY) =>
    set((state) => ({
      transform: clampTransform(
        {
          ...state.transform,
          x: state.transform.x + deltaX,
          y: state.transform.y + deltaY,
        },
        state.viewport,
      ),
    })),

  zoomAt: (anchorX, anchorY, factor) =>
    set((state) => ({
      transform: clampTransform(
        zoomTransformAt(state.transform, anchorX, anchorY, factor),
        state.viewport,
      ),
    })),

  zoomBy: (factor) =>
    set((state) => ({
      transform: clampTransform(
        zoomTransformAt(
          state.transform,
          state.viewport.width / 2,
          state.viewport.height / 2,
          factor,
        ),
        state.viewport,
      ),
    })),

  resetToKorea: () =>
    set((state) => ({
      transform: koreaCenteredTransform(state.viewport, 1),
    })),
}));
