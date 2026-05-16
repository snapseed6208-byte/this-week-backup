import { useState } from "react";
import { useRoute, useLocation } from "wouter";
import { Layout } from "@/components/Layout";
import { getThemeById } from "@/lib/themes";
import { startThemeWeek } from "@/lib/storage";
import { ArrowLeft, Sparkles, Check } from "lucide-react";

export function ThemeDetailPage() {
  const [, params] = useRoute("/theme/:id");
  const [, navigate] = useLocation();
  const [started, setStarted] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const themeId = params?.id;
  const theme = themeId ? getThemeById(themeId) : undefined;

  if (!theme) {
    return (
      <Layout>
        <div className="text-center py-16">
          <p className="text-3xl mb-2">🔍</p>
          <p className="text-sm text-[#64748B]">主题未找到</p>
          <button
            onClick={() => navigate("/library")}
            className="mt-4 text-sm text-[#8B5CF6] font-medium"
          >
            返回主题库
          </button>
        </div>
      </Layout>
    );
  }

  const handleStart = () => {
    const result = startThemeWeek(theme.id);
    if (result) {
      setStarted(true);
      setShowSuccess(true);
      setTimeout(() => {
        navigate("/");
      }, 1500);
    }
  };

  // ── Icon mapping ──
  const iconMap: Record<string, string> = {
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

  return (
    <Layout>
      {/* ── Back button ── */}
      <button
        onClick={() => navigate("/library")}
        className="flex items-center gap-1 text-sm text-[#64748B] mb-4"
      >
        <ArrowLeft className="h-4 w-4" />
        返回主题库
      </button>

      {/* ── Theme header ── */}
      <div className="card mb-4 text-center py-8">
        <div
          className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-3"
          style={{ backgroundColor: `${theme.color}18` }}
        >
          {iconMap[theme.icon] || "📌"}
        </div>
        <h1 className="text-2xl font-bold text-[#1E293B] mb-1">
          {theme.title}
        </h1>
        <span
          className="inline-block text-xs px-2 py-1 rounded-full font-medium"
          style={{
            backgroundColor: `${theme.color}18`,
            color: theme.color,
          }}
        >
          {theme.category}
        </span>
        <p className="text-sm text-[#64748B] mt-3 leading-relaxed">
          {theme.description}
        </p>
      </div>

      {/* ── Detail sections ── */}
      <div className="space-y-3">
        {/* Suitable for */}
        <div className="card">
          <h3 className="text-xs font-medium text-[#94A3B8] uppercase tracking-wider mb-2">
            适合这样的你
          </h3>
          <ul className="space-y-1">
            {theme.suitableFor.map((item, i) => (
              <li key={i} className="text-sm text-[#1E293B] flex items-start gap-2">
                <span className="text-[#8B5CF6] mt-0.5">·</span>
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Weekly Goal */}
        <div className="card">
          <h3 className="text-xs font-medium text-[#94A3B8] uppercase tracking-wider mb-2">
            🎯 本周目标
          </h3>
          <p className="text-sm text-[#1E293B] font-medium">
            {theme.weeklyGoal}
          </p>
        </div>

        {/* Daily Action */}
        <div className="card">
          <h3 className="text-xs font-medium text-[#94A3B8] uppercase tracking-wider mb-2">
            📋 每日小行动
          </h3>
          <p className="text-sm text-[#1E293B]">{theme.dailyAction}</p>
        </div>

        {/* Minimum Standard */}
        <div className="card">
          <h3 className="text-xs font-medium text-[#94A3B8] uppercase tracking-wider mb-2">
            🌱 最低完成标准
          </h3>
          <p className="text-sm text-[#64748B]">{theme.minimumStandard}</p>
        </div>

        {/* Check-in type */}
        <div className="card">
          <h3 className="text-xs font-medium text-[#94A3B8] uppercase tracking-wider mb-2">
            ✅ 打卡方式
          </h3>
          <p className="text-sm text-[#64748B]">{theme.checkInType}</p>
        </div>

        {/* Review questions */}
        <div className="card">
          <h3 className="text-xs font-medium text-[#94A3B8] uppercase tracking-wider mb-2">
            📝 周末复盘问题
          </h3>
          <ul className="space-y-1">
            {theme.reviewQuestions.map((q, i) => (
              <li key={i} className="text-sm text-[#1E293B] flex items-start gap-2">
                <span className="text-[#F59E0B] shrink-0">{i + 1}.</span>
                {q}
              </li>
            ))}
          </ul>
        </div>

        {/* Tags */}
        <div className="card">
          <h3 className="text-xs font-medium text-[#94A3B8] uppercase tracking-wider mb-2">
            标签
          </h3>
          <div className="flex flex-wrap gap-1.5">
            {theme.tags.map((tag) => (
              <span
                key={tag}
                className="text-xs px-2 py-1 bg-[#F1F5F9] text-[#64748B] rounded"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ── Start button ── */}
      <div className="mt-6 mb-4">
        <button
          onClick={handleStart}
          disabled={started}
          className="w-full py-3.5 rounded-xl font-medium text-white bg-gradient-to-r from-[#8B5CF6] to-[#7C3AED] active:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {started ? (
            <>
              <Check className="h-4 w-4" />
              已开启，正在跳转...
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4" />
              开启这个主题周
            </>
          )}
        </button>
      </div>
    </Layout>
  );
}
