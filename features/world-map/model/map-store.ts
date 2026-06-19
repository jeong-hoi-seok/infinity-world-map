import { create } from "zustand";
import { KOREA_POINT } from "@/entities/world-map";
import {
  clampTransform,
  koreaCenteredTransform,
  type MapTransform,
  type Viewport,
  zoomTransformAt,
} from "./map-transform";

export type { MapTransform, Viewport } from "./map-transform";

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

export const useMapStore = create<MapState>((set, get) => ({
  transform: { x: 0, y: 0, k: 1 },
  viewport: { width: 0, height: 0 },
  isReady: false,

  setViewport: (viewport) => {
    const { isReady, transform } = get();

    if (!isReady && viewport.width > 0 && viewport.height > 0) {
      set({
        viewport,
        transform: koreaCenteredTransform(viewport, 1, KOREA_POINT),
        isReady: true,
      });
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
      transform: koreaCenteredTransform(state.viewport, 1, KOREA_POINT),
    })),
}));
