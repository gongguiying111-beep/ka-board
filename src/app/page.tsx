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

  return (
    <main className="h-full bg-gray-50/50">
      {fetchError && (
        <div className="absolute top-3 left-1/2 -translate-x-1/2 z-40">
          <p className="text-xs text-amber-600 bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-md">
            无法连接数据库，请检查 Supabase 配置
          </p>
        </div>
      )}

      <Board
        projects={projects}
        isAdmin={isAdmin}
        onCardClick={handleCardClick}
        onNewProject={handleNewProject}
        onDragEnd={handleDragEnd}
      />

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
