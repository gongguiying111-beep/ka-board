import type { Project } from "@/types";
import { relativeTime } from "@/lib/utils";

const healthLabel: Record<string, string> = {
  green: "🟢",
  yellow: "🟡",
  red: "🔴",
};

interface ProjectCardProps {
  project: Project;
  onClick: () => void;
  isDragging?: boolean;
}

export default function ProjectCard({ project, onClick, isDragging }: ProjectCardProps) {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left bg-white rounded-lg border border-gray-100 px-4 py-3
                  hover:bg-gray-50/80 transition-colors focus:outline-none
                  ${isDragging ? "shadow-md" : "shadow-[0_1px_2px_rgba(0,0,0,0.03)]"}`}
    >
      <div className="flex items-center justify-between gap-2 mb-1.5">
        <span className="text-sm font-medium text-gray-900 truncate">
          {project.name}
        </span>
        <span className="text-xs shrink-0">{healthLabel[project.health]}</span>
      </div>
      {project.next_action && (
        <p className="text-xs text-gray-500 truncate mb-1.5">
          {project.next_action}
        </p>
      )}
      <p className="text-[11px] text-gray-300">
        {relativeTime(project.updated_at)}
      </p>
    </button>
  );
}
