import { toast } from "sonner";

export const showToast = {
  success: (message: string, description?: string) => {
    toast.success(message, { description });
  },

  error: (message: string, description?: string) => {
    toast.error(message, { description });
  },

  info: (message: string, description?: string) => {
    toast.info(message, { description });
  },

  loading: (message: string, description?: string) => {
    return toast.loading(message, { description });
  },

  promise: <T>(
    promise: Promise<T>,
    options: {
      loading: string;
      success: string | ((data: T) => string);
      error: string | ((error: Error) => string);
    },
  ) => {
    return toast.promise(promise, options);
  },

  dismiss: (id?: string | number) => {
    toast.dismiss(id);
  },
};

// Common toast messages
export const toastMessages = {
  noteSaved: () => showToast.success("Note saved"),
  noteCreated: () => showToast.success("Note created"),
  noteDeleted: () => showToast.success("Note deleted"),
  noteCopied: () => showToast.success("Note copied to clipboard"),
  settingsSaved: () => showToast.success("Settings saved"),
  importSuccess: (count: number) =>
    showToast.success(`Imported ${count} notes successfully`),
  importError: () =>
    showToast.error("Failed to import notes", "Please check the file format"),
  exportSuccess: () => showToast.success("Notes exported successfully"),
  aiError: () =>
    showToast.error("AI request failed", "Please try again in a moment"),
  connectionError: () =>
    showToast.error(
      "Connection error",
      "Please check your internet connection",
    ),
  copySuccess: () => showToast.success("Copied to clipboard"),
  saveError: () => showToast.error("Failed to save", "Please try again"),
};
