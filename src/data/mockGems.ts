import gemCafe from "@/assets/gem-cafe.jpg";
import gemViewpoint from "@/assets/gem-viewpoint.jpg";
import gemGarden from "@/assets/gem-garden.jpg";
import gemMarket from "@/assets/gem-market.jpg";
import gemBeach from "@/assets/gem-beach.jpg";

export type Category = "cafe" | "nature" | "culture" | "market" | "viewpoint" | "beach" | "park" | "museum";

export interface Gem {
  id: string;
  name: string;
  country: string;
  city: string;
  lat: number;
  lon: number;
  category: Category;
  description: string;
  whySpecial: string;
  tips: string;
  image: string;
  rating: number;
  reviewCount: number;
  likes: number;
  tags: string[];
  addedBy: string;
  addedAt: string;
  saved?: boolean;
  liked?: boolean;
}

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

export const mockGems: Gem[] = [
  {
    id: "1",
    name: "Caffè degli Artisti",
    country: "Italy",
    city: "Rome",
    lat: 41.8967,
    lon: 12.4822,
    category: "cafe",
    description: "A tiny café hidden in a narrow alley near Trastevere. The walls are covered in local art and the espresso is perfection.",
    whySpecial: "Locals-only feel, no tourists, the owner shares stories of old Rome.",
    tips: "Go before 9am for the freshest cornetti. Cash only.",
    image: gemCafe,
    rating: 4.8,
    reviewCount: 24,
    likes: 142,
    tags: ["cozy", "authentic", "espresso", "art"],
    addedBy: "MarcoT",
    addedAt: "2024-12-15",
  },
  {
    id: "2",
    name: "Eagle's Nest Viewpoint",
    country: "Switzerland",
    city: "Interlaken",
    lat: 46.6863,
    lon: 7.8632,
    category: "viewpoint",
    description: "A breathtaking viewpoint accessible via a hidden trail that overlooks a turquoise alpine lake. Most hikers miss the turnoff.",
    whySpecial: "Completely untouched by tourism, you'll likely have it to yourself.",
    tips: "Take the left fork at the wooden sign with the eagle carving. 20min detour.",
    image: gemViewpoint,
    rating: 4.9,
    reviewCount: 12,
    likes: 287,
    tags: ["hiking", "mountains", "lake", "peaceful"],
    addedBy: "AlpineExplorer",
    addedAt: "2025-01-08",
  },
  {
    id: "3",
    name: "The Forgotten Garden",
    country: "England",
    city: "Bath",
    lat: 51.3811,
    lon: -2.3590,
    category: "park",
    description: "A walled garden tucked behind a row of Georgian townhouses. Ancient stone walls draped in ivy with a small medieval fountain.",
    whySpecial: "Feels like stepping into a fairytale. Perfect for reading or sketching.",
    tips: "Enter through the small wooden gate on Lansdown Crescent. Free entry.",
    image: gemGarden,
    rating: 4.7,
    reviewCount: 31,
    likes: 198,
    tags: ["garden", "peaceful", "historic", "fairytale"],
    addedBy: "BathLocal",
    addedAt: "2025-02-20",
  },
  {
    id: "4",
    name: "Grandmother's Spice Market",
    country: "Vietnam",
    city: "Hoi An",
    lat: 15.8801,
    lon: 108.3380,
    category: "market",
    description: "A vibrant local market hidden behind the tourist strip. Handmade crafts, fresh spices, and the best bánh mì you'll ever eat.",
    whySpecial: "The families here have been trading for generations. Authentic prices, no markup.",
    tips: "Visit early morning (6-8am). Try the turmeric rice from the stall with blue cloth.",
    image: gemMarket,
    rating: 4.6,
    reviewCount: 45,
    likes: 321,
    tags: ["food", "spices", "local", "authentic"],
    addedBy: "VietNomad",
    addedAt: "2025-03-01",
  },
  {
    id: "5",
    name: "Praia do Segredo",
    country: "Portugal",
    city: "Lagos",
    lat: 37.0879,
    lon: -8.6730,
    category: "beach",
    description: "A secret cove accessible only through a narrow cliff passage at low tide. Crystal clear turquoise waters and dramatic rock formations.",
    whySpecial: "Feels like your own private paradise. The cliff passage makes it feel like an adventure.",
    tips: "Only accessible 2 hours before/after low tide. Check tide charts!",
    image: gemBeach,
    rating: 4.9,
    reviewCount: 18,
    likes: 456,
    tags: ["secret", "swimming", "cliffs", "adventure"],
    addedBy: "AlgarveSecrets",
    addedAt: "2025-03-15",
  },
];
