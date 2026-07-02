"use client";

import { useEffect, useState, useCallback } from "react";
import type { Project } from "@/types";
import { api } from "@/lib/api";
import { useAdmin } from "@/lib/auth";
import { relativeTime } from "@/lib/utils";

function NotesCell({ notes }: { notes: string }) {
  const [expanded, setExpanded] = useState(false);

  if (!notes) return <span className="text-xs text-gray-300">-</span>;

  const short = notes.slice(0, 80);
  const hasMore = notes.length > 80;

  return (
    <div className="text-xs text-gray-500 whitespace-pre-line leading-relaxed">
      {expanded || !hasMore ? notes : `${short}...`}
      {hasMore && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="ml-1 text-gray-300 hover:text-gray-500 transition-colors"
        >
          {expanded ? "收起" : "展开"}
        </button>
      )}
    </div>
  );
}

function SummaryCell({
  projectId,
  value,
  isAdmin,
}: {
  projectId: string;
  value: string;
  isAdmin: boolean;
}) {
  const [editing, setEditing] = useState(false);
  const [text, setText] = useState(value);

  const handleSave = useCallback(async () => {
    setEditing(false);
    if (text === value) return;
    await api
      .from("projects")
      .update({ summary: text })
      .eq("id", projectId);
  }, [text, value, projectId]);

  if (editing) {
    return (
      <textarea
        autoFocus
        value={text}
        onChange={(e) => setText(e.target.value)}
        onBlur={handleSave}
        onKeyDown={(e) => {
          if (e.key === "Escape") {
            setText(value);
            setEditing(false);
          }
        }}
        rows={3}
        className="w-full text-xs text-gray-600 border border-gray-200 rounded-md px-2 py-1.5
                   focus:outline-none focus:border-gray-300 focus:ring-1 focus:ring-gray-200
                   resize-none"
      />
    );
  }

  return (
    <div
      onClick={() => isAdmin && setEditing(true)}
      className={`text-xs text-gray-500 rounded px-1.5 py-1 -mx-1.5 min-h-[20px]
                 whitespace-pre-line leading-relaxed ${
                   isAdmin ? "cursor-pointer hover:bg-gray-100" : ""
                 }`}
    >
      {text || (
        isAdmin ? <span className="text-gray-300">点击编辑</span> : <span className="text-gray-200">-</span>
      )}
    </div>
  );
}

export default function SummaryPage() {
  const { isAdmin } = useAdmin();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [filterCity, setFilterCity] = useState<string>("全部");

  const fetchProjects = useCallback(async () => {
    try {
      setFetchError(null);
      const { data, error } = await api
        .from("projects")
        .select("*")
        .order("updated_at", { ascending: false });

      if (error) throw error;
      setProjects(data || []);
    } catch (err) {
      console.error("Failed to fetch projects:", err);
      setFetchError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchProjects();
  }, [fetchProjects]);

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-50/50">
        <p className="text-sm text-gray-300">加载中...</p>
      </div>
    );
  }

  const healthLabel: Record<string, string> = {
    green: "🟢",
    yellow: "🟡",
    red: "🔴",
  };

  const cities = Array.from(new Set(projects.map((p) => p.city).filter(Boolean))).sort();
  const filteredProjects =
    filterCity === "全部"
      ? projects
      : projects.filter((p) => p.city === filterCity);

  return (
    <main className="h-full bg-white overflow-auto">
      {fetchError && (
        <div className="absolute top-12 left-1/2 -translate-x-1/2 z-40">
          <p className="text-xs text-amber-600 bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-md">
            无法连接数据库，请检查 Supabase 配置
          </p>
        </div>
      )}

      <div className="px-6 py-4">
        {/* City filter */}
        {cities.length > 0 && (
          <div className="flex items-center gap-2 mb-4">
            <span className="text-xs text-gray-400">城市筛选：</span>
            <select
              value={filterCity}
              onChange={(e) => setFilterCity(e.target.value)}
              className="text-xs border border-gray-200 rounded-md px-2 py-1 bg-white
                         focus:outline-none focus:border-gray-300"
            >
              <option value="全部">全部</option>
              {cities.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            <span className="text-xs text-gray-300">
              {filteredProjects.length} 个项目
            </span>
          </div>
        )}

        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 pr-4 text-xs font-medium text-white w-[140px]" style={{ backgroundColor: "#00956F" }}>
                客户名称
              </th>
              <th className="text-left py-3 pr-4 text-xs font-medium text-white w-[70px]" style={{ backgroundColor: "#00956F" }}>
                城市
              </th>
              <th className="text-left py-3 pr-4 text-xs font-medium text-white w-[80px]" style={{ backgroundColor: "#00956F" }}>
                行政区
              </th>
              <th className="text-left py-3 pr-4 text-xs font-medium text-white w-[90px]" style={{ backgroundColor: "#00956F" }}>
                首次建联
              </th>
              <th className="text-left py-3 pr-4 text-xs font-medium text-white w-[70px]" style={{ backgroundColor: "#00956F" }}>
                跟进人
              </th>
              <th className="text-left py-3 pr-4 text-xs font-medium text-white w-[80px]" style={{ backgroundColor: "#00956F" }}>
                阶段
              </th>
              <th className="text-left py-3 pr-4 text-xs font-medium text-white" style={{ backgroundColor: "#00956F" }}>
                下一步
              </th>
              <th className="text-left py-3 pr-4 text-xs font-medium text-white w-[120px]" style={{ backgroundColor: "#00956F" }}>
                Blocker
              </th>
              <th className="text-left py-3 pr-4 text-xs font-medium text-white w-[200px]" style={{ backgroundColor: "#00956F" }}>
                关键信息总结
              </th>
              <th className="text-left py-3 pr-4 text-xs font-medium text-white" style={{ backgroundColor: "#00956F" }}>
                备注
              </th>
              <th className="text-left py-3 text-xs font-medium text-white w-[72px]" style={{ backgroundColor: "#00956F" }}>
                更新
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredProjects.map((p, i) => (
              <tr
                key={p.id}
                className={`${
                  p.has_blocker
                    ? "bg-red-50/40"
                    : i % 2 === 1
                      ? "bg-gray-50/60"
                      : "bg-white"
                } hover:bg-gray-100/60 transition-colors`}
              >
                <td className="py-3 pr-4 border-b border-gray-100">
                  <div className="flex items-center gap-2">
                    <span className="text-xs">{healthLabel[p.health]}</span>
                    <span className="text-sm font-medium text-gray-900">
                      {p.name}
                    </span>
                  </div>
                </td>
                <td className="py-3 pr-4 border-b border-gray-100">
                  <span className="text-xs text-gray-500">{p.city || "—"}</span>
                </td>
                <td className="py-3 pr-4 border-b border-gray-100">
                  <span className="text-xs text-gray-500">{p.district || "—"}</span>
                </td>
                <td className="py-3 pr-4 border-b border-gray-100">
                  <span className="text-xs text-gray-500">{p.first_contact_date || "—"}</span>
                </td>
                <td className="py-3 pr-4 border-b border-gray-100">
                  <span className="text-xs text-gray-500">{p.assignee || "—"}</span>
                </td>
                <td className="py-3 pr-4 border-b border-gray-100">
                  <span className="text-xs text-gray-500">{p.stage}</span>
                </td>
                <td className="py-3 pr-4 border-b border-gray-100">
                  <span className="text-xs text-gray-600 line-clamp-2">
                    {p.next_action || "-"}
                  </span>
                </td>
                <td className="py-3 pr-4 border-b border-gray-100">
                  {p.has_blocker ? (
                    <span className="text-xs text-red-600 whitespace-pre-line">
                      🚨 {p.blocker_reason || "阻塞"}
                    </span>
                  ) : (
                    <span className="text-xs text-gray-300">—</span>
                  )}
                </td>
                <td className="py-3 pr-4 border-b border-gray-100">
                  <SummaryCell projectId={p.id} value={p.summary || ""} isAdmin={isAdmin} />
                </td>
                <td className="py-3 pr-4 border-b border-gray-100">
                  <NotesCell notes={p.notes || ""} />
                </td>
                <td className="py-3 border-b border-gray-100 text-xs text-gray-300 whitespace-nowrap">
                  {relativeTime(p.updated_at)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredProjects.length === 0 && (
          <p className="text-center text-xs text-gray-300 py-16">暂无项目</p>
        )}
      </div>
    </main>
  );
}
