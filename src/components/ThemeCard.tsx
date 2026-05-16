import { useLocation } from "wouter";
import type { ThemeTemplate } from "@/lib/types";
import { cn } from "@/lib/utils";

interface ThemeCardProps {
  theme: ThemeTemplate;
  compact?: boolean;
}

const ICON_MAP: Record<string, string> = {
  BookOpen: "📖",
  BookMarked: "📑",
  RotateCcw: "🔄",
  Notebook: "📓",
  Target: "🎯",
  FileText: "📝",
  Library: "📚",
  ClipboardCheck: "✅",
  Headphones: "🎧",
  Mic: "🎤",
  Layers: "📚",
  Podcast: "🎙️",
  Radio: "📻",
  GraduationCap: "🎓",
  Briefcase: "💼",
  Film: "🎬",
  Bot: "🤖",
  Terminal: "💻",
  Code: "👨‍💻",
  Workflow: "⚡",
  FileStack: "🗂️",
  GitBranch: "🌿",
  Wrench: "🔧",
  Zap: "⚡",
  Activity: "🏃",
  Footprints: "🚶",
  Accessibility: "🤸",
  TreePine: "🌲",
  Sun: "☀️",
  Heart: "❤️",
  Timer: "⏱️",
  Utensils: "🍽️",
  Moon: "🌙",
  Sunrise: "🌅",
  BedDouble: "🛏️",
  Flower2: "🌸",
  Droplets: "💧",
  CupSoda: "🥤",
  ChefHat: "👨‍🍳",
  Eye: "👁️",
  HeartHandshake: "🤝",
  Book: "📖",
  Clock: "⏰",
  Brain: "🧠",
  Sparkles: "✨",
  Coffee: "☕",
  Wind: "🌬️",
  Trash2: "🗑️",
  Home: "🏠",
  Monitor: "🖥️",
  Shirt: "👕",
  PackageOpen: "📦",
  Building2: "🏢",
  SprayCan: "🧹",
  Smartphone: "📱",
  Laptop: "💻",
  Paintbrush: "🎨",
  Camera: "📷",
  Mug: "☕",
  UtensilsCrossed: "🍴",
  Palette: "🎨",
  Music: "🎵",
  Clapperboard: "🎬",
  NotebookPen: "✏️",
  Users: "👥",
  ThumbsUp: "👍",
  Star: "⭐",
  Ear: "👂",
  Globe: "🌍",
  MessageSquare: "💬",
  Compass: "🧭",
  FolderOpen: "📂",
  Mail: "📧",
  PiggyBank: "🐷",
  ShoppingBag: "🛍️",
  Package: "📦",
  Box: "📦",
  Wallet: "👛",
  Trees: "🌳",
  Store: "🏪",
  Building: "🏙️",
  Train: "🚇",
  Map: "🗺️",
  ShoppingBasket: "🧺",
  BatteryLow: "🔋",
  TimerOff: "⏸️",
  ChevronRight: "➡️",
  Shield: "🛡️",
  Bed: "🛌",
  LifeBuoy: "🛟",
  Sprout: "🌱",
};

export function ThemeCard({ theme, compact = false }: ThemeCardProps) {
  const [, navigate] = useLocation();

  return (
    <div
      className="card cursor-pointer active:scale-[0.98] transition-transform"
      onClick={() => navigate(`/theme/${theme.id}`)}
    >
      <div className="flex items-start gap-3">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center text-lg shrink-0"
          style={{ backgroundColor: `${theme.color}18` }}
        >
          {ICON_MAP[theme.icon] || "📌"}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <h3 className="font-semibold text-[#1E293B] text-base leading-tight truncate">
              {theme.title}
            </h3>
            <span
              className="text-[10px] px-1.5 py-0.5 rounded-full font-medium shrink-0"
              style={{
                backgroundColor: `${theme.color}18`,
                color: theme.color,
              }}
            >
              {theme.category}
            </span>
          </div>
          <p className="text-sm text-[#64748B] leading-relaxed line-clamp-2">
            {theme.description}
          </p>
          <div className="flex flex-wrap gap-1.5 mt-2">
            {theme.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="text-[10px] px-1.5 py-0.5 bg-[#F1F5F9] text-[#64748B] rounded"
              >
                {tag}
              </span>
            ))}
          </div>
          <p className="text-xs text-[#94A3B8] mt-1.5">
            🎯 {theme.weeklyGoal}
          </p>
        </div>
      </div>
    </div>
  );
}
