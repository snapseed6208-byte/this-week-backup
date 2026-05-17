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

  const hasNumericInput = checkInType !== "达标/未达标" && checkInType !== "次数" && checkInType !== "个数" && checkInType !== "件数";

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-[#2C2A28]/40" onClick={onClose} />

      {/* Sheet */}
      <div className="relative bg-[#FFFCF8] rounded-t-3xl sm:rounded-2xl w-full max-w-sm flex flex-col max-h-[85dvh] animate-in slide-in-from-bottom duration-300">
        {/* Gentle top drag indicator (stays visible) */}
        <div className="flex justify-center pt-3 pb-1 shrink-0">
          <div className="w-8 h-1 rounded-full bg-[#EAE5DE]" />
        </div>

        {/* Scrollable content with safe-area bottom clearance */}
        <div className="overflow-y-auto px-6 pb-[calc(1.5rem+env(safe-area-inset-bottom,0px))]">
          {/* ── Header ── */}
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-lg font-semibold text-[#2C2A28]">
                {dayLabel}
              </h2>
              <p className="text-xs text-[#BFB8B0] mt-0.5">{date}</p>
            </div>
            <button
              onClick={onClose}
              className="w-7 h-7 rounded-full bg-[#F0ECE6] flex items-center justify-center text-sm text-[#BFB8B0] hover:text-[#8B8680] hover:bg-[#EAE5DE] transition-all"
            >
              ✕
            </button>
          </div>

          {/* ── Gentle prompt ── */}
          <p className="text-sm text-[#8B8680] leading-relaxed mb-5">
            今天，完成到什么程度就很好。
          </p>

          {/* ── Status — segmented cards ── */}
          <div className="flex gap-2.5 mb-5">
            {[
              { key: "full" as const, label: "完整完成", desc: "达到目标" },
              { key: "light" as const, label: "轻量完成", desc: "最低标准" },
              { key: "missed" as const, label: "未完成", desc: "今天没做" },
            ].map((opt) => (
              <button
                key={opt.key}
                onClick={() => setStatus(opt.key)}
                className={cn(
                  "flex-1 py-3 rounded-xl text-xs transition-all",
                  status === opt.key
                    ? opt.key === "full"
                      ? "bg-[#A8D5BA]/20 text-[#5A8F6E] font-medium ring-1 ring-[#A8D5BA]/40"
                      : opt.key === "light"
                        ? "bg-[#E8D5A3]/20 text-[#9A8250] font-medium ring-1 ring-[#E8D5A3]/40"
                        : "bg-[#E8C5C5]/20 text-[#A06060] font-medium ring-1 ring-[#E8C5C5]/40"
                    : "bg-[#F0ECE6] text-[#BFB8B0] hover:bg-[#EAE5DE]",
                )}
              >
                <span className="block text-sm font-medium">{opt.label}</span>
                <span className="block text-[10px] mt-0.5 opacity-60">
                  {opt.desc}
                </span>
              </button>
            ))}
          </div>

          {/* ── Numeric value ── */}
          <div className="mb-4">
            <label className="text-xs text-[#8B8680] font-medium mb-1.5 block">
              {checkInType === "达标/未达标" ? "完成情况" : `${checkInType}`}
            </label>
            {checkInType === "达标/未达标" ? (
              <div className="text-sm text-[#8B8680] bg-[#F0ECE6] rounded-xl px-3.5 py-2.5">
                {status === "full" ? "达标" : status === "light" ? "部分达标" : "未达标"}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  inputMode="numeric"
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  placeholder="0"
                  className="flex-1 rounded-xl border border-[#EAE5DE] px-3.5 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-[#8E7DBE]/40 focus:border-[#8E7DBE]/40 bg-white text-[#2C2A28] placeholder:text-[#BFB8B0]"
                />
                <span className="text-xs text-[#BFB8B0] shrink-0">
                  {checkInType.includes("分钟") ? "分钟"
                  : checkInType.includes("小时") ? "小时"
                  : checkInType.includes("字数") ? "字"
                  : checkInType.includes("页数") ? "页"
                  : checkInType.includes("题数") ? "题"
                  : checkInType.includes("件数") ? "件"
                  : checkInType.includes("杯数") ? "杯"
                  : checkInType.includes("个数") ? "个"
                  : checkInType.includes("次数") ? "次"
                  : checkInType.includes("L") ? "L"
                  : checkInType.includes("水量") ? "L"
                  : ""}
                </span>
              </div>
            )}
          </div>

          {/* ── Journal note ── */}
          <div className="mb-6">
            <label className="text-xs text-[#8B8680] font-medium mb-1.5 block">
              今天的感受
            </label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="今天做得怎么样？有什么想记录的..."
              rows={2}
              className="w-full rounded-xl border border-[#EAE5DE] px-3.5 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-[#8E7DBE]/40 focus:border-[#8E7DBE]/40 bg-white text-[#2C2A28] placeholder:text-[#BFB8B0] resize-none"
            />
          </div>

          {/* ── Save button ── */}
          <button
            onClick={() =>
              onSave(
                status,
                note || undefined,
                value ? Number(value) : undefined,
              )
            }
            className="w-full py-3 rounded-xl font-medium text-sm text-white bg-[#8E7DBE] hover:bg-[#7D6DAE] active:opacity-90 transition-all"
          >
            保存今天的记录
          </button>
        </div>
      </div>
    </div>
  );
}
