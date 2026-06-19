"use client";

import type { RefObject } from "react";
import { useEffect, useRef } from "react";
import { KEYBOARD_PAN_STEP, WHEEL_ZOOM_SENSITIVITY, ZOOM_STEP_FACTOR } from "../config/map-config";
import { MAP_COLORS } from "../lib/colors";
import { drawWorldTile } from "../lib/draw-world-tile";
import { useMapStore } from "../model/map-store";
import { drawTiledWorld } from "../model/map-transform";

type PointerPosition = {
  x: number;
  y: number;
};

export const useWorldMapCanvas = (canvasRef: RefObject<HTMLCanvasElement | null>) => {
  const isDraggingRef = useRef(false);
  const lastPointerRef = useRef<PointerPosition>({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext("2d");
    if (!context) return;

    const { setViewport, panBy, zoomAt, zoomBy } = useMapStore.getState();

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

    const handleKeyDown = (event: KeyboardEvent): void => {
      switch (event.key) {
        case "ArrowLeft":
          event.preventDefault();
          panBy(KEYBOARD_PAN_STEP, 0);
          break;
        case "ArrowRight":
          event.preventDefault();
          panBy(-KEYBOARD_PAN_STEP, 0);
          break;
        case "ArrowUp":
          event.preventDefault();
          panBy(0, KEYBOARD_PAN_STEP);
          break;
        case "ArrowDown":
          event.preventDefault();
          panBy(0, -KEYBOARD_PAN_STEP);
          break;
        case "+":
        case "=":
          event.preventDefault();
          zoomBy(ZOOM_STEP_FACTOR);
          break;
        case "-":
        case "_":
          event.preventDefault();
          zoomBy(1 / ZOOM_STEP_FACTOR);
          break;
        default:
          break;
      }
    };

    const resizeObserver = new ResizeObserver(resizeCanvas);
    resizeObserver.observe(canvas);
    resizeCanvas();

    canvas.addEventListener("wheel", handleWheel, { passive: false });
    canvas.addEventListener("pointerdown", handlePointerDown);
    canvas.addEventListener("pointermove", handlePointerMove);
    canvas.addEventListener("pointerup", handlePointerUp);
    canvas.addEventListener("pointercancel", handlePointerUp);
    canvas.addEventListener("keydown", handleKeyDown);

    animationFrameId = requestAnimationFrame(renderFrame);

    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
      canvas.removeEventListener("wheel", handleWheel);
      canvas.removeEventListener("pointerdown", handlePointerDown);
      canvas.removeEventListener("pointermove", handlePointerMove);
      canvas.removeEventListener("pointerup", handlePointerUp);
      canvas.removeEventListener("pointercancel", handlePointerUp);
      canvas.removeEventListener("keydown", handleKeyDown);
    };
  }, [canvasRef]);
};
