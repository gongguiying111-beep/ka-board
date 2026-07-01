import type { Stage } from "@/lib/stages";

export type Health = "green" | "yellow" | "red";

export interface Project {
  id: string;
  name: string;
  stage: Stage;
  next_action: string;
  health: Health;
  notes: string;
  summary: string;
  has_blocker: boolean;
  blocker_reason: string;
  city: string;
  district: string;
  first_contact_date: string | null;
  assignee: string;
  created_at: string;
  updated_at: string;
}

export type ProjectInput = Omit<Project, "id" | "created_at" | "updated_at">;
