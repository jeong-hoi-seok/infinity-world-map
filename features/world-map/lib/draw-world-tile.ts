import {
  coastline,
  countryBorders,
  countryFeatures,
  createPathRenderer,
  koreaFeature,
} from "@/entities/world-map";
import { MAP_COLORS } from "./colors";

export const drawWorldTile = (context: CanvasRenderingContext2D): void => {
  const renderPath = createPathRenderer(context);

  context.beginPath();
  renderPath(countryFeatures);
  context.fillStyle = MAP_COLORS.land;
  context.fill();

  if (koreaFeature) {
    context.beginPath();
    renderPath(koreaFeature);
    context.fillStyle = MAP_COLORS.koreaHighlight;
    context.fill();
  }

  context.beginPath();
  renderPath(countryBorders);
  context.strokeStyle = MAP_COLORS.border;
  context.lineWidth = 0.75;
  context.stroke();

  context.beginPath();
  renderPath(coastline);
  context.strokeStyle = MAP_COLORS.coastline;
  context.lineWidth = 0.5;
  context.stroke();
};
