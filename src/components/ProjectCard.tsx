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
      className={`w-full text-left rounded-lg border px-4 py-3
                  transition-colors focus:outline-none
                  ${isDragging ? "shadow-md" : "shadow-[0_1px_2px_rgba(0,0,0,0.03)]"}
                  ${
                    project.has_blocker
                      ? "bg-red-50/50 border-red-200 hover:bg-red-50/80"
                      : "bg-white border-gray-100 hover:bg-gray-50/80"
                  }`}
    >
      <div className="flex items-center justify-between gap-2 mb-1.5">
        <div className="flex items-center gap-1.5 min-w-0">
          {project.has_blocker && (
            <span className="text-sm shrink-0" title={project.blocker_reason}>🚨</span>
          )}
          <span className="text-sm font-medium text-gray-900 truncate">
            {project.name}
          </span>
        </div>
        <span className="text-xs shrink-0">{healthLabel[project.health]}</span>
      </div>
      {project.city && (
        <span className="inline-block text-[10px] text-gray-400 bg-gray-100 rounded px-1.5 py-0.5 mb-1">
          {project.city}
        </span>
      )}
      {project.has_blocker && project.blocker_reason && (
        <p className="text-xs text-red-600 truncate mb-1.5">
          {project.blocker_reason}
        </p>
      )}
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
