"use client";

import { useEffect, useRef } from "react";
import { createPathRenderer } from "@/lib/geo/projection";
import { coastline, countryBorders, countryFeatures, koreaFeature } from "@/lib/geo/world-data";
import { MAP_COLORS } from "@/lib/map/colors";
import { drawTiledWorld } from "@/lib/map/tiling";
import { useMapStore } from "@/store/map-store";

/** 휠 줌 민감도 (Figma와 유사한 체감) */
const WHEEL_ZOOM_SENSITIVITY = 0.01;

const drawWorldTile = (context: CanvasRenderingContext2D): void => {
  const renderPath = createPathRenderer(context);

  // 육지 채우기
  context.beginPath();
  renderPath(countryFeatures);
  context.fillStyle = MAP_COLORS.land;
  context.fill();

  // 대한민국 하이라이트
  if (koreaFeature) {
    context.beginPath();
    renderPath(koreaFeature);
    context.fillStyle = MAP_COLORS.koreaHighlight;
    context.fill();
  }

  // 국가 간 국경선
  context.beginPath();
  renderPath(countryBorders);
  context.strokeStyle = MAP_COLORS.border;
  context.lineWidth = 0.75;
  context.stroke();

  // 해안선
  context.beginPath();
  renderPath(coastline);
  context.strokeStyle = MAP_COLORS.coastline;
  context.lineWidth = 0.5;
  context.stroke();
};

export const WorldMapCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isDraggingRef = useRef(false);
  const lastPointerRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext("2d");
    if (!context) return;

    const { setViewport, panBy, zoomAt } = useMapStore.getState();

    let cssWidth = 0;
    let cssHeight = 0;
    let animationFrameId = 0;

    const resizeCanvas = (): void => {
      const rect = canvas.getBoundingClientRect();
      const devicePixelRatio = window.devicePixelRatio || 1;
      cssWidth = rect.width;
      cssHeight = rect.height;
      canvas.width = Math.round(rect.width * devicePixelRatio);
      canvas.height = Math.round(rect.height * devicePixelRatio);
      setViewport({ width: cssWidth, height: cssHeight });
    };

    const renderFrame = (): void => {
      const { transform } = useMapStore.getState();
      const devicePixelRatio = window.devicePixelRatio || 1;

      context.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
      context.fillStyle = MAP_COLORS.ocean;
      context.fillRect(0, 0, cssWidth, cssHeight);

      if (cssWidth > 0 && cssHeight > 0) {
        drawTiledWorld(context, transform, cssWidth, drawWorldTile);
      }

      animationFrameId = requestAnimationFrame(renderFrame);
    };

    const handleWheel = (event: WheelEvent): void => {
      event.preventDefault();
      const isZoomGesture = event.ctrlKey || event.metaKey;

      if (isZoomGesture) {
        const rect = canvas.getBoundingClientRect();
        const anchorX = event.clientX - rect.left;
        const anchorY = event.clientY - rect.top;
        const factor = Math.exp(-event.deltaY * WHEEL_ZOOM_SENSITIVITY);
        zoomAt(anchorX, anchorY, factor);
        return;
      }

      panBy(-event.deltaX, -event.deltaY);
    };

    const handlePointerDown = (event: PointerEvent): void => {
      isDraggingRef.current = true;
      lastPointerRef.current = { x: event.clientX, y: event.clientY };
      canvas.setPointerCapture(event.pointerId);
      canvas.style.cursor = "grabbing";
    };

    const handlePointerMove = (event: PointerEvent): void => {
      if (!isDraggingRef.current) return;
      const deltaX = event.clientX - lastPointerRef.current.x;
      const deltaY = event.clientY - lastPointerRef.current.y;
      lastPointerRef.current = { x: event.clientX, y: event.clientY };
      panBy(deltaX, deltaY);
    };

    const handlePointerUp = (event: PointerEvent): void => {
      isDraggingRef.current = false;
      canvas.releasePointerCapture(event.pointerId);
      canvas.style.cursor = "grab";
    };

    const resizeObserver = new ResizeObserver(resizeCanvas);
    resizeObserver.observe(canvas);
    resizeCanvas();

    canvas.addEventListener("wheel", handleWheel, { passive: false });
    canvas.addEventListener("pointerdown", handlePointerDown);
    canvas.addEventListener("pointermove", handlePointerMove);
    canvas.addEventListener("pointerup", handlePointerUp);
    canvas.addEventListener("pointercancel", handlePointerUp);

    animationFrameId = requestAnimationFrame(renderFrame);

    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
      canvas.removeEventListener("wheel", handleWheel);
      canvas.removeEventListener("pointerdown", handlePointerDown);
      canvas.removeEventListener("pointermove", handlePointerMove);
      canvas.removeEventListener("pointerup", handlePointerUp);
      canvas.removeEventListener("pointercancel", handlePointerUp);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="block h-full w-full cursor-grab touch-none select-none"
      aria-label="무한 반복 세계 지도"
      role="img"
    />
  );
};
