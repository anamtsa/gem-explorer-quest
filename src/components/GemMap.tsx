import { useEffect, useMemo } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useNavigate } from "react-router-dom";
import { Star } from "lucide-react";
import type { GemWithPhotos } from "@/hooks/useGems";
import { getAvgRating, getPrimaryPhoto } from "@/hooks/useGems";

// Category → color mapping using our design tokens (HSL → hex approximations)
const categoryColors: Record<string, string> = {
  cafe: "#C17F59",    // warm brown
  nature: "#4D9E7B",  // emerald
  culture: "#7B6DAF",  // purple
  market: "#D4853B",  // orange
  viewpoint: "#4A9DC9", // sky blue
  beach: "#E8A54B",   // sandy gold
  park: "#5AAF6E",    // green
  museum: "#C25D7C",  // rose
};

const defaultColor = "#4D9E7B";

const createCategoryIcon = (category: string) => {
  const color = categoryColors[category] || defaultColor;
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="42" viewBox="0 0 32 42">
      <path d="M16 0C7.16 0 0 7.16 0 16c0 12 16 26 16 26s16-14 16-26C32 7.16 24.84 0 16 0z" fill="${color}" stroke="white" stroke-width="2"/>
      <circle cx="16" cy="16" r="8" fill="white" opacity="0.9"/>
      <circle cx="16" cy="16" r="5" fill="${color}"/>
    </svg>`;
  return L.divIcon({
    html: svg,
    className: "gem-marker",
    iconSize: [32, 42],
    iconAnchor: [16, 42],
    popupAnchor: [0, -42],
  });
};

// Invalidate size + auto-fit bounds when gems change
const FitBounds = ({ gems }: { gems: GemWithPhotos[] }) => {
  const map = useMap();
  useEffect(() => {
    // Fix for Leaflet containers that start hidden
    setTimeout(() => map.invalidateSize(), 100);

    const withCoords = gems.filter((g) => g.latitude && g.longitude);
    if (withCoords.length === 0) return;
    const bounds = L.latLngBounds(
      withCoords.map((g) => [g.latitude!, g.longitude!] as [number, number])
    );
    map.fitBounds(bounds, { padding: [40, 40], maxZoom: 13 });
  }, [gems, map]);
  return null;
};

interface GemMapProps {
  gems: GemWithPhotos[];
}

const GemMap = ({ gems }: GemMapProps) => {
  const navigate = useNavigate();

  const gemsWithCoords = useMemo(
    () => gems.filter((g) => g.latitude != null && g.longitude != null),
    [gems]
  );

  if (gemsWithCoords.length === 0) {
    return (
      <div className="flex h-[60vh] items-center justify-center rounded-2xl bg-secondary">
        <p className="text-sm text-muted-foreground">No gems with location data to show on the map.</p>
      </div>
    );
  }

  return (
    <div className="h-[60vh] overflow-hidden rounded-2xl border border-border">
      <MapContainer
        center={[20, 0]}
        zoom={2}
        className="h-full w-full"
        zoomControl={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <FitBounds gems={gemsWithCoords} />
        {gemsWithCoords.map((gem) => {
          const avgRating = getAvgRating(gem.reviews);
          const photo = getPrimaryPhoto(gem.gem_photos);
          return (
            <Marker
              key={gem.id}
              position={[gem.latitude!, gem.longitude!]}
              icon={createCategoryIcon(gem.category)}
            >
              <Popup className="gem-popup" minWidth={220} maxWidth={260}>
                <div
                  className="cursor-pointer"
                  onClick={() => navigate(`/gem/${gem.id}`)}
                >
                  <img
                    src={photo}
                    alt={gem.name}
                    className="h-28 w-full rounded-lg object-cover"
                  />
                  <div className="mt-2">
                    <h3 className="text-sm font-semibold text-foreground leading-tight">
                      {gem.name}
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      {gem.city}, {gem.country}
                    </p>
                    <div className="mt-1 flex items-center gap-1">
                      {avgRating > 0 && (
                        <>
                          <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                          <span className="text-xs font-medium">{avgRating}</span>
                          <span className="text-xs text-muted-foreground">
                            ({gem.reviews.length})
                          </span>
                        </>
                      )}
                      <span className="ml-auto rounded-full bg-secondary px-2 py-0.5 text-[10px] font-medium capitalize">
                        {gem.category}
                      </span>
                    </div>
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
};

export default GemMap;
