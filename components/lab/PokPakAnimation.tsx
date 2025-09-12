import React, { useCallback } from "react";

type PokVars = React.CSSProperties & {
  "--pok-x"?: string;
  "--pok-bug-y"?: string;
};

interface PokPakAnimationProps {
  addTimeout: (callback: () => void, delay: number) => number;
}

export function PokPakAnimation({ addTimeout }: PokPakAnimationProps) {
  const handleAnimationIteration = useCallback((e: React.AnimationEvent<HTMLSpanElement>) => {
    const x = `${Math.floor(Math.random() * 80 + 10)}%`;
    e.currentTarget.style.setProperty("--pok-x", x);
    
    // Schedule bug reveal (identical logic)
    const parent = e.currentTarget.parentElement;
    const bug = parent?.querySelector<HTMLElement>(".pok-bug") ?? null;
    if (bug) {
      bug.style.setProperty("--pok-x", x);
      bug.style.setProperty(
        "--pok-bug-y",
        `${Math.floor(Math.random() * 50 + 25)}%`
      );
      
      // Show after delay, fade out before line (same timing)
      addTimeout(() => {
        bug.style.opacity = "1";
      }, 400);
      
      addTimeout(() => {
        bug.style.opacity = "0";
      }, 1200);
    }
  }, [addTimeout]);

  return (
    <>
      <span
        className="pok-scan"
        style={{ "--pok-x": "50%" } as PokVars}
        onAnimationIteration={handleAnimationIteration}
      />
      <span 
        className="pok-bug" 
        style={{ "--pok-x": "50%", "--pok-bug-y": "50%", opacity: 0 } as PokVars} 
      />
    </>
  );
}
