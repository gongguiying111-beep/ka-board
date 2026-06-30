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
