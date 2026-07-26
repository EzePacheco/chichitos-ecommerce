"use client";

import { Check } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

const TOAST_EVENT = "chichitos-toast";

export function showToast(message: string) {
  if (typeof window === "undefined") return;

  window.dispatchEvent(new CustomEvent(TOAST_EVENT, { detail: { message } }));
}

export function Toaster() {
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    function handleToast(event: Event) {
      const detail = (event as CustomEvent<{ message?: string }>).detail;

      if (detail?.message) {
        setMessage(detail.message);
      }
    }

    window.addEventListener(TOAST_EVENT, handleToast);
    return () => window.removeEventListener(TOAST_EVENT, handleToast);
  }, []);

  const handleDone = useCallback(() => setMessage(null), []);

  if (!message) return null;

  return <Toast key={message} message={message} onDone={handleDone} />;
}

type ToastProps = {
  message: string;
  durationMs?: number;
  onDone?: () => void;
};

export function Toast({ message, durationMs = 2200, onDone }: ToastProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const enter = requestAnimationFrame(() => setVisible(true));
    const hide = setTimeout(() => setVisible(false), durationMs);
    const finish = setTimeout(() => onDone?.(), durationMs + 220);
    return () => {
      cancelAnimationFrame(enter);
      clearTimeout(hide);
      clearTimeout(finish);
    };
  }, [message, durationMs, onDone]);

  return (
    <div className={`toast ${visible ? "is-visible" : ""}`} role="status">
      <Check size={16} /> {message}
    </div>
  );
}
