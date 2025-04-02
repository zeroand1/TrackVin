import { writable } from 'svelte/store';

export type Toast = {
    id: number;
    message: string;
    type?: "success" | "error" | "info" | "delete";
  };

export const toasts = writable<Toast[]>([]);

export function addToast(message: string, type: "success" | "error" | "info" | "delete" = "success", duration = 3) {
    const id = Date.now();
    toasts.update(toasts => [...toasts, { id, message, type }]);

    // Auto-remove the toast after 'duration' milliseconds
    setTimeout(() => {
        toasts.update(toasts => toasts.filter(t => t.id !== id));
    }, duration*1000);
}