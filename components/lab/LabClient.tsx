"use client";
import React, { useEffect, useRef, useState, useCallback } from "react";
import { useTimeouts } from "./useTimeouts";
import { FlipCard } from "./FlipCard";
import { LiSAModal } from "./LiSAModal";
import { MinesEmbers } from "./MinesEmbers";
import { PokPakAnimation } from "./PokPakAnimation";

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


export default function LabClient() {
  const [showSoon, setShowSoon] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const { addTimeout } = useTimeouts();
  const lisaCardRef = useRef<HTMLDivElement | null>(null);
  const [email, setEmail] = useState("");
  const [inviteState, setInviteState] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [inviteAnim, setInviteAnim] = useState<"none" | "validating" | "fadeout">("none");

  const closeSoonModal = useCallback(() => {
    if (isClosing) return;
    setIsClosing(true);
    addTimeout(() => {
      setShowSoon(false);
      setIsClosing(false);
      const container = lisaCardRef.current;
      if (container) {
        container.classList.remove("no-flip");
      }
    }, 900);
  }, [isClosing, addTimeout]);

  useEffect(() => {
    if (!showSoon) {
      // Re-enable body scroll when modal is closed
      document.body.style.overflow = '';
      return;
    }
    
    // Prevent body scroll when modal is open
    document.body.style.overflow = 'hidden';
    
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        closeSoonModal();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      // Re-enable body scroll when component unmounts
      document.body.style.overflow = '';
    };
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

  const handleInviteSubmit = useCallback(async (e: React.FormEvent<HTMLFormElement>) => {
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
      addTimeout(() => {
        setInviteAnim("fadeout");
      }, 300);
      addTimeout(() => {
        setInviteState("success");
        setInviteAnim("none");
        
        // Track successful email submission
        if (typeof window !== 'undefined' && window.gtag) {
          window.gtag('event', 'email_submit_success', {
            event_category: 'conversion',
            event_label: 'lisa_modal_email_collection',
            description: 'User successfully submitted email in LiSA modal'
          });
        }
      }, 800);
    } catch {
      setInviteState("error");
      setInviteAnim("none");
    }
  }, [email, addTimeout]);



  return (
    <section className="py-10">
      <div className="flex flex-wrap gap-2 justify-center">
        <FlipCard
          hue={140}
          className="accent-orange"
          frontImage="/TalesFromTheMines.webp"
          backImage="/TalesFromTheMines.webp"
          title="Tales from the Mines"
          subtitle="On-chain archaeology"
          tags={["website", "node", "research"]}
          backDescription="On-chain archaeology for the curious. Dig through old blocks, surface forgotten signals, and publish narrative notes, datasets, and tiny code artifacts."
          specialEffects={<MinesEmbers count={9} />}
          backSpecialContent={<div className="back-gradient"></div>}
        />

        <FlipCard
          hue={160}
          frontImage="/LisaAppFront.webp"
          backImage="/LisaAppBack.webp"
          title="[LiSA]"
          subtitle="Intelligence for ur wallets"
          tags={["$LISA", "dApp", "Agent"]}
          backDescription="Swaps, bridges, and transfers on any EVM blockchain, from chatting with LiSA. Natural language to complex DCA, invest, and trading strategies enforced on-chain and on Hyperliquid."
          cardRef={lisaCardRef}
          hasGlitchTitle={true}
          hasTokenLine={true}
          tokenLineText="$LISA powers access and incentives."
          hasOpenButton={true}
          onOpenClick={openSoonModal}
          specialEffects={
            <>
                <div className="front-dim"></div>
                <div className="front-gradient"></div>
                <span className="front-scanline" />
            </>
          }
          backSpecialContent={
            <>
                <div className="back-dim"></div>
                <div className="back-gradient"></div>
                <span className="back-scanline" />
                <div className="scanlines" />
                <div className="crt-vignette" />
            </>
          }
        />

        <FlipCard
          hue={335}
          frontImage="/JensooFront.webp"
          backImage="/Jensoo2.webp"
          title="Jensoo AI"
          subtitle="Quorum whispers"
          tags={["$LISA", "Agent", "dApp"]}
          backDescription="Pose a query. A quorum of models and research tools convene; two agents orchestrate the debate. The verdict can be sealed, hashed, and pinned to uncensorable storage (e.g., IPFS). Paid in $LISA."
          specialEffects={
            <>
                <div className="front-gradient"></div>
                <div className="jensoo-effect">
                  <div className="jensoo-grid"></div>
                  <div className="jensoo-circuit"></div>
                  <div className="jensoo-nodes">
                    <span></span><span></span><span></span><span></span><span></span><span></span>
                    <span></span><span></span><span></span><span></span><span></span><span></span>
                  </div>
                </div>
            </>
          }
          backSpecialContent={<div className="back-gradient"></div>}
        />

        <FlipCard
          hue={200}
          className="pokpak"
          frontImage="/Pokpak.webp"
          backImage="/Pokpak.webp"
          title="0xPokPak"
          subtitle="Solidity security agent"
          tags={["$LISA", "Agent", "dApp"]}
          backDescription="An audit agent fed with Solidity security lore: known exploits, patterns, and war stories. Run targeted checks, generate diffs, and export findings. Paid in $LISA."
          specialEffects={
            <>
                <div className="front-gradient"></div>
              <PokPakAnimation addTimeout={addTimeout} />
            </>
          }
          backSpecialContent={<div className="back-gradient"></div>}
        />
      </div>

      <LiSAModal
        isOpen={showSoon}
        isClosing={isClosing}
        onClose={closeSoonModal}
        email={email}
        setEmail={setEmail}
        inviteState={inviteState}
        setInviteState={setInviteState}
        inviteAnim={inviteAnim}
        onSubmit={handleInviteSubmit}
      />
    </section>
  );
}


