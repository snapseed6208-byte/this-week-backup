import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Layout } from "@/components/Layout";
import { CheckInModal } from "@/components/CheckInModal";
import { cn } from "@/lib/utils";
import {
  getActiveWeek,
  getLastCompletedWeek,
  checkInDate,
  completeWeek,
  today,
  getWeekDates,
} from "@/lib/storage";
import type { ThemeWeek } from "@/lib/types";
import { getIconComponent } from "@/lib/icon-map";
import { Sparkles, ArrowRight, BookOpen, Headphones, Activity, Moon } from "lucide-react";

const DAY_LABELS = ["一", "二", "三", "四", "五", "六", "日"];

const QUICK_STARTS = [
  {
    id: "reading-week",
    title: "阅读周",
    desc: "一周时间，和一本书好好相处。",
    icon: BookOpen,
    color: "#6366F1",
  },
  {
    id: "early-sleep-week",
    title: "早睡周",
    desc: "调整作息，从今晚早睡半小时开始。",
    icon: Moon,
    color: "#1E3A5F",
  },
  {
    id: "exercise-week",
    title: "运动周",
    desc: "每天动一动，恢复身体的力量感。",
    icon: Activity,
    color: "#10B981",
  },
  {
    id: "english-input-week",
    title: "英语输入周",
    desc: "每天接触一点英语，保持语感。",
    icon: Headphones,
    color: "#3B82F6",
  },
];

export function HomePage() {
  const [, navigate] = useLocation();
  const [activeWeek, setActiveWeek] = useState<ThemeWeek | undefined>(
    getActiveWeek(),
  );
  const [lastCompleted, setLastCompleted] = useState<ThemeWeek | undefined>(
    getLastCompletedWeek(),
  );
  const [showCheckIn, setShowCheckIn] = useState(false);
  const [showReview, setShowReview] = useState(false);
  const [reviewGain, setReviewGain] = useState("");
  const [reviewStruggle, setReviewStruggle] = useState("");
  const [continueNext, setContinueNext] = useState(true);
  const [reviewNotes, setReviewNotes] = useState("");

  useEffect(() => {
    setActiveWeek(getActiveWeek());
    setLastCompleted(getLastCompletedWeek());
  }, []);

  const handleCheckIn = (
    status: "full" | "light" | "missed",
    note?: string,
    value?: number,
  ) => {
    if (!activeWeek) return;
    const updated = checkInDate(activeWeek.id, today(), status, note, value);
    if (updated) setActiveWeek({ ...updated });
    setShowCheckIn(false);
  };

  const handleReviewSubmit = () => {
    if (!activeWeek) return;
    completeWeek(activeWeek.id, {
      biggestGain: reviewGain,
      struggleReason: reviewStruggle,
      continueNextWeek: continueNext,
      notes: reviewNotes || undefined,
    });
    setActiveWeek(undefined);
    setLastCompleted(getLastCompletedWeek());
    setShowReview(false);
  };

  const todayCheckIn = activeWeek?.checkIns?.find((c) => c.date === today());
  const weekDates = activeWeek ? getWeekDates(activeWeek.startDate) : [];
  const completedCount =
    activeWeek?.checkIns?.filter((c) => c.status !== "missed").length ?? 0;

  // ── Determine day number in week ──
  const dayNumber = weekDates.findIndex((d) => d === today()) + 1;

  return (
    <Layout>
      {activeWeek ? (
        /* ══════════════════════════════════════════
           ACTIVE THEME — Calm Dashboard
           ══════════════════════════════════════════ */
        <div className="lg:desktop-grid-2">
          {/* ── Main content ── */}
          <div>
            {/* Dashboard header */}
            <header className="mb-6">
              <p className="text-xs text-[#BFB8AD] mb-1.5">第 {dayNumber} 天</p>
              <h1 className="text-[22px] font-semibold tracking-tight text-[#2F2D28]">
                {activeWeek.themeTitle}
              </h1>
              <p className="text-sm text-[#8B867D] mt-1 leading-relaxed">
                {activeWeek.weeklyGoal}
              </p>
            </header>

            {/* ── Featured progress card ── */}
            <div
              className="card-featured mb-5"
              style={{ backgroundColor: `${activeWeek.color}04` }}
            >
              {/* Theme identity row */}
              <div className="flex items-center gap-3 mb-5 pb-5 border-b border-[#F3EFE8]">
                <div
                  className="w-11 h-11 rounded-2xl flex items-center justify-center text-lg shrink-0"
                  style={{ backgroundColor: `${activeWeek.color}14` }}
                >
                  {(() => {
                    const Icon = getIconComponent(activeWeek.icon);
                    return <Icon className="h-5 w-5" style={{ color: activeWeek.color }} />;
                  })()}
                </div>
                <div>
                  <p className="text-sm font-medium text-[#2F2D28]">
                    {activeWeek.category}
                  </p>
                  <p className="text-[11px] text-[#BFB8AD] mt-0.5">
                    {activeWeek.startDate} ~ {activeWeek.endDate}
                  </p>
                </div>
                <div className="ml-auto text-right">
                  <p className="text-2xl font-semibold text-[#8FA58E]">
                    {completedCount}
                  </p>
                  <p className="text-[10px] text-[#BFB8AD]">/ 7 天</p>
                </div>
              </div>

              {/* Today's action — prominently featured */}
              <div className="mb-5">
                <p className="text-[11px] text-[#BFB8AD] mb-2 tracking-wide">
                  今日小行动
                </p>
                <div
                  className="rounded-2xl px-4 py-3.5 text-sm leading-relaxed font-medium text-[#2F2D28]"
                  style={{ backgroundColor: `${activeWeek.color}0A` }}
                >
                  {activeWeek.dailyAction}
                </div>
              </div>

              {/* 7-day rhythm — ceremonial row */}
              <div>
                <p className="text-[11px] text-[#BFB8AD] mb-3 tracking-wide">
                  一周节奏
                </p>
                <div className="flex items-center justify-between">
                  {weekDates.map((date, i) => {
                    const checkIn = activeWeek.checkIns?.find(
                      (c) => c.date === date,
                    );
                    const isToday = date === today();
                    const isFuture = date > today();

                    let dotStyle = "bg-[#F3EFE8]";
                    if (!isFuture) {
                      if (checkIn?.status === "full") dotStyle = "bg-[#A8D5BA]";
                      else if (checkIn?.status === "light")
                        dotStyle = "bg-[#E8D5A3]";
                      else if (checkIn?.status === "missed")
                        dotStyle = "border border-dashed border-[#BFB8AD] bg-transparent";
                    }

                    return (
                      <div key={date} className="flex flex-col items-center gap-2">
                        <span className="text-[10px] text-[#BFB8AD] font-medium">
                          {DAY_LABELS[i]}
                        </span>
                        <div
                          className={cn(
                            "w-7 h-7 rounded-full flex items-center justify-center transition-all",
                            dotStyle,
                            isToday && "ring-2 ring-[#DDE7D8] ring-offset-2 ring-offset-transparent",
                          )}
                        >
                          {!isFuture && checkIn?.status === "full" && (
                            <svg width="10" height="8" viewBox="0 0 12 10" fill="none" className="text-white">
                              <path d="M1 5.5L4 8.5L11 1.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          )}
                          {!isFuture && checkIn?.status === "light" && (
                            <span className="text-[10px] text-white font-medium">~</span>
                          )}
                        </div>
                        <span className="text-[9px] text-[#BFB8AD]">
                          {date.slice(8)}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex gap-2.5 mt-6 pt-5 border-t border-[#F3EFE8]">
                {!todayCheckIn || todayCheckIn.status === "missed" ? (
                  <button
                    onClick={() => setShowCheckIn(true)}
                    className="flex-1 py-2.5 rounded-xl font-medium text-sm text-white bg-[#8FA58E] hover:bg-[#7A9279] active:opacity-90 transition-all"
                  >
                    记录今天
                  </button>
                ) : (
                  <button
                    onClick={() => setShowCheckIn(true)}
                    className="flex-1 py-2.5 rounded-xl font-medium text-sm border border-[#E8E1D6] text-[#8B867D] hover:bg-[#F7F4EC] transition-colors"
                  >
                    修改记录
                  </button>
                )}
                <button
                  onClick={() => setShowReview(true)}
                  className="px-5 py-2.5 rounded-xl font-medium text-sm border border-[#E8E1D6] text-[#8B867D] hover:bg-[#F7F4EC] transition-colors"
                >
                  结束周
                </button>
              </div>
            </div>

            {/* Explore more */}
            <button
              onClick={() => navigate("/library")}
              className="flex items-center justify-between w-full py-2 text-sm text-[#8B867D] hover:text-[#2F2D28] transition-colors"
            >
              <span>探索更多主题</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* ── Desktop sidebar: week overview ― */}
          <div className="hidden lg:block desktop-sidebar">
            <div className="card-soft">
              <p className="text-xs text-[#BFB8AD] mb-3">本周概览</p>
              <div className="space-y-2">
                {weekDates.map((date, i) => {
                  const checkIn = activeWeek.checkIns?.find(
                    (c) => c.date === date,
                  );
                  const isToday = date === today();
                  return (
                    <div
                      key={date}
                      className={cn(
                        "flex items-center gap-2.5 text-sm py-1.5",
                        isToday && "font-medium",
                      )}
                    >
                      <span
                        className={cn(
                          "w-2 h-2 rounded-full shrink-0",
                          checkIn?.status === "full"
                            ? "bg-[#A8D5BA]"
                            : checkIn?.status === "light"
                              ? "bg-[#E8D5A3]"
                              : checkIn?.status === "missed"
                                ? "border border-dashed border-[#BFB8AD]"
                                : "bg-[#F3EFE8]",
                        )}
                      />
                      <span className="w-6 text-[#BFB8AD] text-xs">
                        {DAY_LABELS[i]}
                      </span>
                      <span className="text-[#8B867D] text-xs flex-1">
                        {checkIn?.status === "full"
                          ? "已完成"
                          : checkIn?.status === "light"
                            ? "轻量完成"
                            : checkIn?.status === "missed"
                              ? "未完成"
                              : date > today()
                                ? "待完成"
                                : "今天"}
                      </span>
                      {checkIn?.note && (
                        <span className="text-[10px] text-[#BFB8AD] truncate max-w-[100px]">
                          {checkIn.note}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* ══════════════════════════════════════════
           NO ACTIVE THEME — Weekly Reset Landing
           ══════════════════════════════════════════ */

        /* ── Hero section ── */
        <>
          <div className="hero-section">
            <div className="w-12 h-12 rounded-2xl bg-[#EEF3EB] flex items-center justify-center mx-auto mb-5">
              <Sparkles className="h-5 w-5 text-[#8FA58E]" />
            </div>
            <h1 className="text-[28px] font-semibold tracking-tight text-[#2F2D28] leading-tight">
              给这一周，
              <br />
              一个温柔的方向。
            </h1>
            <p className="text-sm text-[#8B867D] mt-3 leading-relaxed max-w-xs mx-auto">
              不用一下子变好，只要这一周慢慢靠近。
            </p>
            <div className="divider-line" />
            <button
              onClick={() => navigate("/library")}
              className="inline-flex items-center gap-2 px-7 py-3 rounded-xl font-medium text-sm text-white bg-[#8FA58E] hover:bg-[#7A9279] active:opacity-90 transition-all shadow-sm"
            >
              <Sparkles className="h-4 w-4" />
              开启本周主题
            </button>

            {/* Gentle copy + weekly rhythm visual */}
            <p className="text-xs text-[#BFB8AD] mt-5 leading-relaxed">
              选择一个主题，陪自己走过这 7 天。
            </p>
            <div className="rhythm-dots with-line mt-3" aria-hidden="true">
              <span /><span /><span /><span /><span /><span /><span />
            </div>
          </div>

          {/* ── Curated recommendations ── */}
          <div className="mb-6">
            <h3 className="section-label">从这些方向开始</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {QUICK_STARTS.map(({ id, title, desc, icon: Icon, color }) => (
                <button
                  key={id}
                  onClick={() => navigate(`/theme/${id}`)}
                  className="flex items-start gap-3.5 p-4 rounded-xl bg-[#FFFDF8] border border-[#E8E1D6] text-left hover:border-[#DDE7D8] hover:bg-[#EEF3EB]/30 transition-all active:opacity-80"
                >
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5"
                    style={{ backgroundColor: `${color}14` }}
                  >
                    <Icon className="h-4 w-4" style={{ color }} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-[#2F2D28]">
                      {title}
                    </p>
                    <p className="text-xs text-[#8B867D] mt-0.5 leading-relaxed">
                      {desc}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* ── Last week review ── */}
          {lastCompleted && (
            <div>
              <h3 className="section-label">上次回顾</h3>
              <div className="card-soft">
                <p className="text-xs text-[#8B867D] mb-1">
                  {lastCompleted.themeTitle}
                </p>
                {lastCompleted.review && (
                  <>
                    <p className="text-sm text-[#2F2D28] leading-relaxed">
                      {lastCompleted.review.biggestGain}
                    </p>
                    <p className="text-xs text-[#BFB8AD] mt-1.5">
                      {lastCompleted.checkIns.filter((c) => c.status !== "missed").length}{" "}
                      / 7 天完成
                    </p>
                  </>
                )}
                <button
                  onClick={() => navigate("/history")}
                  className="mt-3 text-xs text-[#8FA58E] font-medium flex items-center gap-1 hover:text-[#7A9279] transition-colors"
                >
                  查看历史记录 <ArrowRight className="h-3 w-3" />
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {/* ══════════════════════════════════════════
         CHECK-IN MODAL
         ══════════════════════════════════════════ */}
      {showCheckIn && activeWeek && (
        <CheckInModal
          date={today()}
          dayLabel={dayNumber > 0 ? `第 ${dayNumber} 天` : "今天"}
          existingCheckIn={todayCheckIn}
          checkInType={activeWeek.checkInType}
          onSave={handleCheckIn}
          onClose={() => setShowCheckIn(false)}
        />
      )}

      {/* ══════════════════════════════════════════
         END WEEK REVIEW MODAL
         ══════════════════════════════════════════ */}
      {showReview && activeWeek && (
        <div className="mobile-overlay" onClick={() => setShowReview(false)}>
          <div
            className="mobile-sheet bg-[#FFFDF8] rounded-t-2xl sm:rounded-2xl max-w-sm animate-in slide-in-from-bottom duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            {/* ── Header (fixed) ── */}
            <div className="shrink-0 px-6 pt-2">
              <h2 className="text-lg font-semibold text-[#2F2D28] mb-1">
                结束本周复盘
              </h2>
              <p className="text-xs text-[#8B867D] mb-5">
                {activeWeek.themeTitle} · 完成后不可修改
              </p>
            </div>

            {/* ── Scrollable form body ── */}
            <div className="mobile-sheet-body px-6">
              <div className="space-y-4">
                <div>
                  <label className="text-xs text-[#8B867D] font-medium mb-1.5 block">
                    本周最大的收获是？
                  </label>
                  <textarea
                    value={reviewGain}
                    onChange={(e) => setReviewGain(e.target.value)}
                    placeholder="写写这周的感受..."
                    className="w-full rounded-xl border border-[#E8E1D6] px-3.5 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-[#8FA58E]/40 focus:border-[#8FA58E]/40 bg-white resize-none h-20 text-[#2F2D28] placeholder:text-[#BFB8AD]"
                  />
                </div>
                <div>
                  <label className="text-xs text-[#8B867D] font-medium mb-1.5 block">
                    遇到什么困难或卡住的地方？
                  </label>
                  <textarea
                    value={reviewStruggle}
                    onChange={(e) => setReviewStruggle(e.target.value)}
                    placeholder="有什么挑战？"
                    className="w-full rounded-xl border border-[#E8E1D6] px-3.5 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-[#8FA58E]/40 focus:border-[#8FA58E]/40 bg-white resize-none h-20 text-[#2F2D28] placeholder:text-[#BFB8AD]"
                  />
                </div>
                <div>
                  <label className="text-xs text-[#8B867D] font-medium mb-1.5 block">
                    下周是否继续这个主题？
                  </label>
                  <div className="flex gap-2">
                    {[true, false].map((v) => (
                      <button
                        key={String(v)}
                        onClick={() => setContinueNext(v)}
                        className={cn(
                          "flex-1 py-2 rounded-lg text-sm font-medium transition-all",
                          continueNext === v
                            ? "bg-[#8FA58E] text-white"
                            : "bg-[#F3EFE8] text-[#8B867D]",
                        )}
                      >
                        {v ? "继续" : "换一个"}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-xs text-[#8B867D] font-medium mb-1.5 block">
                    其他想说的（选填）
                  </label>
                  <input
                    type="text"
                    value={reviewNotes}
                    onChange={(e) => setReviewNotes(e.target.value)}
                    placeholder="任何想记录的话..."
                    className="w-full rounded-xl border border-[#E8E1D6] px-3.5 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-[#8FA58E]/40 focus:border-[#8FA58E]/40 bg-white text-[#2F2D28] placeholder:text-[#BFB8AD]"
                  />
                </div>
              </div>
            </div>

            {/* ── Footer — submit button always visible ── */}
            <div className="mobile-sheet-footer px-6 pt-4 safe-bottom">
              <button
                onClick={handleReviewSubmit}
                className="w-full py-2.5 rounded-xl font-medium text-sm text-white bg-[#8FA58E] hover:bg-[#7A9279] active:opacity-90 transition-all"
              >
                完成复盘
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}
