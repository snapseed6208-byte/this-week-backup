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
        <div className="text-center py-16">
          <p className="text-3xl mb-3">📋</p>
          <p className="text-sm text-[#64748B]">还没有完成任何主题周</p>
          <p className="text-xs text-[#94A3B8] mt-1">去主题库开启你的第一个主题周吧</p>
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
                <div
                  className="flex items-center gap-3 cursor-pointer"
                  onClick={() => toggleExpand(week.id)}
                >
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-lg shrink-0"
                    style={{ backgroundColor: `${week.color}18` }}
                  >
                    {iconMap[week.icon] || "📌"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-[#1E293B] text-sm">
                        {week.themeTitle}
                      </h3>
                      <span
                        className={cn(
                          "text-[10px] px-1.5 py-0.5 rounded-full",
                          week.status === "completed"
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-gray-100 text-gray-500",
                        )}
                      >
                        {week.status === "completed" ? "完成" : "中断"}
                      </span>
                    </div>
                    <p className="text-xs text-[#94A3B8] mt-0.5">
                      {week.category} · {week.startDate} ~ {week.endDate}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-lg font-bold text-[#8B5CF6]">
                      {completedDays}
                    </p>
                    <p className="text-[10px] text-[#94A3B8]">/ 7 天</p>
                  </div>
                  {isExpanded ? (
                    <ChevronUp className="h-4 w-4 text-[#94A3B8]" />
                  ) : (
                    <ChevronDown className="h-4 w-4 text-[#94A3B8]" />
                  )}
                </div>

                {isExpanded && (
                  <div className="mt-3 pt-3 border-t border-[#F1F5F9] space-y-3 animate-in fade-in slide-in-from-top-2 duration-200">
                    {/* Completion stats */}
                    <div className="grid grid-cols-3 gap-2">
                      <div className="text-center p-2 bg-emerald-50 rounded-lg">
                        <p className="text-lg font-bold text-emerald-600">{fullDays}</p>
                        <p className="text-[10px] text-emerald-600/70">完整完成</p>
                      </div>
                      <div className="text-center p-2 bg-amber-50 rounded-lg">
                        <p className="text-lg font-bold text-amber-600">
                          {completedDays - fullDays}
                        </p>
                        <p className="text-[10px] text-amber-600/70">轻量完成</p>
                      </div>
                      <div className="text-center p-2 bg-gray-50 rounded-lg">
                        <p className="text-lg font-bold text-gray-500">
                          {7 - completedDays}
                        </p>
                        <p className="text-[10px] text-gray-500/70">未完成</p>
                      </div>
                    </div>

                    {/* Daily check-in notes */}
                    {week.checkIns.filter((c) => c.note).length > 0 && (
                      <div>
                        <p className="text-xs text-[#94A3B8] mb-1">📝 打卡记录</p>
                        <div className="space-y-1">
                          {week.checkIns
                            .filter((c) => c.note)
                            .map((c) => (
                              <p key={c.date} className="text-xs text-[#64748B]">
                                <span className="text-[#94A3B8]">{c.date}:</span>{" "}
                                {c.note}
                                {c.value !== undefined && (
                                  <span className="text-[#94A3B8]">
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
                      <div className="bg-[#FDFBF7] rounded-lg p-3 space-y-2">
                        <p className="text-xs font-medium text-[#64748B]">💡 周复盘</p>
                        <div className="space-y-1">
                          <p className="text-xs text-[#1E293B]">
                            <span className="text-[#94A3B8]">收获:</span>{" "}
                            {week.review.biggestGain}
                          </p>
                          <p className="text-xs text-[#1E293B]">
                            <span className="text-[#94A3B8]">困难:</span>{" "}
                            {week.review.struggleReason}
                          </p>
                          <p className="text-xs text-[#64748B]">
                            {week.review.continueNextWeek
                              ? "✅ 下周继续这个主题"
                              : "🔄 下周换一个主题"}
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
