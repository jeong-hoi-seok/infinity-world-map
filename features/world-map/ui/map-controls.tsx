"use client";

import type { ReactNode } from "react";
import { MAX_ZOOM, MIN_ZOOM, ZOOM_STEP_FACTOR } from "../config/map-config";
import { useMapStore } from "../model/map-store";

const controlButtonClassName =
  "px-3 py-1.5 text-gray-700 transition-colors hover:bg-gray-50 active:bg-gray-100 disabled:cursor-not-allowed disabled:text-gray-300";

type MapControlButtonProps = {
  ariaLabel: string;
  disabled?: boolean;
  onClick: () => void;
  children: ReactNode;
  className?: string;
};

const MapControlButton = ({
  ariaLabel,
  disabled = false,
  onClick,
  children,
  className = controlButtonClassName,
}: MapControlButtonProps) => (
  <button
    type="button"
    onClick={onClick}
    disabled={disabled}
    aria-label={ariaLabel}
    className={className}
  >
    {children}
  </button>
);

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
    <section
      aria-label="지도 조작"
      className="absolute right-4 bottom-4 flex flex-col items-end gap-2"
    >
      <MapControlButton
        ariaLabel="대한민국으로 이동"
        onClick={handleResetToKorea}
        className={`${controlButtonClassName} rounded-lg border border-gray-200 bg-white text-sm shadow-sm`}
      >
        한국으로
      </MapControlButton>
      <fieldset className="m-0 flex items-center overflow-hidden rounded-lg border border-gray-200 bg-white p-0 shadow-sm">
        <legend className="sr-only">줌 조절</legend>
        <MapControlButton
          ariaLabel="줌 아웃"
          disabled={isMinZoom}
          onClick={handleZoomOut}
          className={`${controlButtonClassName} text-lg leading-none`}
        >
          −
        </MapControlButton>
        <span
          aria-live="polite"
          className="min-w-14 border-gray-200 border-x px-2 py-1.5 text-center text-gray-600 text-sm tabular-nums"
        >
          {zoomPercent}%
        </span>
        <MapControlButton
          ariaLabel="줌 인"
          disabled={isMaxZoom}
          onClick={handleZoomIn}
          className={`${controlButtonClassName} text-lg leading-none`}
        >
          +
        </MapControlButton>
      </fieldset>
    </section>
  );
};
