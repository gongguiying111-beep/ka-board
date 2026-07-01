import type { Project } from "@/types";
import { stageColors } from "@/lib/stages";
import { relativeTime } from "@/lib/utils";

interface ProjectCardProps {
  project: Project;
  onClick: () => void;
  isDragging?: boolean;
}

function daysSince(date: string): number {
  const now = Date.now();
  const then = new Date(date).getTime();
  return Math.floor((now - then) / (1000 * 60 * 60 * 24));
}

export default function ProjectCard({ project, onClick, isDragging }: ProjectCardProps) {
  const color = stageColors[project.stage] || "#94A3B8";
  const inactive = daysSince(project.updated_at);
  const dot =
    inactive > 30 ? "🔴" : inactive > 14 ? "🟠" : null;

  return (
    <button
      onClick={onClick}
      className={`w-full text-left bg-white rounded-lg border border-gray-100 pl-3 pr-4 py-3
                  hover:bg-gray-50/80 transition-colors focus:outline-none relative overflow-hidden
                  ${isDragging ? "shadow-md" : "shadow-[0_1px_2px_rgba(0,0,0,0.03)]"}`}
      style={{ borderLeft: `4px solid ${color}` }}
    >
      {/* Name + inactivity dot */}
      <div className="flex items-center justify-between gap-2 mb-1">
        <span className="text-sm font-medium text-gray-900 truncate">
          {project.name}
        </span>
        {dot && (
          <span className="text-[10px] shrink-0" title={`${inactive}天未更新`}>{dot}</span>
        )}
      </div>

      {/* City + connected date */}
      <div className="flex items-center gap-2 mb-1">
        {project.city && (
          <span className="text-[11px] text-gray-400">📍{project.city}</span>
        )}
        {project.first_contact_date && (
          <span className="text-[11px] text-gray-400">{project.first_contact_date}</span>
        )}
      </div>

      {/* Next action */}
      {project.next_action && (
        <p className="text-xs text-gray-500 truncate mb-1">
          {project.next_action}
        </p>
      )}

      {/* Updated time */}
      <p className="text-[10px] text-gray-300">
        {relativeTime(project.updated_at)}
      </p>
    </button>
  );
}
