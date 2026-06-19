"use client";

import { useRef } from "react";
import { useWorldMapCanvas } from "./use-world-map-canvas";

export const WorldMapCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useWorldMapCanvas(canvasRef);

  return (
    <canvas
      ref={canvasRef}
      tabIndex={0}
      className="block h-full w-full cursor-grab touch-none select-none outline-none focus-visible:ring-2 focus-visible:ring-[#4285f4] focus-visible:ring-offset-2"
      aria-label="무한 반복 세계 지도. 방향키로 이동, +/- 로 줌 조절"
      role="img"
    />
  );
};
