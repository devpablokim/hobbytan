"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Custom hook for intersection observer visibility detection
 * @param threshold - Visibility threshold (0-1), default 0.1
 * @returns [ref, isVisible] - Section ref and visibility state
 */
export function useIntersectionObserver<T extends HTMLElement = HTMLElement>(
  threshold: number = 0.1
): [React.RefObject<T>, boolean] {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<T>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [threshold]);

  return [ref, isVisible];
}
