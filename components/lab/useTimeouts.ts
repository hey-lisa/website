import { useEffect, useRef, useCallback } from "react";

// Custom hook for managing timeouts
export function useTimeouts() {
  const timeoutsRef = useRef<Set<number>>(new Set());

  const addTimeout = useCallback((callback: () => void, delay: number): number => {
    const id = window.setTimeout(() => {
      timeoutsRef.current.delete(id);
      callback();
    }, delay);
    timeoutsRef.current.add(id);
    return id;
  }, []);

  const clearAllTimeouts = useCallback(() => {
    timeoutsRef.current.forEach((id) => clearTimeout(id));
    timeoutsRef.current.clear();
  }, []);

  useEffect(() => {
    return () => {
      clearAllTimeouts();
    };
  }, [clearAllTimeouts]);

  return { addTimeout, clearAllTimeouts, timeoutsRef };
}
