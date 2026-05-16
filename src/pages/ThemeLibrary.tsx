import { useState, useMemo } from "react";
import { useLocation, Link } from "wouter";
import { Layout } from "@/components/Layout";
import { ThemeCard } from "@/components/ThemeCard";
import { cn } from "@/lib/utils";
import {
  THEME_TEMPLATES,
  CATEGORIES,
  getRecommendedThemeIds,
  MOOD_TO_THEMES,
  MOOD_LABELS,
} from "@/lib/themes";
import type { ThemeCategory, UserMood } from "@/lib/types";
import { Search, Sparkles, ChevronRight } from "lucide-react";

const ICON_MAP: Record<string, string> = {
  BookOpen: "📖", BookMarked: "📑", RotateCcw: "🔄",
  Notebook: "📓", Target: "🎯", FileText: "📝",
  Library: "📚", ClipboardCheck: "✅", Headphones: "🎧",
  Mic: "🎤", Layers: "📚", Podcast: "🎙️",
  Bot: "🤖", Activity: "🏃", Moon: "🌙",
  Heart: "❤️", Sparkles: "✨", Home: "🏠",
  Users: "👥", Briefcase: "💼", PiggyBank: "🐷",
  Map: "🗺️", BatteryLow: "🔋",
  Languages: "🌐", HeartHandshake: "🤝",
  Paintbrush: "🎨",
};

const MOOD_EMOJI: Record<UserMood, string> = {
  tired: "😴",
  wantDiscipline: "💪",
  wantStudy: "📚",
  wantEnglish: "🌐",
  wantHealth: "❤️",
  wantFun: "🎨",
  wantOrganize: "🏠",
  wantJob: "💼",
};

export function ThemeLibraryPage() {
  const [, navigate] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("全部");
  const [showMoodSelector, setShowMoodSelector] = useState(false);
  const [selectedMood, setSelectedMood] = useState<UserMood | null>(null);

  const recommendedIds = getRecommendedThemeIds();
  const recommendedThemes = recommendedIds
    .map((id) => THEME_TEMPLATES.find((t) => t.id === id))
    .filter(Boolean);

  const moodThemeIds = selectedMood ? MOOD_TO_THEMES[selectedMood] : [];
  const moodThemes = moodThemeIds
    .map((id) => THEME_TEMPLATES.find((t) => t.id === id))
    .filter(Boolean);

  const filteredThemes = useMemo(() => {
    let list = THEME_TEMPLATES;

    if (selectedCategory !== "全部") {
      list = list.filter((t) => t.category === selectedCategory);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (t) =>
          t.title.toLowerCase().includes(q) ||
          t.tags.some((tag) => tag.toLowerCase().includes(q)) ||
          t.category.toLowerCase().includes(q) ||
          t.description.toLowerCase().includes(q),
      );
    }

    return list;
  }, [selectedCategory, searchQuery]);

  const handleMoodSelect = (mood: UserMood) => {
    setSelectedMood(mood === selectedMood ? null : mood);
    setShowMoodSelector(false);
  };

  return (
    <Layout title="主题库">
      {/* ── Search bar ── */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#94A3B8]" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="搜索主题..."
          className="w-full rounded-xl border border-[#E2E8F0] bg-white pl-9 pr-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#8B5CF6] focus:border-transparent"
        />
      </div>

      {/* ── Mood / State selector ── */}
      <div className="mb-4">
        <button
          onClick={() => setShowMoodSelector(!showMoodSelector)}
          className={cn(
            "w-full rounded-xl border border-dashed p-3 text-sm transition-colors text-left",
            selectedMood
              ? "border-[#8B5CF6] bg-purple-50 text-[#7C3AED] font-medium"
              : "border-[#E2E8F0] text-[#64748B]",
          )}
        >
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              {selectedMood ? (
                <>
                  <span>{MOOD_EMOJI[selectedMood]}</span>
                  {MOOD_LABELS[selectedMood]}
                  {moodThemes.length > 0 && (
                    <span className="text-xs text-[#94A3B8] font-normal">
                      · 推荐 {moodThemes.length} 个主题
                    </span>
                  )}
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  我现在的状态是...
                </>
              )}
            </span>
            <ChevronRight
              className={cn(
                "h-4 w-4 transition-transform",
                showMoodSelector && "rotate-90",
              )}
            />
          </div>
        </button>

        {showMoodSelector && (
          <div className="mt-2 grid grid-cols-2 gap-1.5 animate-in fade-in slide-in-from-top-2 duration-200">
            {(Object.entries(MOOD_LABELS) as [UserMood, string][]).map(
              ([mood, label]) => (
                <button
                  key={mood}
                  onClick={() => handleMoodSelect(mood)}
                  className={cn(
                    "py-2.5 px-3 rounded-lg text-xs font-medium transition-colors text-left",
                    selectedMood === mood
                      ? "bg-[#8B5CF6] text-white"
                      : "bg-white border border-[#E2E8F0] text-[#64748B] hover:border-[#8B5CF6]",
                  )}
                >
                  <span className="mr-1">{MOOD_EMOJI[mood]}</span>
                  {label}
                </button>
              ),
            )}
          </div>
        )}
      </div>

      {/* ── Mood-based recommendations ── */}
      {selectedMood && moodThemes.length > 0 && (
        <div className="mb-4">
          <h3 className="text-xs font-medium text-[#64748B] mb-2 uppercase tracking-wider">
            为你推荐
          </h3>
          <div className="space-y-2">
            {moodThemes.map((theme) =>
              theme ? <ThemeCard key={theme.id} theme={theme} /> : null,
            )}
          </div>
        </div>
      )}

      {/* ── Recommended themes ── */}
      {!searchQuery && !selectedMood && (
        <div className="mb-4">
          <h3 className="text-xs font-medium text-[#64748B] mb-2 uppercase tracking-wider">
            推荐主题
          </h3>
          <div className="flex gap-2 overflow-x-auto scroll-x pb-1">
            {recommendedThemes.map(
              (theme) =>
                theme && (
                  <Link
                    key={theme.id}
                    href={`/theme/${theme.id}`}
                    className="shrink-0 w-40 p-3 rounded-xl bg-white border border-[#E2E8F0] text-left active:scale-[0.97] transition-transform hover:border-[#8B5CF6]/30"
                  >
                    <div className="text-lg mb-1">
                      {ICON_MAP[theme.icon] || "📌"}
                    </div>
                    <p className="text-sm font-semibold text-[#1E293B] mb-0.5">
                      {theme.title}
                    </p>
                    <p className="text-xs text-[#64748B] line-clamp-2">
                      {theme.description}
                    </p>
                  </Link>
                ),
            )}
          </div>
        </div>
      )}

      {/* ── Category tabs ── */}
      <div className="flex gap-1.5 mb-3 overflow-x-auto scroll-x pb-1">
        {["全部", ...CATEGORIES].map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={cn(
              "shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors",
              selectedCategory === cat
                ? "bg-[#8B5CF6] text-white"
                : "bg-white border border-[#E2E8F0] text-[#64748B] hover:border-[#8B5CF6]",
            )}
          >
            {cat === "全部" ? "🏷️ 全部" : `${ICON_MAP[cat] || ""} ${cat}`}
          </button>
        ))}
      </div>

      {/* ── Theme count ── */}
      <p className="text-xs text-[#94A3B8] mb-3">
        {filteredThemes.length} 个主题
      </p>

      {/* ── Theme grid ── */}
      {filteredThemes.length > 0 ? (
        <div className="space-y-2">
          {filteredThemes.map((theme) => (
            <ThemeCard key={theme.id} theme={theme} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 text-[#94A3B8]">
          <p className="text-3xl mb-2">🔍</p>
          <p className="text-sm">没有找到匹配的主题</p>
          <p className="text-xs mt-1">试试其他关键词吧</p>
        </div>
      )}
    </Layout>
  );
}
