
import { AlertTriangle, X, Trash2 } from "lucide-react";

type DeleteReadingModalProps = {
  glucoseValue: number;
  isDeleting: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

function DeleteReadingModal({
  glucoseValue,
  isDeleting,
  onConfirm,
  onCancel,
}: DeleteReadingModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="delete-reading-title"
        aria-describedby="delete-reading-description"
        className="w-full max-w-md rounded-2xl border border-(--app-border) bg-(--surface) p-6 shadow-2xl"
      >
        <div className="flex items-start gap-4">
          <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400">
            <AlertTriangle size={25} />
          </div>

          <div className="flex-1">
            <h2
              id="delete-reading-title"
              className="text-lg font-bold text-(--text-primary)"
            >
              Delete reading?
            </h2>

            <p
              id="delete-reading-description"
              className="mt-2 text-sm leading-6 text-(--text-secondary)"
            >
              Are you sure you want to delete your{" "}
              <strong className="text-(--text-primary)">
                {glucoseValue} mg/dL
              </strong>{" "}
              glucose reading? This action cannot be undone.
            </p>
          </div>

          <button
            type="button"
            onClick={onCancel}
            disabled={isDeleting}
            aria-label="Close dialog"
            className="rounded-lg p-1 text-(--text-secondary) hover:bg-(--app-bg) disabled:opacity-50"
          >
            <X size={19} />
          </button>
        </div>

        <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onCancel}
            disabled={isDeleting}
            className="rounded-xl border border-(--app-border) px-5 py-3 text-sm font-semibold text-(--text-secondary) transition hover:bg-(--app-bg) disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={isDeleting}
            className="flex items-center justify-center gap-2 rounded-xl bg-red-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Trash2 size={17} />
            {isDeleting ? "Deleting..." : "Delete reading"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default DeleteReadingModal;
