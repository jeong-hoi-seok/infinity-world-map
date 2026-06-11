"use client";

import { MAX_ZOOM, MIN_ZOOM, useMapStore } from "@/store/map-store";

const ZOOM_STEP_FACTOR = 1.25;

export const MapControls = () => {
  const zoomLevel = useMapStore((state) => state.transform.k);
  const zoomBy = useMapStore((state) => state.zoomBy);
  const resetToKorea = useMapStore((state) => state.resetToKorea);

  const zoomPercent = Math.round(zoomLevel * 100);
  const isMinZoom = zoomLevel <= MIN_ZOOM;
  const isMaxZoom = zoomLevel >= MAX_ZOOM;

  const handleZoomIn = () => zoomBy(ZOOM_STEP_FACTOR);
  const handleZoomOut = () => zoomBy(1 / ZOOM_STEP_FACTOR);
  const handleResetToKorea = () => resetToKorea();

  return (
    <div className="absolute right-4 bottom-4 flex flex-col items-end gap-2">
      <button
        type="button"
        onClick={handleResetToKorea}
        aria-label="대한민국으로 이동"
        tabIndex={0}
        className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-gray-700 text-sm shadow-sm transition-colors hover:bg-gray-50 active:bg-gray-100"
      >
        한국으로
      </button>
      <div className="flex items-center overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
        <button
          type="button"
          onClick={handleZoomOut}
          disabled={isMinZoom}
          aria-label="줌 아웃"
          tabIndex={0}
          className="px-3 py-1.5 text-gray-700 text-lg leading-none transition-colors hover:bg-gray-50 active:bg-gray-100 disabled:cursor-not-allowed disabled:text-gray-300"
        >
          −
        </button>
        <span
          aria-live="polite"
          className="min-w-14 border-gray-200 border-x px-2 py-1.5 text-center text-gray-600 text-sm tabular-nums"
        >
          {zoomPercent}%
        </span>
        <button
          type="button"
          onClick={handleZoomIn}
          disabled={isMaxZoom}
          aria-label="줌 인"
          tabIndex={0}
          className="px-3 py-1.5 text-gray-700 text-lg leading-none transition-colors hover:bg-gray-50 active:bg-gray-100 disabled:cursor-not-allowed disabled:text-gray-300"
        >
          +
        </button>
      </div>
    </div>
  );
};
