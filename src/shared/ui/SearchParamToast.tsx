"use client";

import { useEffect, useRef } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { showToast } from "./Toast";

type SearchParamToastProps = {
  param: string;
  messages: Record<string, string>;
};

export function SearchParamToast({ param, messages }: SearchParamToastProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const fired = useRef(false);
  const value = searchParams.get(param);
  const message = value ? messages[value] : undefined;

  useEffect(() => {
    if (!message || fired.current) return;

    fired.current = true;
    showToast(message);

    const params = new URLSearchParams(searchParams);
    params.delete(param);
    router.replace(params.size > 0 ? `${pathname}?${params}` : pathname, {
      scroll: false,
    });
  }, [message, param, pathname, router, searchParams]);

  return null;
}
