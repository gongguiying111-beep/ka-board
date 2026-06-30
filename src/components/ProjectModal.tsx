"use client";

import { useEffect, useState } from "react";
import type { Project, ProjectInput, Health } from "@/types";
import { stages, type Stage } from "@/lib/stages";
import { NOTES_TEMPLATE } from "@/lib/notes-template";

const healthOptions: { value: Health; label: string }[] = [
  { value: "green", label: "🟢" },
  { value: "yellow", label: "🟡" },
  { value: "red", label: "🔴" },
];

interface ProjectModalProps {
  isOpen: boolean;
  project?: Project | null;
  onClose: () => void;
  onSave: (data: ProjectInput) => void;
  onDelete?: () => void;
}

export default function ProjectModal({
  isOpen,
  project,
  onClose,
  onSave,
  onDelete,
}: ProjectModalProps) {
  const [name, setName] = useState("");
  const [stage, setStage] = useState<Stage>(stages[0]);
  const [nextAction, setNextAction] = useState("");
  const [health, setHealth] = useState<Health>("green");
  const [summary, setSummary] = useState("");
  const [notes, setNotes] = useState("");

  const isEdit = !!project;

  useEffect(() => {
    if (project) {
      setName(project.name);
      setStage(project.stage);
      setNextAction(project.next_action);
      setHealth(project.health);
      setSummary(project.summary || "");
      setNotes(project.notes);
    } else {
      setName("");
      setStage(stages[0]);
      setNextAction("");
      setHealth("green");
      setSummary("");
      setNotes(NOTES_TEMPLATE);
    }
  }, [project, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      name: name.trim(),
      stage,
      next_action: nextAction.trim(),
      health,
      summary: summary.trim(),
      notes,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh]">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/20"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-xl shadow-lg w-[480px] max-h-[70vh] overflow-y-auto">
        <form onSubmit={handleSubmit}>
          {/* Header */}
          <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-gray-100">
            <h2 className="text-base font-semibold text-gray-900">
              {isEdit ? "编辑项目" : "新建项目"}
            </h2>
            <button
              type="button"
              onClick={onClose}
              className="text-gray-300 hover:text-gray-500 transition-colors"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M4 4L12 12M12 4L4 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </button>
          </div>

          {/* Body */}
          <div className="px-6 py-4 space-y-4">
            {/* 客户名称 */}
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5">
                客户名称
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="输入客户名称"
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg
                           focus:outline-none focus:border-gray-300 focus:ring-1 focus:ring-gray-200
                           placeholder:text-gray-300"
              />
            </div>

            {/* 项目阶段 */}
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5">
                项目阶段
              </label>
              <select
                value={stage}
                onChange={(e) => setStage(e.target.value as Stage)}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg
                           focus:outline-none focus:border-gray-300 focus:ring-1 focus:ring-gray-200
                           bg-white"
              >
                {stages.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            {/* 下一步 */}
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5">
                下一步
              </label>
              <input
                type="text"
                value={nextAction}
                onChange={(e) => setNextAction(e.target.value)}
                placeholder="下一步行动"
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg
                           focus:outline-none focus:border-gray-300 focus:ring-1 focus:ring-gray-200
                           placeholder:text-gray-300"
              />
            </div>

            {/* 关键信息总结 */}
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5">
                关键信息总结
              </label>
              <textarea
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                rows={3}
                placeholder="简要总结本项目关键信息"
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg
                           focus:outline-none focus:border-gray-300 focus:ring-1 focus:ring-gray-200
                           resize-none leading-relaxed placeholder:text-gray-300"
              />
            </div>

            {/* 健康状态 */}
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5">
                健康状态
              </label>
              <div className="flex gap-2">
                {healthOptions.map((h) => (
                  <button
                    key={h.value}
                    type="button"
                    onClick={() => setHealth(h.value)}
                    className={`px-3 py-1.5 text-xs rounded-md border transition-colors ${
                      health === h.value
                        ? "border-gray-400 bg-gray-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    {h.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 备注 */}
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5">
                备注
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={10}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg
                           focus:outline-none focus:border-gray-300 focus:ring-1 focus:ring-gray-200
                           resize-none leading-relaxed"
              />
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100">
            <div>
              {isEdit && onDelete && (
                <button
                  type="button"
                  onClick={onDelete}
                  className="text-xs text-red-400 hover:text-red-600 transition-colors"
                >
                  删除项目
                </button>
              )}
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs text-gray-500 hover:text-gray-700 transition-colors"
              >
                取消
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-xs font-medium text-white bg-gray-900 rounded-lg
                           hover:bg-gray-800 transition-colors"
              >
                保存
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
