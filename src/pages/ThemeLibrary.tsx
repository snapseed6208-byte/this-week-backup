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
import { getIconComponent, MOOD_ICON, CATEGORY_ICON } from "@/lib/icon-map";
import { Search, Sparkles } from "lucide-react";

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
      {/* ── Curator intro ── */}
      <p className="text-sm text-[#8B867D] leading-relaxed -mt-3 mb-5">
        不知道这一周怎么过？从一个小主题开始。
      </p>

      {/* ── Search — integrated ── */}
      <div className="relative mb-5">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#BFB8AD]" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="搜索主题..."
          className="w-full rounded-xl border border-[#E8E1D6] bg-[#FFFDF8] pl-10 pr-3.5 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-[#8FA58E]/40 focus:border-[#8FA58E]/40 text-[#2F2D28] placeholder:text-[#BFB8AD] transition-all"
        />
      </div>

      {/* ── Mood / State — gentle question ── */}
      <div className="mb-6">
        <p className="text-[13px] font-medium text-[#2F2D28] mb-3">
          你现在更需要什么？
        </p>

        {/* Mood cards grid — always visible */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {(Object.entries(MOOD_LABELS) as [UserMood, string][]).map(
            ([mood, label]) => {
              const Icon = MOOD_ICON[mood];
              return (
                <button
                  key={mood}
                  onClick={() => handleMoodSelect(mood)}
                  className={cn(
                    "flex items-center gap-2.5 py-3 px-3.5 rounded-xl text-sm font-medium transition-all text-left",
                    selectedMood === mood
                      ? "bg-[#8FA58E] text-white shadow-sm"
                      : "bg-[#FFFDF8] border border-[#E8E1D6] text-[#8B867D] hover:border-[#DDE7D8] hover:text-[#2F2D28]",
                  )}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  <span>{label}</span>
                </button>
              );
            },
          )}
        </div>

        {/* Mood-based results */}
        {selectedMood && moodThemes.length > 0 && (
          <div className="mt-4 animate-in fade-in slide-in-from-top-2 duration-200">
            <p className="text-xs text-[#BFB8AD] mb-2.5">
              为你推荐 {moodThemes.length} 个主题
            </p>
            <div className="space-y-2.5">
              {moodThemes.map((theme) =>
                theme ? <ThemeCard key={theme.id} theme={theme} /> : null,
              )}
            </div>
          </div>
        )}
      </div>

      {/* ── Recommended themes (horizontal curated) ── */}
      {!searchQuery && !selectedMood && (
        <div className="mb-6">
          <h3 className="section-label">
            {recommendedThemes.length > 0
              ? "如果不确定，可以从这里开始"
              : "精选推荐"}
          </h3>
          <div className="flex gap-3 overflow-x-auto scroll-x pb-2 -mx-1 px-1">
            {recommendedThemes.map(
              (theme) =>
                theme && (
                  <Link
                    key={theme.id}
                    href={`/theme/${theme.id}`}
                    className="shrink-0 w-52 p-5 rounded-xl bg-[#FFFDF8] border border-[#E8E1D6] text-left hover:border-[#DDE7D8] hover:shadow-sm transition-all active:opacity-80"
                  >
                    <div
                      className="w-9 h-9 rounded-xl flex items-center justify-center text-base mb-3.5"
                      style={{ backgroundColor: `${theme.color}14` }}
                    >
                      {(() => {
                        const Icon = getIconComponent(theme.icon);
                        return <Icon className="h-4 w-4" style={{ color: theme.color }} />;
                      })()}
                    </div>
                    <p className="text-[15px] font-semibold text-[#2F2D28] mb-1.5 leading-tight">
                      {theme.title}
                    </p>
                    <p className="text-xs text-[#8B867D] leading-relaxed line-clamp-2">
                      {theme.description}
                    </p>
                  </Link>
                ),
            )}
          </div>
        </div>
      )}

      {/* ── Category filter pills ── */}
      <div className="mb-4">
        <p className="section-label">按类别浏览</p>
        <div className="flex gap-2 overflow-x-auto scroll-x pb-1">
          {["全部", ...CATEGORIES].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={cn(
                "shrink-0 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5",
                selectedCategory === cat
                  ? "bg-[#8FA58E] text-white"
                  : "bg-[#FFFDF8] border border-[#E8E1D6] text-[#8B867D] hover:border-[#DDE7D8]",
              )}
            >
              {cat !== "全部" && (() => {
                const CatIcon = CATEGORY_ICON[cat as ThemeCategory];
                return CatIcon ? <CatIcon className="h-3 w-3" /> : null;
              })()}
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* ── Theme grid ── */}
      <div className="flex items-center justify-between mb-3.5">
        <p className="text-xs text-[#BFB8AD]">{filteredThemes.length} 个主题</p>
      </div>

      {filteredThemes.length > 0 ? (
        <div className="space-y-2.5">
          {filteredThemes.map((theme) => (
            <ThemeCard key={theme.id} theme={theme} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 text-[#BFB8AD]">
          <div className="w-12 h-12 rounded-full bg-[#F3EFE8] flex items-center justify-center mx-auto mb-4">
            <Search className="h-5 w-5 text-[#BFB8AD]" />
          </div>
          <p className="text-sm">没有找到匹配的主题</p>
          <p className="text-xs mt-1.5">试试其他关键词吧</p>
        </div>
      )}
    </Layout>
  );
}
