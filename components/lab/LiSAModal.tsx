import React from "react";

type HueVars = React.CSSProperties & { "--hue"?: number | string };

interface LiSAModalProps {
  isOpen: boolean;
  isClosing: boolean;
  onClose: () => void;
  email: string;
  setEmail: (email: string) => void;
  inviteState: "idle" | "loading" | "success" | "error";
  setInviteState: (state: "idle" | "loading" | "success" | "error") => void;
  inviteAnim: "none" | "validating" | "fadeout";
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}

export function LiSAModal({
  isOpen,
  isClosing,
  onClose,
  email,
  setEmail,
  inviteState,
  setInviteState,
  inviteAnim,
  onSubmit
}: LiSAModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className={`modal-overlay${isClosing ? " closing" : ""}`}
      role="dialog"
      aria-modal="true"
      onClick={onClose}
      style={{ "--hue": 160 } as HueVars}
    >
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <button
          type="button"
          className="modal-close-x"
          aria-label="Close"
          onClick={(e) => { e.stopPropagation(); onClose(); }}
        >
          <span className="x">×</span>
        </button>
        <div className="modal-title">
          <span className="glitch" data-text="[LiSA]">[LiSA]</span>
          <span className="blink">_</span>
        </div>
        <div className="modal-text">intelligence for ur wallet</div>
        
        <div className="modal-paragraph">
          LiSA is currently in closed alpha development. Access is limited while we refine core features.
          Check our <a href="/docs" target="_blank">documentation</a>, <a href="/docs/changelog/lisa" target="_blank">changelog</a>, 
          and <a href="/docs/roadmap" target="_blank">roadmap</a> for updates.
          Leave your email below to follow future developments.
        </div>

        <div className="spec-grid">
          <div className="spec-item"><div className="spec-key">Web3 ultra mobility</div><div className="spec-desc">Swaps, bridges, and transfers across EVM, directly from chat.</div></div>
          <div className="spec-item"><div className="spec-key">Invest smartly</div><div className="spec-desc">Natural language to investment strategies enforced on-chain.</div></div>
          <div className="spec-item"><div className="spec-key">Trading with AI</div><div className="spec-desc">Natural language to strategies enforced on Hyperliquid and GMX.</div></div>
          <div className="spec-item"><div className="spec-key">Portfolio oversight</div><div className="spec-desc">Manage DeFi positions, track balances, and get notifications on price, news, and custom triggers.</div></div>
          <div className="spec-item"><div className="spec-key">100% non custodial</div><div className="spec-desc">Your keys, your funds. LiSA never holds or controls your assets.</div></div>
          <div className="spec-item"><div className="spec-key">$LISA Token</div><div className="spec-desc">ERC-20 on Ethereum. Required for LiSA dApp access and services like Jensoo AI or 0xPokPak. Fair launch date to be announced. Subscribe for news.</div></div>
        </div>

        <form className={`modal-invite${inviteState === "success" ? " is-success" : ""}`} onSubmit={onSubmit} noValidate>
          {inviteState !== "success" ? (
            <>
              <div className={`invite-heading${inviteAnim === "fadeout" ? " fade-out" : inviteAnim === "validating" ? " validating" : ""}`}>&lt;LiSA&gt; drop ur email for dev updates</div>
              <div className={`invite-wrap${inviteAnim === "fadeout" ? " fade-out" : inviteAnim === "validating" ? " validating" : ""}`}>
                <span className="input-prefix">&gt;</span>
                <input
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  placeholder="email@domain.com"
                  className={`invite-input${inviteState === "error" ? " error" : ""}`}
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); if (inviteState !== "idle") setInviteState("idle"); }}
                />
                <button type="submit" className={`invite-cta key-return${inviteState === "loading" ? " validating" : inviteState === "error" ? " error" : inviteAnim === "fadeout" ? " fade-out" : ""}`} aria-label="Submit email" disabled={inviteState === "loading"}>
                  {inviteState === "loading" ? "✔" : "⏎"}
                </button>
              </div>
            </>
          ) : (
            <div className="invite-success invite-heading">&lt;LiSA&gt; email noted! i&apos;ll ping u on release. <a href="https://x.com/HeyLisaAi" target="_blank" rel="noreferrer">follow on X</a>? :)</div>
          )}
        </form>
      </div>
    </div>
  );
}
