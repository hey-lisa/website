import React, { useRef, useCallback, useEffect } from "react";
import { useTimeouts } from "./useTimeouts";

interface MinesEmbersProps {
  count?: number;
}

export function MinesEmbers({ count = 18 }: MinesEmbersProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const { addTimeout, clearAllTimeouts } = useTimeouts();
  const isCancelledRef = useRef(false);

  const createEmberElement = useCallback(() => {
    const ember = document.createElement("div");
    ember.className = "mines-ember";
    
    // Generate random properties (same ranges as before)
    const left = 15 + Math.random() * 70; // 15% - 85%
    const size = 2 + Math.random() * 4; // 2px - 6px
    const duration = 2.8 + Math.random() * 3.8; // 2.8s - 6.6s
    const drift = (Math.random() * 2 - 1) * 30; // -30px to 30px
    const delay = Math.random() * 1.2;
    const rise = 110 + Math.random() * 60; // 110% - 170%
    
    // Apply styles (identical to before)
    ember.style.left = `${left}%`;
    ember.style.width = `${size}px`;
    ember.style.height = `${size}px`;
    ember.style.animationDuration = `${duration}s`;
    ember.style.animationDelay = `${delay}s`;
    ember.style.setProperty("--drift", `${drift}px`);
    ember.style.setProperty("--rise", `${rise}%`);
    
    return ember;
  }, []);

  const spawnEmberRef = useRef<(() => void) | null>(null);
  
  const spawnEmber = useCallback(() => {
    const container = containerRef.current;
    if (!container || isCancelledRef.current || !container.isConnected) return;
    
    const ember = createEmberElement();
    container.appendChild(ember);
    
    // Handle ember lifecycle (identical behavior)
    const handleAnimationEnd = () => {
      if (ember.parentElement) ember.remove();
      // Respawn after pause (same timing)
      addTimeout(() => {
        if (isCancelledRef.current || !containerRef.current?.isConnected) return;
        spawnEmberRef.current?.();
      }, 200 + Math.random() * 500);
    };
    
    ember.addEventListener("animationend", handleAnimationEnd, { once: true });
  }, [createEmberElement, addTimeout]);
  
  spawnEmberRef.current = spawnEmber;

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    isCancelledRef.current = false;
    
    // Spawn initial embers (same as before)
    for (let i = 0; i < count; i++) {
      spawnEmber();
    }

    return () => {
      // Cleanup (identical to before)
      isCancelledRef.current = true;
      clearAllTimeouts();
      if (container) {
        container.innerHTML = "";
      }
    };
  }, [count, spawnEmber, clearAllTimeouts]);

  return <div ref={containerRef} className="mines-embers-adv" />;
}
