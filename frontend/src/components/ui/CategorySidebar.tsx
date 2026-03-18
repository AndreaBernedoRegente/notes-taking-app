"use client";

import { useRouter } from "next/navigation";
import { Category } from "@/types";
import { useAuth } from "@/context/AuthContext";

interface CategorySidebarProps {
  categories: Category[];
  selectedCategory: number | null;
  onSelectCategory: (id: number | null) => void;
}

export default function CategorySidebar({
  categories,
  selectedCategory,
  onSelectCategory,
}: CategorySidebarProps) {
  const { logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <aside className="w-44 flex flex-col gap-2 h-full">
      <button
        onClick={() => onSelectCategory(null)}
        className="text-left text-sm mb-2"
        style={{
          color: "#1a1a1a",
          fontWeight: selectedCategory === null ? "700" : "400",
        }}
      >
        All Categories
      </button>
      {categories.map((category) => (
        <button
          key={category.id}
          onClick={() => onSelectCategory(category.id)}
          className="text-left text-sm flex items-center gap-2 whitespace-nowrap"
          style={{
            color: "#1a1a1a",
            fontWeight: selectedCategory === category.id ? "700" : "400",
          }}
        >
          <span
            className="w-2.5 h-2.5 rounded-full flex-shrink-0"
            style={{ backgroundColor: category.color }}
          />
          <span className="flex-1">{category.name}</span>
          {category.note_count > 0 && (
            <span className="text-xs text-muted">
              {category.note_count}
            </span>
          )}
        </button>
      ))}
      <div className="mt-auto">
        <button
          onClick={handleLogout}
          className="text-sm hover:opacity-70 transition-opacity text-primary"
        >
          Log out
        </button>
      </div>
    </aside>
  );
}
