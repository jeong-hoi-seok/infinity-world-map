import { MapControls } from "@/components/world-map/MapControls";
import { WorldMapCanvas } from "@/components/world-map/WorldMapCanvas";

export default function Home() {
  return (
    <main className="relative h-dvh w-full overflow-hidden bg-white">
      <WorldMapCanvas />
      <MapControls />
    </main>
  );
}
