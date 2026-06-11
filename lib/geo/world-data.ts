import type { FeatureCollection, Geometry, MultiLineString } from "geojson";
import { feature, mesh } from "topojson-client";
import type { GeometryCollection, Topology } from "topojson-specification";
import countriesTopology from "world-atlas/countries-110m.json";

export type CountryProperties = {
  name: string;
};

type CountriesTopology = Topology<{
  countries: GeometryCollection<CountryProperties>;
  land: GeometryCollection;
}>;

const topology = countriesTopology as unknown as CountriesTopology;

/** 전체 국가 폴리곤 (육지 채우기용) */
export const countryFeatures: FeatureCollection<Geometry, CountryProperties> = feature(
  topology,
  topology.objects.countries,
);

/** 국가 간 내부 국경선 (한 번만 그리도록 mesh로 병합) */
export const countryBorders: MultiLineString = mesh(
  topology,
  topology.objects.countries,
  (a, b) => a !== b,
);

/** 해안선 (육지 외곽선) */
export const coastline: MultiLineString = mesh(
  topology,
  topology.objects.countries,
  (a, b) => a === b,
);

/** 대한민국 폴리곤 (포커스 하이라이트용) */
export const koreaFeature = countryFeatures.features.find(
  (countryFeature) => countryFeature.properties.name === "South Korea",
);
