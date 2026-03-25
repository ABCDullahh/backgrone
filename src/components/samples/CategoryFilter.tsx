"use client";

import { CATEGORIES, type Category } from "@/lib/data/samples";

interface CategoryFilterProps {
  active: Category;
  onChange: (category: Category) => void;
}

export function CategoryFilter({ active, onChange }: CategoryFilterProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {CATEGORIES.map((cat) => {
        const isActive = active === cat;
        return (
          <button
            key={cat}
            type="button"
            onClick={() => onChange(cat)}
            className={`px-5 py-2 font-label text-[10px] uppercase tracking-widest transition-colors ${
              isActive
                ? "bg-primary text-white"
                : "bg-surface-container text-on-surface hover:bg-surface-dim"
            }`}
          >
            {cat}
          </button>
        );
      })}
    </div>
  );
}
