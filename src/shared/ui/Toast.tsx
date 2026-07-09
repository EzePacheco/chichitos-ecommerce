"use client";

import { Check } from "lucide-react";
import { useEffect, useState } from "react";

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
