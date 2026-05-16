import { useState } from "react";
import type { CheckIn } from "@/lib/types";
import { cn } from "@/lib/utils";

interface CheckInModalProps {
  date: string;
  dayLabel: string;
  existingCheckIn?: CheckIn;
  checkInType: string;
  onSave: (status: "full" | "light" | "missed", note?: string, value?: number) => void;
  onClose: () => void;
}

export function CheckInModal({
  date,
  dayLabel,
  existingCheckIn,
  checkInType,
  onSave,
  onClose,
}: CheckInModalProps) {
  const [status, setStatus] = useState<"full" | "light" | "missed">(
    existingCheckIn?.status ?? "full",
  );
  const [note, setNote] = useState(existingCheckIn?.note ?? "");
  const [value, setValue] = useState(
    existingCheckIn?.value?.toString() ?? "",
  );

  const hasNumericInput = checkInType !== "达标/未达标" && checkInType !== "次数" && checkInType !== "个数" && checkInType !== "件数" && checkInType !== "达标/未达标";

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />
      <div className="relative bg-white rounded-t-2xl sm:rounded-2xl w-full max-w-sm p-6 pb-8 animate-in slide-in-from-bottom duration-300">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold text-[#1E293B]">
              {dayLabel}
            </h2>
            <p className="text-xs text-[#64748B]">{date}</p>
          </div>
          <button onClick={onClose} className="text-[#94A3B8] text-lg leading-none p-1">
            ✕
          </button>
        </div>

        {/* Status selection */}
        <div className="flex gap-2 mb-4">
          {[
            { key: "full" as const, label: "✅ 完整完成", desc: "达到目标" },
            { key: "light" as const, label: "🌱 轻量完成", desc: "只做了最低标准" },
            { key: "missed" as const, label: "💤 未完成", desc: "今天没做" },
          ].map((opt) => (
            <button
              key={opt.key}
              onClick={() => setStatus(opt.key)}
              className={cn(
                "flex-1 py-2.5 rounded-xl text-sm font-medium transition-all",
                status === opt.key
                  ? opt.key === "full"
                    ? "bg-emerald-50 text-emerald-700 ring-2 ring-emerald-400"
                    : opt.key === "light"
                      ? "bg-amber-50 text-amber-700 ring-2 ring-amber-400"
                      : "bg-slate-100 text-slate-600 ring-2 ring-slate-300"
                  : "bg-gray-50 text-[#94A3B8]",
              )}
            >
              <span className="block text-xs">{opt.label}</span>
            </button>
          ))}
        </div>

        {/* Numeric value input (for things like minutes, pages, count) */}
        <div className="mb-4">
          <label className="text-xs text-[#64748B] font-medium mb-1 block">
            {checkInType === "达标/未达标" ? "完成情况" : `${checkInType}（选填）`}
          </label>
          {checkInType === "达标/未达标" ? (
            <div className="text-sm text-[#64748B] bg-gray-50 rounded-lg px-3 py-2">
              {status === "full" ? "✅ 达标" : status === "light" ? "🌱 部分达标" : "💤 未达标"}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <input
                type="number"
                inputMode="numeric"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder="输入数值"
                className="flex-1 rounded-lg border border-[#E2E8F0] px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#8B5CF6] focus:border-transparent bg-white"
              />
              <span className="text-xs text-[#94A3B8] shrink-0">
                {checkInType.includes("分钟")
                  ? "分钟"
                  : checkInType.includes("小时")
                    ? "小时"
                    : checkInType.includes("字数")
                      ? "字"
                      : checkInType.includes("页数")
                        ? "页"
                        : checkInType.includes("题数")
                          ? "题"
                          : checkInType.includes("件数")
                            ? "件"
                            : checkInType.includes("杯数")
                              ? "杯"
                              : checkInType.includes("个数")
                                ? "个"
                                : checkInType.includes("次数")
                                  ? "次"
                                  : checkInType.includes("L")
                                    ? "L"
                                    : checkInType.includes("水量")
                                      ? "L"
                                      : ""}
              </span>
            </div>
          )}
        </div>

        {/* Note */}
        <div className="mb-6">
          <label className="text-xs text-[#64748B] font-medium mb-1 block">
            一句话记录（选填）
          </label>
          <input
            type="text"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="今天做得怎么样？有什么感受？"
            className="w-full rounded-lg border border-[#E2E8F0] px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#8B5CF6] focus:border-transparent bg-white"
          />
        </div>

        <button
          onClick={() =>
            onSave(
              status,
              note || undefined,
              value ? Number(value) : undefined,
            )
          }
          className="w-full py-3 rounded-xl font-medium text-white bg-gradient-to-r from-[#8B5CF6] to-[#7C3AED] active:opacity-90 transition-opacity"
        >
          保存打卡
        </button>
      </div>
    </div>
  );
}
