import { useLocation } from "wouter";
import type { ThemeTemplate } from "@/lib/types";

interface ThemeCardProps {
  theme: ThemeTemplate;
  compact?: boolean;
}

const ICON_MAP: Record<string, string> = {
  BookOpen: "📖", BookMarked: "📑", RotateCcw: "🔄",
  Notebook: "📓", Target: "🎯", FileText: "📝",
  Library: "📚", ClipboardCheck: "✅", Headphones: "🎧",
  Mic: "🎤", Layers: "📚", Podcast: "🎙️",
  Radio: "📻", GraduationCap: "🎓", Briefcase: "💼",
  Film: "🎬", Bot: "🤖", Terminal: "💻", Code: "👨‍💻",
  Workflow: "⚡", FileStack: "🗂️", GitBranch: "🌿",
  Wrench: "🔧", Zap: "⚡", Activity: "🏃",
  Footprints: "🚶", Accessibility: "🤸", TreePine: "🌲",
  Sun: "☀️", Heart: "❤️", Timer: "⏱️", Utensils: "🍽️",
  Moon: "🌙", Sunrise: "🌅", BedDouble: "🛏️",
  Flower2: "🌸", Droplets: "💧", CupSoda: "🥤",
  ChefHat: "👨‍🍳", Eye: "👁️", HeartHandshake: "🤝",
  Book: "📖", Clock: "⏰", Brain: "🧠", Sparkles: "✨",
  Coffee: "☕", Wind: "🌬️", Trash2: "🗑️", Home: "🏠",
  Monitor: "🖥️", Shirt: "👕", PackageOpen: "📦",
  Building2: "🏢", SprayCan: "🧹", Smartphone: "📱",
  Laptop: "💻", Paintbrush: "🎨", Camera: "📷",
  Mug: "☕", UtensilsCrossed: "🍴", Palette: "🎨",
  Music: "🎵", Clapperboard: "🎬", NotebookPen: "✏️",
  Users: "👥", ThumbsUp: "👍", Star: "⭐", Ear: "👂",
  Globe: "🌍", MessageSquare: "💬", Compass: "🧭",
  FolderOpen: "📂", Mail: "📧", PiggyBank: "🐷",
  ShoppingBag: "🛍️", Package: "📦", Box: "📦",
  Wallet: "👛", Trees: "🌳", Store: "🏪", Building: "🏙️",
  Train: "🚇", Map: "🗺️", ShoppingBasket: "🧺",
  BatteryLow: "🔋", TimerOff: "⏸️", ChevronRight: "➡️",
  Shield: "🛡️", Bed: "🛌", LifeBuoy: "🛟", Sprout: "🌱",
};

export function ThemeCard({ theme }: ThemeCardProps) {
  const [, navigate] = useLocation();

  return (
    <div
      className="card cursor-pointer active:opacity-80 transition-opacity"
      onClick={() => navigate(`/theme/${theme.id}`)}
    >
      <div className="flex items-start gap-4">
        {/* Icon */}
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center text-base shrink-0"
          style={{ backgroundColor: `${theme.color}14` }}
        >
          {ICON_MAP[theme.icon] || "📌"}
        </div>

        <div className="flex-1 min-w-0">
          {/* Title — prominent */}
          <h3 className="text-[16px] font-semibold text-[#2C2A28] leading-tight mb-1">
            {theme.title}
          </h3>

          {/* Description — the hook */}
          <p className="text-sm text-[#8B8680] leading-relaxed line-clamp-2">
            {theme.description}
          </p>
        </div>
      </div>
    </div>
  );
}
