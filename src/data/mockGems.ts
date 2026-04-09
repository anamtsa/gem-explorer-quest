export type Category = "cafe" | "nature" | "culture" | "market" | "viewpoint" | "beach" | "park" | "museum";

export const categories: { id: Category; label: string; emoji: string }[] = [
  { id: "cafe", label: "Cafés", emoji: "☕" },
  { id: "nature", label: "Nature", emoji: "🌿" },
  { id: "culture", label: "Culture", emoji: "🏛️" },
  { id: "market", label: "Markets", emoji: "🛍️" },
  { id: "viewpoint", label: "Viewpoints", emoji: "🏔️" },
  { id: "beach", label: "Beaches", emoji: "🏖️" },
  { id: "park", label: "Parks", emoji: "🌳" },
  { id: "museum", label: "Museums", emoji: "🎨" },
];
