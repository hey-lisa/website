"use client";
import React, { useEffect, useRef, useState, useCallback } from "react";
import Image from "next/image";

type HueVars = React.CSSProperties & { "--hue"?: number | string };
type GlitchVars = React.CSSProperties & {
  "--n"?: number | string;
  "--t"?: string;
  "--d"?: string;
};
type PokVars = React.CSSProperties & {
  "--pok-x"?: string;
  "--pok-bug-y"?: string;
};

// Google Analytics gtag types
declare global {
  interface Window {
    gtag?: (
      command: 'event',
      action: string,
      parameters: {
        event_category?: string;
        event_label?: string;
        description?: string;
        [key: string]: unknown;
      }
    ) => void;
  }
}

function MinesEmbers({ count = 18 }: { count?: number }) {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = ref.current;
    if (!container) return;

    let isCancelled = false;
    const timeouts = new Set<number>();

    const scheduleSpawn = (delayMs: number) => {
      const id = window.setTimeout(() => {
        timeouts.delete(id);
        if (isCancelled || !container.isConnected) return;
        spawnOne();
      }, delayMs);
      timeouts.add(id);
    };

    function spawnOne() {
      if (!container || isCancelled || !container.isConnected) return;
      const ember = document.createElement("div");
      ember.className = "mines-ember";
      const left = 15 + Math.random() * 70; // 15% - 85%
      const size = 2 + Math.random() * 4; // 2px - 6px
      const duration = 2.8 + Math.random() * 3.8; // 2.8s - 6.6s
      const drift = (Math.random() * 2 - 1) * 30; // -30px to 30px
      const delay = Math.random() * 1.2;
      const rise = 110 + Math.random() * 60; // 110% - 170%
      ember.style.left = `${left}%`;
      ember.style.width = `${size}px`;
      ember.style.height = `${size}px`;
      ember.style.animationDuration = `${duration}s`;
      ember.style.animationDelay = `${delay}s`;
      ember.style.setProperty("--drift", `${drift}px`);
      ember.style.setProperty("--rise", `${rise}%`);
      container.appendChild(ember);
      const handle = () => {
        if (ember.parentElement) ember.remove();
        // respawn after a short pause
        scheduleSpawn(200 + Math.random() * 500);
      };
      ember.addEventListener("animationend", handle, { once: true });
    }

    for (let i = 0; i < count; i += 1) spawnOne();

    return () => {
      isCancelled = true;
      timeouts.forEach((id) => clearTimeout(id));
      timeouts.clear();
      if (!container) return;
      container.innerHTML = "";
    };
  }, [count]);

  return <div ref={ref} className="mines-embers-adv" />;
}

export default function LabClient() {
  const [showSoon, setShowSoon] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const runtimeTimeoutsRef = useRef<Set<number>>(new Set());
  const lisaCardRef = useRef<HTMLDivElement | null>(null);
  const [email, setEmail] = useState("");
  const [inviteState, setInviteState] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [inviteAnim, setInviteAnim] = useState<"none" | "validating" | "fadeout">("none");


  useEffect(() => {
    const timeoutsSet = runtimeTimeoutsRef.current;
    return () => {
      timeoutsSet.forEach((id) => clearTimeout(id));
      timeoutsSet.clear();
    };
  }, []);

  const closeSoonModal = useCallback(() => {
    if (isClosing) return;
    setIsClosing(true);
    const id = window.setTimeout(() => {
      setShowSoon(false);
      setIsClosing(false);
      const container = lisaCardRef.current;
      if (container) {
        container.classList.remove("no-flip");
      }
      runtimeTimeoutsRef.current.delete(id);
    }, 900);
    runtimeTimeoutsRef.current.add(id);
  }, [isClosing]);

  useEffect(() => {
    if (!showSoon) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        closeSoonModal();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [showSoon, closeSoonModal]);

  const openSoonModal = () => {
    const container = lisaCardRef.current;
    if (container) {
      container.classList.add("no-flip");
    }
    setShowSoon(true);
    
    // Track modal opening event
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'modal_open', {
        event_category: 'engagement',
        event_label: 'lisa_flip_card_back',
        description: 'User opened LiSA app modal from flip card back'
      });
    }
  };

  const handleInviteSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const isValid = /[^\s@]+@[^\s@]+\.[^\s@]+/.test(email);
    if (!email || !isValid) {
      setInviteState("error");
      return;
    }
    setInviteState("loading");
    setInviteAnim("validating");
    try {
      const res = await fetch("https://hey-lisa.com/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) throw new Error("invite_failed");
      const id1 = window.setTimeout(() => {
        setInviteAnim("fadeout");
        runtimeTimeoutsRef.current.delete(id1);
      }, 300);
      runtimeTimeoutsRef.current.add(id1);
      const id2 = window.setTimeout(() => {
        setInviteState("success");
        setInviteAnim("none");
        runtimeTimeoutsRef.current.delete(id2);
        
        // Track successful email submission
        if (typeof window !== 'undefined' && window.gtag) {
          window.gtag('event', 'email_submit_success', {
            event_category: 'conversion',
            event_label: 'lisa_modal_email_collection',
            description: 'User successfully submitted email in LiSA modal'
          });
        }
      }, 800);
      runtimeTimeoutsRef.current.add(id2);
    } catch {
      setInviteState("error");
      setInviteAnim("none");
    }
  };



  return (
    <section className="py-10">
      <div className="flex flex-wrap gap-2 justify-center">
        <div className="flip-card-container accent-orange" style={{ "--hue": 140 } as HueVars}>
          <div className="flip-card">
            <div className="card-front">
              <figure>
                <Image src="/TalesFromTheMines.webp" alt="Tales from the Mines" width={400} height={300} />
              </figure>

              <div className="front-overlay">
                <span className="back-soon">Coming soon</span>
                <div className="front-content">
                  <h2 className="front-title">Tales from the Mines</h2>
                  <p className="front-sub">On-chain archaeology</p>
                  <div className="front-tags">
                    <span className="front-tag">website</span>
                    <span className="front-tag">node</span>
                    <span className="front-tag">research</span>
                  </div>
                </div>
                <MinesEmbers count={9} />
                
              </div>
            </div>

            <div className="card-back">
              <figure>
                <Image src="/TalesFromTheMines.webp" alt="Tales from the Mines" width={400} height={300} />
              </figure>

              <div className="back-overlay">
                <span className="back-soon">Coming soon</span>
                <div className="back-gradient"></div>
                <div className="back-panel">
                  <div className="back-title">Tales from the Mines</div>
                  <div className="back-text">
                    On-chain archaeology for the curious. Dig through old blocks, surface
                    forgotten signals, and publish narrative notes, datasets, and tiny code
                    artifacts.
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>

        <div ref={lisaCardRef} className="flip-card-container" style={{ "--hue": 160 } as HueVars}>
          <div className="flip-card">
            <div className="card-front">
              <figure>
                <Image src="/LisaAppFront.webp" alt="LiSA App" width={400} height={300} />
              </figure>

              <div className="front-overlay">
                <span className="back-soon">Coming soon</span>
                <div className="front-dim"></div>
                <div className="front-gradient"></div>
                <div className="front-content">
                  <h2 className="front-title glitch" data-text="[LiSA]">[LiSA]<span className="blink">_</span></h2>
                  <p className="front-sub">Intelligence for ur wallets</p>
                  <div className="front-tags">
                    <span className="front-tag">$LISA</span>
                    <span className="front-tag">dApp</span>
                    <span className="front-tag">Agent</span>
                  </div>
                </div>
                <span className="front-scanline" />
              </div>
            </div>

            <div className="card-back">
              <figure>
                <Image src="/LisaAppBack.webp" alt="LiSA App" width={400} height={300} />
              </figure>

              <div className="back-overlay">
                <span className="back-soon">Coming soon</span>
                <div className="back-dim"></div>
                <div className="back-gradient"></div>
                <span className="back-scanline" />
                <div className="scanlines" />
                <div className="crt-vignette" />
                <div className="back-panel">
                  <div className="back-title">
                    <span
                      className="type-nocaret glitch"
                      data-text="[LiSA]"
                      style={{ "--n": 6, "--t": "1.8s", "--d": "0s" } as GlitchVars}
                    >
                      [LiSA]
                    </span>
                    <span className="blink">_</span>
                  </div>
                  <div className="back-text">
                    Swaps, bridges, and transfers on any EVM blockchain, from chatting with LiSA. Natural language to complex DCA, invest, and trading strategies enforced on-chain and on Hyperliquid.
                  </div>
                  <div className="back-text token-line">$LISA powers access and incentives.</div>
                  <div style={{ marginTop: 12 }}>
                    <button type="button" className="open-cta" onClick={openSoonModal}>
                      Open app
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flip-card-container" style={{ "--hue": 335 } as HueVars}>
          <div className="flip-card">
            <div className="card-front">
              <figure>
                <Image src="/JensooFront.webp" alt="Jensoo" width={400} height={300} />
              </figure>

              <div className="front-overlay">
                <span className="back-soon">Coming soon</span>
                <div className="front-gradient"></div>
                <div className="front-content">
                  <h2 className="front-title">Jensoo AI</h2>
                  <p className="front-sub">Quorum whispers</p>
                  <div className="front-tags">
                    <span className="front-tag">$LISA</span>
                    <span className="front-tag">Agent</span>
                    <span className="front-tag">dApp</span>
                  </div>
                </div>
                <div className="jensoo-effect">
                  <div className="jensoo-grid"></div>
                  <div className="jensoo-circuit"></div>
                  <div className="jensoo-nodes">
                    <span></span><span></span><span></span><span></span><span></span><span></span>
                    <span></span><span></span><span></span><span></span><span></span><span></span>
                  </div>
                </div>
              </div>
            </div>

            <div className="card-back">
              <figure>
                <Image src="/Jensoo2.webp" alt="Jensoo" width={400} height={300} />
              </figure>

              <div className="back-overlay">
                <span className="back-soon">Coming soon</span>
                <div className="back-gradient"></div>
                <div className="back-panel">
                  <div className="back-title">Jensoo AI</div>
                  <div className="back-text">
                    Pose a query. A quorum of models and research tools convene; two agents
                    orchestrate the debate. The verdict can be sealed, hashed, and pinned
                    to uncensorable storage (e.g., IPFS). Paid in $LISA.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flip-card-container pokpak" style={{ "--hue": 200 } as HueVars}>
          <div className="flip-card">
            <div className="card-front">
              <figure>
                <Image src="/Pokpak.webp" alt="0xPokPak" width={400} height={300} />
              </figure>

              <div className="front-overlay">
                <span className="back-soon">Coming soon</span>
                <div className="front-gradient"></div>
                <div className="front-content">
                  <h2 className="front-title">0xPokPak</h2>
                  <p className="front-sub">Solidity security agent</p>
                  <div className="front-tags">
                    <span className="front-tag">$LISA</span>
                    <span className="front-tag">Agent</span>
                    <span className="front-tag">dApp</span>
                  </div>
                </div>
                <span
                  className="pok-scan"
                  style={{ "--pok-x": "50%" } as PokVars}
                  onAnimationIteration={(e: React.AnimationEvent<HTMLSpanElement>) => {
                    const x = `${Math.floor(Math.random() * 80 + 10)}%`;
                    e.currentTarget.style.setProperty("--pok-x", x);
                    // schedule a bug reveal well before the line
                    const parent = e.currentTarget.parentElement;
                    const bug = parent?.querySelector<HTMLElement>(".pok-bug") ?? null;
                    if (bug) {
                      bug.style.setProperty("--pok-x", x);
                      bug.style.setProperty(
                        "--pok-bug-y",
                        `${Math.floor(Math.random() * 50 + 25)}%`
                      );
                      // show after a short delay, fade out before the line starts
                      const idShow = window.setTimeout(() => {
                        bug.style.opacity = "1";
                        runtimeTimeoutsRef.current.delete(idShow);
                      }, 400); // appear
                      runtimeTimeoutsRef.current.add(idShow);
                      const idHide = window.setTimeout(() => {
                        bug.style.opacity = "0";
                        runtimeTimeoutsRef.current.delete(idHide);
                      }, 1200); // disappear before line
                      runtimeTimeoutsRef.current.add(idHide);
                    }
                  }}
                />
                <span className="pok-bug" style={{ "--pok-x": "50%", "--pok-bug-y": "50%", opacity: 0 } as PokVars} />
              </div>
            </div>

            <div className="card-back">
              <figure>
                <Image src="/Pokpak.webp" alt="0xPokPak" width={400} height={300} />
              </figure>

              <div className="back-overlay">
                <span className="back-soon">Coming soon</span>
                <div className="back-gradient"></div>
                <div className="back-panel">
                  <div className="back-title">0xPokPak</div>
                  <div className="back-text">
                    An audit agent fed with Solidity security lore: known exploits, patterns,
                    and war stories. Run targeted checks, generate diffs, and export findings.
                    Paid in $LISA.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showSoon ? (
        <div
          className={"modal-overlay" + (isClosing ? " closing" : "")}
          role="dialog"
          aria-modal="true"
          onClick={closeSoonModal}
          style={{ "--hue": 160 } as HueVars}
        >
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className="modal-close-x"
              aria-label="Close"
              onClick={(e) => { e.stopPropagation(); closeSoonModal(); }}
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
              Check our <a href="/docs" target="_blank">documentation</a>, <a href="/docs/changelog" target="_blank">changelog</a>, 
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

            <form className={"modal-invite" + (inviteState === "success" ? " is-success" : "")} onSubmit={handleInviteSubmit} noValidate>
              {inviteState !== "success" ? (
                <>
                  <div className={"invite-heading" + (inviteAnim === "fadeout" ? " fade-out" : inviteAnim === "validating" ? " validating" : "") }>&lt;LiSA&gt; drop ur email for dev updates</div>
                  <div className={"invite-wrap" + (inviteAnim === "fadeout" ? " fade-out" : inviteAnim === "validating" ? " validating" : "") }>
                    <span className="input-prefix">&gt;</span>
                    <input
                      type="email"
                      inputMode="email"
                      autoComplete="email"
                      placeholder="email@domain.com"
                      className={"invite-input" + (inviteState === "error" ? " error" : "")}
                      value={email}
                      onChange={(e) => { setEmail(e.target.value); if (inviteState !== "idle") setInviteState("idle"); }}
                    />
                    <button type="submit" className={"invite-cta key-return" + (inviteState === "loading" ? " validating" : inviteState === "error" ? " error" : inviteAnim === "fadeout" ? " fade-out" : "")} aria-label="Submit email" disabled={inviteState === "loading"}>
                      {inviteState === "loading" ? "✔" : "⏎"}
                    </button>
                  </div>
                </>
              ) : (
                <div className="invite-success invite-heading">&lt;LiSA&gt; email noted! i&apos;ll ping u on release. <a href="https://x.com/HeyLisaAi" target="_blank" rel="noreferrer">follow on X</a>? :)</div>
              )}
            </form>




            {/* no bottom actions; close via X, overlay click, or Esc */}
      </div>
    </div>
      ) : null}
    </section>
  );
}


