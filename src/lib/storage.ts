import type { ThemeWeek, CheckIn, WeekReview, ThemeCategory } from "./types";
import { getThemeById } from "./themes";

const STORAGE_KEY = "this-week-data";
const CHECKIN_KEY = "this-week-checkins";

function getAllWeeks(): ThemeWeek[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveAllWeeks(weeks: ThemeWeek[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(weeks));
}

// ── Get the currently active week ──
export function getActiveWeek(): ThemeWeek | undefined {
  return getAllWeeks().find((w) => w.status === "active");
}

// ── Start a new theme week from template ──
export function startThemeWeek(templateId: string): ThemeWeek | null {
  const template = getThemeById(templateId);
  if (!template) return null;

  // Auto-archive any existing active week
  const weeks = getAllWeeks();
  const active = weeks.find((w) => w.status === "active");
  if (active) {
    active.status = "abandoned";
  }

  const now = new Date();
  // Align start to today
  const startDate = now.toISOString().slice(0, 10);
  const end = new Date(now);
  end.setDate(end.getDate() + 6);
  const endDate = end.toISOString().slice(0, 10);

  const newWeek: ThemeWeek = {
    id: `week-${Date.now()}`,
    templateId: template.id,
    themeTitle: template.title,
    category: template.category,
    startDate,
    endDate,
    weeklyGoal: template.weeklyGoal,
    dailyAction: template.dailyAction,
    minimumStandard: template.minimumStandard,
    checkInType: template.checkInType,
    reviewQuestions: template.reviewQuestions,
    icon: template.icon,
    color: template.color,
    status: "active",
    checkIns: [],
    createdAt: new Date().toISOString(),
  };

  weeks.push(newWeek);
  saveAllWeeks(weeks);
  return newWeek;
}

// ── Check in for a specific date ──
export function checkInDate(
  weekId: string,
  date: string,
  status: "full" | "light" | "missed",
  note?: string,
  value?: number,
): ThemeWeek | undefined {
  const weeks = getAllWeeks();
  const week = weeks.find((w) => w.id === weekId);
  if (!week) return undefined;

  const existing = week.checkIns.findIndex((c) => c.date === date);
  const checkIn: CheckIn = { date, status, note, value };

  if (existing >= 0) {
    week.checkIns[existing] = checkIn;
  } else {
    week.checkIns.push(checkIn);
  }

  saveAllWeeks(weeks);
  return week;
}

// ── Complete the week (status → completed) ──
export function completeWeek(weekId: string, review: WeekReview): ThemeWeek | undefined {
  const weeks = getAllWeeks();
  const week = weeks.find((w) => w.id === weekId);
  if (!week) return undefined;

  week.status = "completed";
  week.review = review;
  saveAllWeeks(weeks);
  return week;
}

// ── Get last completed week for review ──
export function getLastCompletedWeek(): ThemeWeek | undefined {
  const weeks = getAllWeeks();
  // Return the most recently completed week
  return weeks
    .filter((w) => w.status === "completed")
    .sort((a, b) => new Date(b.endDate).getTime() - new Date(a.endDate).getTime())[0];
}

// ── Get all historical weeks ──
export function getAllHistoricalWeeks(): ThemeWeek[] {
  return getAllWeeks().sort(
    (a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime(),
  );
}

// ── Get week by ID ──
export function getWeekById(id: string): ThemeWeek | undefined {
  return getAllWeeks().find((w) => w.id === id);
}

// ── Generate today's date string ──
export function today(): string {
  return new Date().toISOString().slice(0, 10);
}

// ── Generate 7 date strings for a week starting from startDate ──
export function getWeekDates(startDate: string): string[] {
  const dates: string[] = [];
  const start = new Date(startDate);
  for (let i = 0; i < 7; i++) {
    const d = new Date(start);
    d.setDate(d.getDate() + i);
    dates.push(d.toISOString().slice(0, 10));
  }
  return dates;
}

export const CATEGORY_COLORS: Record<ThemeCategory, string> = {
  "学习成长": "#6366F1",
  "英语提升": "#3B82F6",
  "AI与技能": "#06B6D4",
  "健康运动": "#10B981",
  "养生作息": "#1E3A5F",
  "情绪疗愈": "#F43F5E",
  "生活整理": "#8B5CF6",
  "兴趣探索": "#EC4899",
  "社交关系": "#F59E0B",
  "工作实习": "#2563EB",
  "省钱理财": "#34D399",
  "城市探索": "#D97706",
  "低能量恢复": "#94A3B8",
};
