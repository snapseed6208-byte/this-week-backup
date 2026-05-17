import { useState } from "react";
import { useRoute, useLocation } from "wouter";
import { Layout } from "@/components/Layout";
import { getThemeById } from "@/lib/themes";
import { startThemeWeek } from "@/lib/storage";
import { getIconComponent } from "@/lib/icon-map";
import { ArrowLeft, Sparkles, Check, Search } from "lucide-react";

export function ThemeDetailPage() {
  const [, params] = useRoute("/theme/:id");
  const [, navigate] = useLocation();
  const [started, setStarted] = useState(false);

  const themeId = params?.id;
  const theme = themeId ? getThemeById(themeId) : undefined;

  if (!theme) {
    return (
      <Layout>
        <div className="text-center py-20">
          <div className="w-12 h-12 rounded-full bg-[#F3EFE8] flex items-center justify-center mx-auto mb-4">
            <Search className="h-5 w-5 text-[#BFB8AD]" />
          </div>
          <p className="text-sm text-[#8B867D]">主题未找到</p>
          <button
            onClick={() => navigate("/library")}
            className="mt-4 text-sm text-[#8FA58E] font-medium"
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
      setTimeout(() => {
        navigate("/");
      }, 1500);
    }
  };

  const IconComponent = getIconComponent(theme.icon);

  return (
    <Layout>
      {/* ── Back button ── */}
      <button
        onClick={() => navigate("/library")}
        className="flex items-center gap-1 text-sm text-[#8B867D] mb-5 hover:text-[#2F2D28] transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        返回主题库
      </button>

      {/* ══════════════════════════════════════════
         HERO — Atmospheric theme introduction
         ══════════════════════════════════════════ */}
      <div
        className="rounded-2xl mb-6 overflow-hidden"
        style={{ backgroundColor: `${theme.color}06` }}
      >
        <div className="px-6 py-10 text-center relative">
          {/* Background glow */}
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full pointer-events-none"
            style={{
              background: `radial-gradient(circle, ${theme.color}10 0%, transparent 70%)`,
            }}
          />
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 relative"
            style={{ backgroundColor: `${theme.color}14` }}
          >
            <IconComponent className="h-7 w-7" style={{ color: theme.color }} />
          </div>
          <h1 className="text-2xl font-semibold text-[#2F2D28] mb-2 relative">
            {theme.title}
          </h1>
          <span
            className="inline-block text-[11px] px-3 py-1 rounded-full font-medium relative"
            style={{ backgroundColor: `${theme.color}12`, color: theme.color }}
          >
            {theme.category}
          </span>
          <p className="text-sm text-[#8B867D] mt-4 leading-relaxed max-w-sm mx-auto relative">
            {theme.description}
          </p>
        </div>
      </div>

      {/* ══════════════════════════════════════════
         DETAIL SECTIONS — With varied visual treatment
         ══════════════════════════════════════════ */}

      <div className="space-y-3">
        {/* Suitable for — soft tinted section */}
        <div className="rounded-2xl p-5 bg-[#FFFDF8] border border-[#E8E1D6]">
          <h3 className="text-[11px] font-medium text-[#BFB8AD] mb-3 tracking-wide">
            适合这样的你
          </h3>
          <ul className="space-y-2">
            {theme.suitableFor.map((item, i) => (
              <li
                key={i}
                className="text-sm text-[#2F2D28] flex items-start gap-2.5 leading-relaxed"
              >
                <span
                  className="w-1.5 h-1.5 rounded-full mt-[7px] shrink-0"
                  style={{ backgroundColor: theme.color }}
                />
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Weekly Goal — elevated card */}
        <div className="card-elevated">
          <h3 className="text-[11px] font-medium text-[#BFB8AD] mb-2 tracking-wide">
            本周目标
          </h3>
          <p className="text-sm text-[#2F2D28] font-medium leading-relaxed">
            {theme.weeklyGoal}
          </p>
        </div>

        {/* Daily Action — tinted softly */}
        <div
          className="rounded-2xl p-5"
          style={{ backgroundColor: `${theme.color}06` }}
        >
          <h3 className="text-[11px] font-medium text-[#BFB8AD] mb-2 tracking-wide">
            每日小行动
          </h3>
          <p
            className="text-sm font-medium leading-relaxed"
            style={{ color: theme.color }}
          >
            {theme.dailyAction}
          </p>
        </div>

        {/* Minimum Standard — soft card */}
        <div className="card-soft">
          <h3 className="text-[11px] font-medium text-[#BFB8AD] mb-2 tracking-wide">
            最低完成标准
          </h3>
          <p className="text-sm text-[#8B867D] leading-relaxed">
            {theme.minimumStandard}
          </p>
        </div>

        {/* Check-in type */}
        <div className="card">
          <h3 className="text-[11px] font-medium text-[#BFB8AD] mb-2 tracking-wide">
            打卡方式
          </h3>
          <p className="text-sm text-[#8B867D] leading-relaxed">
            {theme.checkInType}
          </p>
        </div>

        {/* Review questions — timeline style */}
        <div className="card">
          <h3 className="text-[11px] font-medium text-[#BFB8AD] mb-3 tracking-wide">
            周末复盘问题
          </h3>
          <div className="space-y-3">
            {theme.reviewQuestions.map((q, i) => (
              <div key={i} className="flex gap-3">
                <div className="flex flex-col items-center">
                  <div className="w-5 h-5 rounded-full bg-[#EEF3EB] flex items-center justify-center text-[10px] font-medium text-[#8FA58E] shrink-0">
                    {i + 1}
                  </div>
                  {i < theme.reviewQuestions.length - 1 && (
                    <div className="w-px flex-1 bg-[#F3EFE8] mt-1" />
                  )}
                </div>
                <p className="text-sm text-[#2F2D28] leading-relaxed pb-3">
                  {q}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Tags */}
        <div className="card">
          <h3 className="text-[11px] font-medium text-[#BFB8AD] mb-2.5 tracking-wide">
            标签
          </h3>
          <div className="flex flex-wrap gap-1.5">
            {theme.tags.map((tag) => (
              <span
                key={tag}
                className="text-[11px] px-2.5 py-1 bg-[#F3EFE8] text-[#8B867D] rounded leading-relaxed"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════
         START BUTTON — Fixed-style at bottom
         ══════════════════════════════════════════ */}
      <div className="mt-7 mb-4">
        <div
          className="rounded-2xl p-5 text-center mb-4"
          style={{ backgroundColor: `${theme.color}04` }}
        >
          <p className="text-sm text-[#8B867D] leading-relaxed">
            用 7 天时间，慢慢靠近你想要的状态。
          </p>
          <p className="text-xs text-[#BFB8AD] mt-1">不用完美，出现就很好。</p>
        </div>
        <button
          onClick={handleStart}
          disabled={started}
          className="w-full py-3 rounded-xl font-medium text-sm text-white bg-[#8FA58E] hover:bg-[#7A9279] active:opacity-90 transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-sm"
        >
          {started ? (
            <>
              <Check className="h-4 w-4" />
              已开启，正在跳转...
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4" />
              选择这个主题
            </>
          )}
        </button>
      </div>
    </Layout>
  );
}
