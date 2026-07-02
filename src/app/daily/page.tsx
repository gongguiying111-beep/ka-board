"use client";

import { useEffect, useState, useCallback } from "react";
import type { Project } from "@/types";
import { supabase } from "@/lib/supabase";
import { relativeTime } from "@/lib/utils";
import { stages } from "@/lib/stages";

export default function DailyPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProjects = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .order("updated_at", { ascending: false });
      if (error) throw error;
      setProjects(data || []);
    } catch (err) {
      console.error("Failed to fetch projects:", err);
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
      <main className="h-full flex items-center justify-center bg-white">
        <p className="text-sm text-gray-300">加载中...</p>
      </main>
    );
  }

  // Group by city
  const groups: Record<string, Project[]> = {};
  projects.forEach((p) => {
    const city = p.city || "未分类";
    if (!groups[city]) groups[city] = [];
    groups[city].push(p);
  });

  // Sort cities: known cities first, then alphabetical
  const cityOrder = ["无锡", "江门", "佛山"];
  const sortedCities = Object.keys(groups).sort((a, b) => {
    const ai = cityOrder.indexOf(a);
    const bi = cityOrder.indexOf(b);
    if (ai !== -1 && bi !== -1) return ai - bi;
    if (ai !== -1) return -1;
    if (bi !== -1) return 1;
    return a.localeCompare(b);
  });

  // Summary stats
  const today = new Date().toDateString();
  const updatedToday = projects.filter(
    (p) => new Date(p.updated_at).toDateString() === today
  ).length;
  const stale7d = projects.filter((p) => {
    const days = Math.floor(
      (Date.now() - new Date(p.updated_at).getTime()) / (1000 * 60 * 60 * 24)
    );
    return days > 7;
  }).length;
  const stageCounts: Record<string, number> = {};
  projects.forEach((p) => {
    stageCounts[p.stage] = (stageCounts[p.stage] || 0) + 1;
  });

  return (
    <main className="h-full bg-white overflow-auto">
      <div className="max-w-4xl mx-auto px-4 py-6 md:px-6">
        <h1 className="text-base font-semibold text-gray-900 mb-6">
          Daily Overview
        </h1>

        {/* City cards */}
        <div className="space-y-5">
          {sortedCities.map((city) => {
            const items = groups[city];
            return (
              <div
                key={city}
                className="rounded-xl border border-gray-100 overflow-hidden"
              >
                {/* Card header */}
                <div className="bg-gray-50/80 px-4 py-3 border-b border-gray-100">
                  <h2 className="text-sm font-semibold text-gray-700">
                    📍 {city} · 今日大客户概览
                  </h2>
                  <p className="text-[11px] text-gray-400 mt-0.5">
                    {items.length} 个项目
                  </p>
                </div>

                {/* Project list */}
                <div className="divide-y divide-gray-50">
                  {items.map((p) => (
                    <div
                      key={p.id}
                      className="flex items-center justify-between px-4 py-3 hover:bg-gray-50/50 transition-colors"
                    >
                      <div className="flex-1 min-w-0 mr-4">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="text-sm font-medium text-gray-900 truncate">
                            {p.name}
                          </span>
                          <span className="text-[11px] text-gray-300 shrink-0">
                            {p.stage}
                          </span>
                        </div>
                        {p.next_action && (
                          <p className="text-xs text-gray-400 truncate">
                            {p.next_action}
                          </p>
                        )}
                      </div>
                      <span className="text-[11px] text-gray-300 shrink-0">
                        {relativeTime(p.updated_at)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Summary card */}
        <div className="mt-6 rounded-xl border border-gray-100 overflow-hidden">
          <div className="bg-gray-50/80 px-4 py-3 border-b border-gray-100">
            <h2 className="text-sm font-semibold text-gray-700">
              📊 全局汇总
            </h2>
          </div>
          <div className="px-4 py-4 space-y-3">
            {/* Key metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="bg-gray-50 rounded-lg px-3 py-2.5 text-center">
                <p className="text-lg font-bold text-gray-900">{projects.length}</p>
                <p className="text-[11px] text-gray-400">总项目</p>
              </div>
              <div className="bg-gray-50 rounded-lg px-3 py-2.5 text-center">
                <p className="text-lg font-bold text-gray-900">{sortedCities.length}</p>
                <p className="text-[11px] text-gray-400">城市</p>
              </div>
              <div className="bg-gray-50 rounded-lg px-3 py-2.5 text-center">
                <p className="text-lg font-bold text-green-600">{updatedToday}</p>
                <p className="text-[11px] text-gray-400">今日更新</p>
              </div>
              <div className="bg-gray-50 rounded-lg px-3 py-2.5 text-center">
                <p className="text-lg font-bold text-orange-500">{stale7d}</p>
                <p className="text-[11px] text-gray-400">&gt;7天未更新</p>
              </div>
            </div>

            {/* Stage breakdown */}
            <div className="flex flex-wrap gap-2">
              {stages.map((s) => (
                <div
                  key={s}
                  className="flex items-center gap-1.5 bg-gray-50 rounded-md px-3 py-1.5"
                >
                  <span className="text-xs text-gray-500">{s}</span>
                  <span className="text-xs font-semibold text-gray-700">
                    {stageCounts[s] || 0}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
