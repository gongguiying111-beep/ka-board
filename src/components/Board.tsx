"use client";

import type { Project } from "@/types";
import { stages } from "@/lib/stages";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import type { DropResult } from "@hello-pangea/dnd";
import ProjectCard from "./ProjectCard";

interface BoardProps {
  projects: Project[];
  isAdmin: boolean;
  onCardClick: (project: Project) => void;
  onNewProject: () => void;
  onDragEnd: (result: DropResult) => void;
}

export default function Board({
  projects,
  isAdmin,
  onCardClick,
  onNewProject,
  onDragEnd,
}: BoardProps) {
  const getStageProjects = (stage: string) => {
    return projects
      .filter((p) => p.stage === stage)
      .sort(
        (a, b) =>
          new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
      );
  };

  const content = (
    <div className="h-full flex gap-5 p-6 overflow-x-auto">
      {/* New Project Button — admin only */}
      {isAdmin && (
        <div className="shrink-0 w-[140px] flex flex-col">
          <div className="h-10 flex items-center">
            <button
              onClick={onNewProject}
              className="w-full text-xs font-medium text-gray-400 hover:text-gray-600
                         border border-dashed border-gray-200 hover:border-gray-300
                         rounded-lg py-2 transition-colors"
            >
              + New Project
            </button>
          </div>
        </div>
      )}

      {/* Stage Columns */}
      {stages.map((stage) => {
        const stageProjects = getStageProjects(stage);

        return (
          <div key={stage} className="shrink-0 w-[260px] flex flex-col">
            {/* Column Header */}
            <div className="h-10 flex items-center justify-between mb-3">
              <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                {stage}
              </h2>
              <span className="text-[11px] text-gray-300 tabular-nums">
                {stageProjects.length}
              </span>
            </div>

            {/* Card List */}
            {isAdmin ? (
              <Droppable droppableId={stage}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`flex flex-col gap-2 overflow-y-auto pr-1 pb-4 min-h-[60px] rounded-lg transition-colors ${
                      snapshot.isDraggingOver ? "bg-blue-50/50" : ""
                    }`}
                  >
                    {stageProjects.map((project, index) => (
                      <Draggable
                        key={project.id}
                        draggableId={project.id}
                        index={index}
                      >
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                          >
                            <ProjectCard
                              project={project}
                              onClick={() => onCardClick(project)}
                              isDragging={snapshot.isDragging}
                            />
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                    {stageProjects.length === 0 && !snapshot.isDraggingOver && (
                      <p className="text-xs text-gray-200 text-center py-8">
                        暂无项目
                      </p>
                    )}
                  </div>
                )}
              </Droppable>
            ) : (
              <div className="flex flex-col gap-2 overflow-y-auto pr-1 pb-4 min-h-[60px]">
                {stageProjects.map((project) => (
                  <ProjectCard
                    key={project.id}
                    project={project}
                    onClick={() => onCardClick(project)}
                  />
                ))}
                {stageProjects.length === 0 && (
                  <p className="text-xs text-gray-200 text-center py-8">暂无项目</p>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );

  if (isAdmin) {
    return <DragDropContext onDragEnd={onDragEnd}>{content}</DragDropContext>;
  }

  return content;
}
