"use client";

import { useEffect, useState, useCallback } from "react";
import type { DropResult } from "@hello-pangea/dnd";
import type { Project, ProjectInput } from "@/types";
import { supabase } from "@/lib/supabase";
import { useAdmin } from "@/lib/auth";
import Board from "@/components/Board";
import ProjectModal from "@/components/ProjectModal";
import ConfirmDialog from "@/components/ConfirmDialog";

export default function Home() {
  const { isAdmin } = useAdmin();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  // City filter
  const [selectedCity, setSelectedCity] = useState<string>("全部");

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  // Delete confirm state
  const [deletingProject, setDeletingProject] = useState<Project | null>(null);

  // Fetch all projects
  const fetchProjects = useCallback(async () => {
    try {
      setFetchError(null);
      const { data, error } = await supabase
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

  // New project
  const handleNewProject = () => {
    setEditingProject(null);
    setShowModal(true);
  };

  // View project — anyone can view; only admin can edit
  const handleCardClick = (project: Project) => {
    setEditingProject(project);
    setShowModal(true);
  };

  // Save (create or update)
  const handleSave = async (data: ProjectInput) => {
    if (editingProject) {
      // Update existing
      const { error } = await supabase
        .from("projects")
        .update(data)
        .eq("id", editingProject.id);

      if (error) {
        console.error("Failed to update project:", error);
        return;
      }

      setProjects((prev) =>
        prev.map((p) =>
          p.id === editingProject.id
            ? { ...editingProject, ...data, updated_at: new Date().toISOString() }
            : p
        )
      );
    } else {
      // Create new
      const { data: created, error } = await supabase
        .from("projects")
        .insert(data)
        .select()
        .single();

      if (error) {
        console.error("Failed to create project:", error);
        return;
      }

      if (created) {
        setProjects((prev) => [created, ...prev]);
      }
    }

    setShowModal(false);
    setEditingProject(null);
  };

  // Delete request
  const handleDeleteRequest = () => {
    if (editingProject) {
      setDeletingProject(editingProject);
    }
  };

  // Delete confirm
  const handleDeleteConfirm = async () => {
    if (!deletingProject) return;

    const { error } = await supabase
      .from("projects")
      .delete()
      .eq("id", deletingProject.id);

    if (error) {
      console.error("Failed to delete project:", error);
      return;
    }

    setProjects((prev) => prev.filter((p) => p.id !== deletingProject.id));
    setDeletingProject(null);
    setShowModal(false);
    setEditingProject(null);
  };

  // Drag end — update stage
  const handleDragEnd = async (result: DropResult) => {
    if (!result.destination) return;

    const sourceStage = result.source.droppableId;
    const destStage = result.destination.droppableId;

    if (sourceStage === destStage) return;

    const projectId = result.draggableId;

    // Optimistic update
    setProjects((prev) =>
      prev.map((p) =>
        p.id === projectId
          ? { ...p, stage: destStage as typeof p.stage, updated_at: new Date().toISOString() }
          : p
      )
    );

    // Update database
    const { error } = await supabase
      .from("projects")
      .update({ stage: destStage })
      .eq("id", projectId);

    if (error) {
      console.error("Failed to update project stage:", error);
      // Revert on failure
      fetchProjects();
    }
  };

  // Close modal
  const handleCloseModal = () => {
    setShowModal(false);
    setEditingProject(null);
  };

  if (loading) {
    return (
      <main className="h-full flex items-center justify-center bg-gray-50/50">
        <p className="text-sm text-gray-300">加载中...</p>
      </main>
    );
  }

  // Unique cities for filter tabs
  const cities = Array.from(new Set(projects.map((p) => p.city).filter(Boolean))).sort();
  const cityCounts: Record<string, number> = {};
  projects.forEach((p) => {
    if (p.city) cityCounts[p.city] = (cityCounts[p.city] || 0) + 1;
  });
  const filteredProjects =
    selectedCity === "全部"
      ? projects
      : projects.filter((p) => p.city === selectedCity);

  return (
    <main className="h-full flex flex-col bg-gray-50/50">
      {fetchError && (
        <div className="absolute top-3 left-1/2 -translate-x-1/2 z-40">
          <p className="text-xs text-amber-600 bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-md max-w-md break-all">
            错误: {fetchError}
          </p>
        </div>
      )}

      {/* City tabs */}
      {cities.length > 0 && (
        <div className="flex items-center gap-1 px-6 pt-3 pb-1">
          <button
            onClick={() => setSelectedCity("全部")}
            className={`px-3 py-1 text-xs rounded-md transition-colors ${
              selectedCity === "全部"
                ? "text-white"
                : "text-gray-400 hover:text-gray-600 hover:bg-gray-100"
            }`}
            style={selectedCity === "全部" ? { backgroundColor: "#00956F" } : undefined}
          >
            全部 ({projects.length})
          </button>
          {cities.map((city) => (
            <button
              key={city}
              onClick={() => setSelectedCity(city)}
              className={`px-3 py-1 text-xs rounded-md transition-colors ${
                selectedCity === city
                  ? "text-white"
                  : "text-gray-400 hover:text-gray-600 hover:bg-gray-100"
              }`}
              style={selectedCity === city ? { backgroundColor: "#00956F" } : undefined}
            >
              {city} ({cityCounts[city] || 0})
            </button>
          ))}
          <span className="text-[10px] text-gray-300 ml-2">
            {cities.length} 个城市 · {projects.length} 个项目
          </span>
        </div>
      )}

      {/* KA 需求摸底清单 */}
      <div className="px-6 pt-2 pb-1">
        <div className="rounded-xl border border-amber-200 bg-amber-50/70 px-5 py-4">
          <h3 className="text-sm font-semibold text-amber-800 mb-3">
            📋 KA 首次需求摸底清单
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-x-4 gap-y-2">
            <div>
              <p className="text-[11px] font-semibold text-amber-700 mb-1">一、业务概况</p>
              <ul className="text-[10px] text-amber-600 space-y-0.5 leading-relaxed">
                <li>1. 主要做什么业务？</li>
                <li>2. 主要配送哪些货物？</li>
                <li>3. 配送场景？（仓-店/仓-仓/仓-社区/仓-工厂）</li>
              </ul>
            </div>
            <div>
              <p className="text-[11px] font-semibold text-amber-700 mb-1">二、物流现状</p>
              <ul className="text-[10px] text-amber-600 space-y-0.5 leading-relaxed">
                <li>4. 配送时间？</li>
                <li>5. 一天几趟？</li>
                <li>6. 多少条线路？</li>
                <li>7. 每条线路多少公里？</li>
                <li>8. 每条线路多少站点？</li>
                <li>9. 每天配送量？（件/方/吨）</li>
                <li>10. 使用什么车型？</li>
                <li>11. 自营还是外包？</li>
              </ul>
            </div>
            <div>
              <p className="text-[11px] font-semibold text-amber-700 mb-1">三、成本情况</p>
              <ul className="text-[10px] text-amber-600 space-y-0.5 leading-relaxed">
                <li>12. 单线路配送成本？</li>
                <li>13. 司机/车辆/油费等成本？</li>
              </ul>
              <p className="text-[11px] font-semibold text-amber-700 mb-1 mt-2">四、需求与痛点</p>
              <ul className="text-[10px] text-amber-600 space-y-0.5 leading-relaxed">
                <li>14. 最大物流痛点？</li>
                <li>15. 是否有降本压力？</li>
                <li>16. 司机短缺/运力不足？</li>
                <li>17. 哪些线路适合试点？为什么？</li>
                <li>18. 最希望解决什么问题？</li>
              </ul>
            </div>
            <div>
              <p className="text-[11px] font-semibold text-amber-700 mb-1">五、决策信息</p>
              <ul className="text-[10px] text-amber-600 space-y-0.5 leading-relaxed">
                <li>19. 最终决策人？决策流程？</li>
                <li>20. 下一步准备什么？何时沟通？</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 min-h-0">
        <Board
          projects={filteredProjects}
          isAdmin={isAdmin}
          onCardClick={handleCardClick}
          onNewProject={handleNewProject}
          onDragEnd={handleDragEnd}
        />
      </div>

      <ProjectModal
        isOpen={showModal}
        project={editingProject}
        isAdmin={isAdmin}
        onClose={handleCloseModal}
        onSave={handleSave}
        onDelete={isAdmin ? handleDeleteRequest : undefined}
      />

      <ConfirmDialog
        isOpen={!!deletingProject}
        projectName={deletingProject?.name || ""}
        onClose={() => setDeletingProject(null)}
        onConfirm={handleDeleteConfirm}
      />
    </main>
  );
}
