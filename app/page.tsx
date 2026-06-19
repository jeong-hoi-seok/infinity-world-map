import { MapControls, WorldMapCanvas } from "@/features/world-map";

export default function Home() {
  return (
    <main className="relative h-dvh w-full overflow-hidden bg-white">
      <WorldMapCanvas />
      <MapControls />
    </main>
  );
}
