"use client";

interface ConfirmDialogProps {
  isOpen: boolean;
  projectName: string;
  onClose: () => void;
  onConfirm: () => void;
}

export default function ConfirmDialog({
  isOpen,
  projectName,
  onClose,
  onConfirm,
}: ConfirmDialogProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/20"
        onClick={onClose}
      />

      {/* Dialog */}
      <div className="relative bg-white rounded-xl shadow-lg w-[360px] p-6">
        <p className="text-sm text-gray-700 mb-1">
          确定要删除「{projectName}」吗？
        </p>
        <p className="text-xs text-gray-400 mb-6">
          此操作不可撤销。
        </p>

        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs text-gray-500 hover:text-gray-700 transition-colors"
          >
            取消
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 text-xs font-medium text-white bg-red-500 rounded-lg
                       hover:bg-red-600 transition-colors"
          >
            删除
          </button>
        </div>
      </div>
    </div>
  );
}
