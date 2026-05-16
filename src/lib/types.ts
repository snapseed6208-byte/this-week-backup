// ── Theme template (built-in, read-only) ──
export interface ThemeTemplate {
  id: string;
  title: string;
  category: ThemeCategory;
  description: string;
  suitableFor: string[];
  weeklyGoal: string;
  dailyAction: string;
  minimumStandard: string;
  checkInType: string;
  reviewQuestions: string[];
  tags: string[];
  icon: string;
  color: string;
}

export type ThemeCategory =
  | "学习成长"
  | "英语提升"
  | "AI与技能"
  | "健康运动"
  | "养生作息"
  | "情绪疗愈"
  | "生活整理"
  | "兴趣探索"
  | "社交关系"
  | "工作实习"
  | "省钱理财"
  | "城市探索"
  | "低能量恢复";

// ── Active theme week (user creates this from a template) ──
export interface ThemeWeek {
  id: string;
  templateId: string;
  themeTitle: string;
  category: ThemeCategory;
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  weeklyGoal: string;
  dailyAction: string;
  minimumStandard: string;
  checkInType: string;
  reviewQuestions: string[];
  icon: string;
  color: string;
  status: "active" | "completed" | "abandoned";
  checkIns: CheckIn[];
  review?: WeekReview;
  createdAt: string;
}

// ── Daily check-in ──
export interface CheckIn {
  date: string;
  status: "full" | "light" | "missed";
  note?: string;
  value?: number;
}

// ── End-of-week review ──
export interface WeekReview {
  biggestGain: string;
  struggleReason: string;
  continueNextWeek: boolean;
  notes?: string;
}

// ── User mood / state selection ──
export type UserMood =
  | "tired"
  | "wantDiscipline"
  | "wantStudy"
  | "wantEnglish"
  | "wantHealth"
  | "wantFun"
  | "wantOrganize"
  | "wantJob";
