"use client";

import { useCallback } from "react";
import { toast as sonnerToast } from "sonner";

type ToastProps = {
  title: string;
  description?: string;
};

export function useToast() {
  const toast = useCallback(({ title, description }: ToastProps) => {
    sonnerToast(title, {
      description,
    });
  }, []);

  return { toast };
}
