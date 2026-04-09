import { categories, type Category } from "@/data/mockGems";

interface CategoryPillsProps {
  selected: Category | null;
  onSelect: (cat: Category | null) => void;
}

const CategoryPills = ({ selected, onSelect }: CategoryPillsProps) => (
  <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
    <button
      onClick={() => onSelect(null)}
      className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-all ${
        selected === null
          ? "gem-gradient text-primary-foreground shadow-sm"
          : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
      }`}
    >
      ✨ All
    </button>
    {categories.map((cat) => (
      <button
        key={cat.id}
        onClick={() => onSelect(cat.id === selected ? null : cat.id)}
        className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-all ${
          selected === cat.id
            ? "gem-gradient text-primary-foreground shadow-sm"
            : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
        }`}
      >
        {cat.emoji} {cat.label}
      </button>
    ))}
  </div>
);

export default CategoryPills;
