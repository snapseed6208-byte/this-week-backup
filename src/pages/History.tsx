import { useState } from "react";
import { Layout } from "@/components/Layout";
import { getAllHistoricalWeeks } from "@/lib/storage";
import { cn } from "@/lib/utils";
import type { ThemeWeek } from "@/lib/types";
import { Calendar, ChevronDown, ChevronUp } from "lucide-react";

const iconMap: Record<string, string> = {
  BookOpen: "📖", BookMarked: "📑", RotateCcw: "🔄", Notebook: "📓",
  Target: "🎯", FileText: "📝", Library: "📚", ClipboardCheck: "✅",
  Headphones: "🎧", Mic: "🎤", Layers: "📚", Podcast: "🎙️",
  Bot: "🤖", Activity: "🏃", Moon: "🌙", Heart: "❤️",
  Sparkles: "✨", Home: "🏠", Users: "👥", Briefcase: "💼",
  PiggyBank: "🐷", Map: "🗺️", BatteryLow: "🔋", Coffee: "☕",
  Sun: "☀️", HeartHandshake: "🤝", Brain: "🧠", Trash2: "🗑️",
  Flower2: "🌸", Zap: "⚡", Bed: "🛌", Sprout: "🌱",
};

export function HistoryPage() {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const weeks = getAllHistoricalWeeks();

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <Layout title="历史记录">
      {weeks.length === 0 ? (
        <div className="text-center py-20">
          <div className="w-14 h-14 rounded-full bg-[#F0ECE6] flex items-center justify-center mx-auto mb-4">
            <Calendar className="h-6 w-6 text-[#BFB8B0]" />
          </div>
          <p className="text-sm text-[#8B8680]">还没有完成任何主题周</p>
          <p className="text-xs text-[#BFB8B0] mt-1.5">
            去主题库开启你的第一个主题周吧
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {weeks.map((week) => {
            const isExpanded = expandedId === week.id;
            const completedDays = week.checkIns.filter(
              (c) => c.status !== "missed",
            ).length;
            const fullDays = week.checkIns.filter(
              (c) => c.status === "full",
            ).length;

            return (
              <div key={week.id} className="card">
                {/* ── Card header (always visible) ── */}
                <div
                  className="flex items-center gap-3 cursor-pointer"
                  onClick={() => toggleExpand(week.id)}
                >
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center text-base shrink-0"
                    style={{ backgroundColor: `${week.color}14` }}
                  >
                    {iconMap[week.icon] || "📌"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium text-[#2C2A28] text-sm">
                        {week.themeTitle}
                      </h3>
                      <span
                        className={cn(
                          "text-[10px] px-2 py-0.5 rounded-full leading-relaxed",
                          week.status === "completed"
                            ? "bg-[#A8D5BA]/20 text-[#5A8F6E]"
                            : "bg-[#E8C5C5]/20 text-[#A06060]",
                        )}
                      >
                        {week.status === "completed" ? "完成" : "中断"}
                      </span>
                    </div>
                    <p className="text-xs text-[#BFB8B0] mt-0.5">
                      {week.category} · {week.startDate} ~ {week.endDate}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-lg font-semibold text-[#8E7DBE]">
                      {completedDays}
                    </p>
                    <p className="text-[10px] text-[#BFB8B0]">/ 7 天</p>
                  </div>
                  {isExpanded ? (
                    <ChevronUp className="h-4 w-4 text-[#BFB8B0] shrink-0" />
                  ) : (
                    <ChevronDown className="h-4 w-4 text-[#BFB8B0] shrink-0" />
                  )}
                </div>

                {/* ── Expanded details ── */}
                {isExpanded && (
                  <div className="mt-4 pt-4 border-t border-[#F0ECE6] space-y-4 animate-in fade-in slide-in-from-top-2 duration-200">
                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-2.5">
                      <div className="text-center p-3 rounded-xl bg-[#A8D5BA]/10">
                        <p className="text-lg font-semibold text-[#5A8F6E]">
                          {fullDays}
                        </p>
                        <p className="text-[10px] text-[#5A8F6E]/60 mt-0.5">
                          完整完成
                        </p>
                      </div>
                      <div className="text-center p-3 rounded-xl bg-[#E8D5A3]/10">
                        <p className="text-lg font-semibold text-[#9A8250]">
                          {completedDays - fullDays}
                        </p>
                        <p className="text-[10px] text-[#9A8250]/60 mt-0.5">
                          轻量完成
                        </p>
                      </div>
                      <div className="text-center p-3 rounded-xl bg-[#F0ECE6]">
                        <p className="text-lg font-semibold text-[#8B8680]">
                          {7 - completedDays}
                        </p>
                        <p className="text-[10px] text-[#8B8680]/60 mt-0.5">
                          未完成
                        </p>
                      </div>
                    </div>

                    {/* Notes */}
                    {week.checkIns.filter((c) => c.note).length > 0 && (
                      <div>
                        <p className="text-xs text-[#BFB8B0] mb-2">打卡记录</p>
                        <div className="space-y-1.5">
                          {week.checkIns
                            .filter((c) => c.note)
                            .map((c) => (
                              <p
                                key={c.date}
                                className="text-xs text-[#8B8680] leading-relaxed"
                              >
                                <span className="text-[#BFB8B0]">
                                  {c.date}:
                                </span>{" "}
                                {c.note}
                                {c.value !== undefined && (
                                  <span className="text-[#BFB8B0]">
                                    {" "}
                                    ({c.value})
                                  </span>
                                )}
                              </p>
                            ))}
                        </div>
                      </div>
                    )}

                    {/* Review */}
                    {week.review && (
                      <div className="bg-[#F8F6F2] rounded-xl p-4 space-y-2.5">
                        <p className="text-xs font-medium text-[#8B8680]">
                          周复盘
                        </p>
                        <div className="space-y-1.5">
                          <p className="text-xs text-[#2C2A28] leading-relaxed">
                            <span className="text-[#BFB8B0]">收获: </span>
                            {week.review.biggestGain}
                          </p>
                          <p className="text-xs text-[#2C2A28] leading-relaxed">
                            <span className="text-[#BFB8B0]">困难: </span>
                            {week.review.struggleReason}
                          </p>
                          <p className="text-xs text-[#8B8680]">
                            {week.review.continueNextWeek
                              ? "下周继续这个主题"
                              : "下周换一个主题"}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </Layout>
  );
}
