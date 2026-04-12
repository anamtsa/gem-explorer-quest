import { useEffect, useRef, useMemo } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useNavigate } from "react-router-dom";
import type { GemWithPhotos } from "@/hooks/useGems";
import { getAvgRating, getPrimaryPhoto } from "@/hooks/useGems";

const categoryColors: Record<string, string> = {
  cafe: "#C17F59",
  nature: "#4D9E7B",
  culture: "#7B6DAF",
  market: "#D4853B",
  viewpoint: "#4A9DC9",
  beach: "#E8A54B",
  park: "#5AAF6E",
  museum: "#C25D7C",
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

interface GemMapProps {
  gems: GemWithPhotos[];
}

const GemMap = ({ gems }: GemMapProps) => {
  const navigate = useNavigate();
  const mapRef = useRef<L.Map | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const gemsWithCoords = useMemo(
    () => gems.filter((g) => g.latitude != null && g.longitude != null),
    [gems]
  );

  useEffect(() => {
    if (!containerRef.current || gemsWithCoords.length === 0) return;

    // Initialize map if not already
    if (!mapRef.current) {
      mapRef.current = L.map(containerRef.current, {
        center: [20, 0],
        zoom: 2,
        zoomControl: false,
      });

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      }).addTo(mapRef.current);
    }

    const map = mapRef.current;

    // Clear existing markers
    map.eachLayer((layer) => {
      if (layer instanceof L.Marker) map.removeLayer(layer);
    });

    // Add markers
    gemsWithCoords.forEach((gem) => {
      const avgRating = getAvgRating(gem.reviews);
      const photo = getPrimaryPhoto(gem.gem_photos);
      const ratingHtml =
        avgRating > 0
          ? `<div style="margin-top:4px;display:flex;align-items:center;gap:4px;">
              <span style="color:#f59e0b;">★</span>
              <span style="font-size:12px;font-weight:500;">${avgRating}</span>
              <span style="font-size:12px;color:#888;">(${gem.reviews.length})</span>
             </div>`
          : "";

      const popupContent = `
        <div class="gem-popup-inner" style="cursor:pointer;min-width:200px;">
          <img src="${photo}" alt="${gem.name}" style="width:100%;height:112px;object-fit:cover;border-radius:8px;" />
          <div style="margin-top:8px;">
            <div style="font-size:14px;font-weight:600;line-height:1.3;">${gem.name}</div>
            <div style="font-size:12px;color:#888;margin-top:2px;">${gem.city}, ${gem.country}</div>
            ${ratingHtml}
            <span style="display:inline-block;margin-top:4px;background:#f1f0ee;padding:2px 8px;border-radius:999px;font-size:10px;font-weight:500;text-transform:capitalize;">${gem.category}</span>
          </div>
        </div>`;

      const marker = L.marker([gem.latitude!, gem.longitude!], {
        icon: createCategoryIcon(gem.category),
      }).addTo(map);

      marker.bindPopup(popupContent, {
        className: "gem-popup",
        minWidth: 220,
        maxWidth: 260,
      });

      marker.on("popupopen", () => {
        const el = document.querySelector(".gem-popup-inner");
        el?.addEventListener("click", () => navigate(`/gem/${gem.id}`));
      });
    });

    // Fit bounds
    const bounds = L.latLngBounds(
      gemsWithCoords.map((g) => [g.latitude!, g.longitude!] as [number, number])
    );
    map.fitBounds(bounds, { padding: [40, 40], maxZoom: 13 });

    // Invalidate size after render
    setTimeout(() => map.invalidateSize(), 100);
  }, [gemsWithCoords, navigate]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  if (gemsWithCoords.length === 0) {
    return (
      <div className="flex h-[60vh] items-center justify-center rounded-2xl bg-secondary">
        <p className="text-sm text-muted-foreground">No gems with location data to show on the map.</p>
      </div>
    );
  }

  return (
    <div className="h-[60vh] overflow-hidden rounded-2xl border border-border">
      <div ref={containerRef} className="h-full w-full" />
    </div>
  );
};

export default GemMap;
