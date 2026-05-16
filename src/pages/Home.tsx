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
import type { ThemeWeek, CheckIn } from "@/lib/types";
import { Sparkles, ArrowRight, ChevronRight } from "lucide-react";

// Day labels (Chinese)
const DAY_LABELS = ["周一", "周二", "周三", "周四", "周五", "周六", "周日"];

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

  // Refresh state on mount and when returning from other pages
  useEffect(() => {
    setActiveWeek(getActiveWeek());
    setLastCompleted(getLastCompletedWeek());
  }, []);

  // ── Active week check-in ──
  const handleCheckIn = (
    status: "full" | "light" | "missed",
    note?: string,
    value?: number,
  ) => {
    if (!activeWeek) return;
    const updated = checkInDate(activeWeek.id, today(), status, note, value);
    if (updated) {
      setActiveWeek({ ...updated });
    }
    setShowCheckIn(false);
  };

  // ── End-of-week review submit ──
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

  // ── Get day of week index for display ──
  const todayCheckIn = activeWeek?.checkIns?.find((c) => c.date === today());

  const weekDates = activeWeek ? getWeekDates(activeWeek.startDate) : [];

  // Compute completed count
  const completedCount =
    activeWeek?.checkIns?.filter((c) => c.status !== "missed").length ?? 0;

  return (
    <Layout>
      {/* ── Header ── */}
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-[#1E293B]">这一周</h1>
        {activeWeek && (
          <p className="text-sm text-[#64748B] mt-0.5">
            🎯 {activeWeek.weeklyGoal}
          </p>
        )}
      </header>

      {activeWeek ? (
        <>
          {/* ── Active theme week card ── */}
          <div
            className="card mb-4"
            style={{ borderColor: `${activeWeek.color}30` }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl"
                style={{ backgroundColor: `${activeWeek.color}18` }}
              >
                {(() => {
                  const iconMap: Record<string, string> = {
                    BookOpen: "📖", BookMarked: "📑", RotateCcw: "🔄",
                    Notebook: "📓", Target: "🎯", FileText: "📝",
                    Library: "📚", ClipboardCheck: "✅", Headphones: "🎧",
                    Mic: "🎤", Layers: "📚", Podcast: "🎙️",
                    Bot: "🤖", Activity: "🏃", Moon: "🌙",
                    Heart: "❤️", Sparkles: "✨", Home: "🏠",
                    Users: "👥", Briefcase: "💼", PiggyBank: "🐷",
                    Map: "🗺️", BatteryLow: "🔋", Coffee: "☕",
                    Sun: "☀️", HeartHandshake: "🤝", Brain: "🧠",
                    Trash2: "🗑️", Flower2: "🌸", Zap: "⚡",
                  };
                  return iconMap[activeWeek.icon] || "📌";
                })()}
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-bold text-[#1E293B]">
                  {activeWeek.themeTitle}
                </h2>
                <p className="text-xs text-[#64748B] mt-0.5">
                  {activeWeek.category} · {activeWeek.startDate} ~{" "}
                  {activeWeek.endDate}
                </p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-[#8B5CF6]">
                  {completedCount}
                </p>
                <p className="text-xs text-[#94A3B8]">/ 7 天</p>
              </div>
            </div>

            {/* 7-day progress grid */}
            <div className="flex gap-1.5 mb-4">
              {weekDates.map((date, i) => {
                const checkIn = activeWeek.checkIns?.find(
                  (c) => c.date === date,
                );
                const isToday = date === today();
                const isFuture = date > today();
                return (
                  <div key={date} className="flex-1 flex flex-col items-center gap-1">
                    <span className="text-[10px] text-[#94A3B8]">
                      {DAY_LABELS[i]}
                    </span>
                    <div
                      className={cn(
                        "w-full aspect-square rounded-lg flex items-center justify-center text-xs font-medium transition-colors",
                        isFuture
                          ? "bg-gray-50 text-[#CBD5E1]"
                          : checkIn?.status === "full"
                            ? "bg-emerald-100 text-emerald-700"
                            : checkIn?.status === "light"
                              ? "bg-amber-100 text-amber-700"
                              : checkIn?.status === "missed"
                                ? "bg-red-50 text-red-400"
                                : "bg-gray-50 text-[#CBD5E1]",
                        isToday && "ring-2 ring-[#8B5CF6] ring-offset-1",
                      )}
                    >
                      {isFuture
                        ? ""
                        : checkIn?.status === "full"
                          ? "✓"
                          : checkIn?.status === "light"
                            ? "~"
                            : checkIn?.status === "missed"
                              ? "✗"
                              : "○"}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Today's action */}
            <div
              className="rounded-xl p-3 mb-3"
              style={{ backgroundColor: `${activeWeek.color}08` }}
            >
              <p className="text-xs text-[#64748B] mb-1">📋 今日小行动</p>
              <p className="text-sm font-medium text-[#1E293B]">
                {activeWeek.dailyAction}
              </p>
            </div>

            {/* Action buttons */}
            <div className="flex gap-2">
              {!todayCheckIn || todayCheckIn.status === "missed" ? (
                <button
                  onClick={() => setShowCheckIn(true)}
                  className="flex-1 py-3 rounded-xl font-medium text-sm text-white bg-gradient-to-r from-[#8B5CF6] to-[#7C3AED] active:opacity-90 transition-opacity"
                >
                  ✅ 完成今天
                </button>
              ) : (
                <button
                  onClick={() => setShowCheckIn(true)}
                  className="flex-1 py-3 rounded-xl font-medium text-sm border border-[#E2E8F0] text-[#64748B] active:bg-gray-50 transition-colors"
                >
                  ✏️ 修改打卡
                </button>
              )}
              <button
                onClick={() => setShowReview(true)}
                className="px-4 py-3 rounded-xl font-medium text-sm border border-[#E2E8F0] text-[#64748B] active:bg-gray-50 transition-colors"
              >
                📝 结束周
              </button>
            </div>
          </div>

          {/* ── Bottom suggested themes (compact) ── */}
          <div className="mt-6">
            <div
              className="flex items-center justify-between mb-2 cursor-pointer"
              onClick={() => navigate("/library")}
            >
              <h3 className="text-sm font-medium text-[#64748B]">
                更多主题探索
              </h3>
              <ChevronRight className="h-4 w-4 text-[#94A3B8]" />
            </div>
          </div>
        </>
      ) : (
        <>
          {/* ── No active week ── */}
          <div className="text-center py-12 space-y-4">
            <div className="text-5xl mb-4">🌱</div>
            <h2 className="text-xl font-bold text-[#1E293B]">
              这周还没有开始
            </h2>
            <p className="text-sm text-[#64748B] leading-relaxed max-w-xs mx-auto">
              可以从主题库里选择一个感兴趣的主题，开启你的 7 天生活实验。
            </p>
            <button
              onClick={() => navigate("/library")}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-medium text-white bg-gradient-to-r from-[#8B5CF6] to-[#7C3AED] active:opacity-90 transition-opacity"
            >
              <Sparkles className="h-4 w-4" />
              去主题库看看
            </button>
          </div>

          {/* ── Last completed week summary ── */}
          {lastCompleted && (
            <div className="card mt-6">
              <p className="text-xs text-[#94A3B8] mb-2">上周回顾</p>
              <h3 className="font-semibold text-[#1E293B] mb-1">
                {lastCompleted.themeTitle}
              </h3>
              {lastCompleted.review && (
                <>
                  <p className="text-sm text-[#64748B] mb-1">
                    💡 {lastCompleted.review.biggestGain}
                  </p>
                  <p className="text-xs text-[#94A3B8]">
                    🎯{" "}
                    {lastCompleted.checkIns.filter((c) => c.status !== "missed")
                      .length}{" "}
                    / 7 天完成
                  </p>
                </>
              )}
              <button
                onClick={() => navigate("/history")}
                className="mt-2 text-xs text-[#8B5CF6] font-medium flex items-center gap-1"
              >
                查看历史记录 <ArrowRight className="h-3 w-3" />
              </button>
            </div>
          )}

          {/* ── Quick start suggestions ── */}
          <div className="mt-6">
            <h3 className="text-sm font-medium text-[#64748B] mb-3">
              推荐开始
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: "reading-week", label: "📖 阅读周" },
                { id: "english-input-week", label: "🎧 英语输入周" },
                { id: "exercise-week", label: "🏃 运动周" },
                { id: "early-sleep-week", label: "🌙 早睡周" },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => navigate(`/theme/${item.id}`)}
                  className="py-3 px-3 rounded-xl text-sm font-medium bg-white border border-[#E2E8F0] text-[#1E293B] active:bg-gray-50 transition-colors text-left"
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </>
      )}

      {/* ── Check-in modal ── */}
      {showCheckIn && activeWeek && (
        <CheckInModal
          date={today()}
          dayLabel="今天"
          existingCheckIn={todayCheckIn}
          checkInType={activeWeek.checkInType}
          onSave={handleCheckIn}
          onClose={() => setShowCheckIn(false)}
        />
      )}

      {/* ── End week review modal ── */}
      {showReview && activeWeek && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
          <div
            className="absolute inset-0 bg-black/30"
            onClick={() => setShowReview(false)}
          />
          <div className="relative bg-white rounded-t-2xl sm:rounded-2xl w-full max-w-sm p-6 pb-8 animate-in slide-in-from-bottom duration-300 max-h-[80vh] overflow-y-auto">
            <h2 className="text-lg font-semibold text-[#1E293B] mb-1">
              结束本周复盘
            </h2>
            <p className="text-xs text-[#64748B] mb-4">
              {activeWeek.themeTitle} · 完成后不可修改
            </p>

            <div className="space-y-4">
              <div>
                <label className="text-xs text-[#64748B] font-medium mb-1 block">
                  💡 本周最大的收获是？
                </label>
                <textarea
                  value={reviewGain}
                  onChange={(e) => setReviewGain(e.target.value)}
                  placeholder="写写这周的感受..."
                  className="w-full rounded-lg border border-[#E2E8F0] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#8B5CF6] focus:border-transparent bg-white resize-none h-20"
                />
              </div>
              <div>
                <label className="text-xs text-[#64748B] font-medium mb-1 block">
                  🧱 遇到什么困难或卡住的地方？
                </label>
                <textarea
                  value={reviewStruggle}
                  onChange={(e) => setReviewStruggle(e.target.value)}
                  placeholder="有什么挑战？"
                  className="w-full rounded-lg border border-[#E2E8F0] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#8B5CF6] focus:border-transparent bg-white resize-none h-20"
                />
              </div>
              <div>
                <label className="text-xs text-[#64748B] font-medium mb-1 block">
                  下周是否继续这个主题？
                </label>
                <div className="flex gap-2">
                  {[true, false].map((v) => (
                    <button
                      key={String(v)}
                      onClick={() => setContinueNext(v)}
                      className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
                        continueNext === v
                          ? "bg-[#8B5CF6] text-white"
                          : "bg-gray-50 text-[#64748B]"
                      }`}
                    >
                      {v ? "✅ 继续" : "🔄 换一个"}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-xs text-[#64748B] font-medium mb-1 block">
                  其他想说的（选填）
                </label>
                <input
                  type="text"
                  value={reviewNotes}
                  onChange={(e) => setReviewNotes(e.target.value)}
                  placeholder="任何想记录的话..."
                  className="w-full rounded-lg border border-[#E2E8F0] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#8B5CF6] focus:border-transparent bg-white"
                />
              </div>
            </div>

            <button
              onClick={handleReviewSubmit}
              className="w-full mt-6 py-3 rounded-xl font-medium text-white bg-gradient-to-r from-[#8B5CF6] to-[#7C3AED] active:opacity-90 transition-opacity"
            >
              完成复盘
            </button>
          </div>
        </div>
      )}
    </Layout>
  );
}
