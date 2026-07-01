export const stages = [
  "线索",
  "已联系",
  "需求确认",
  "方案设计",
  "POC",
  "商务谈判",
  "成交",
] as const;

export type Stage = (typeof stages)[number];

// Stage color palette — used for card left border
export const stageColors: Record<Stage, string> = {
  "线索":    "#94A3B8", // slate-400
  "已联系":  "#6366F1", // indigo-500
  "需求确认": "#8B5CF6", // violet-500
  "方案设计": "#F59E0B", // amber-500
  "POC":     "#F97316", // orange-500
  "商务谈判": "#EF4444", // red-500
  "成交":    "#10B981", // emerald-500
};
