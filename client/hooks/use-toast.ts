import toast, { Toaster } from 'react-hot-toast';

export interface Toast {
  id: string;
  title: string;
  description?: string;
  variant?: 'default' | 'destructive' | 'success';
  duration?: number;
}

// Wrapper để giữ API tương thích
export function useToast() {
  const notify = (props: Omit<Toast, 'id'>) => {
    const { title, description, variant = 'default', duration = 4000 } = props;
    const message = description ? `${title}\n${description}` : title;

    switch (variant) {
      case 'success':
        return toast.success(message, { duration });
      case 'destructive':
        return toast.error(message, { duration });
      default:
        return toast(message, { duration });
    }
  };

  return {
    toast: notify,
    dismiss: (id: string) => toast.dismiss(id),
  };
}

// Export react-hot-toast directly for convenience
export { toast, Toaster };

// Convenience methods
export const toastUtils = {
  success: (title: string, description?: string) => {
    const message = description ? `${title}\n${description}` : title;
    return toast.success(message);
  },
  error: (title: string, description?: string) => {
    const message = description ? `${title}\n${description}` : title;
    return toast.error(message);
  },
  info: (title: string, description?: string) => {
    const message = description ? `${title}\n${description}` : title;
    return toast(message);
  },
  loading: (message: string) => toast.loading(message),
  promise: <T>(
    promise: Promise<T>,
    msgs: {
      loading: string;
      success: string;
      error: string;
    }
  ) => toast.promise(promise, msgs),
};
