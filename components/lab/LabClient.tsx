"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import { FlipCard } from "./FlipCard";
import { LiSAModal } from "./LiSAModal";
import { Dictionary } from "@/lib/dictionaries";

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

interface LabClientProps {
  dict: Dictionary;
}

export default function LabClient({ dict }: LabClientProps) {
  const [showModal, setShowModal] = useState(false);
  const [email, setEmail] = useState("");
  const [inviteState, setInviteState] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [inviteAnim, setInviteAnim] = useState<"none" | "validating" | "fadeout">("none");
  const [isRateLimited, setIsRateLimited] = useState(false);
  
  // Timeout cleanup ref
  const timeoutRefs = useRef<NodeJS.Timeout[]>([]);
  
  // Rate limiting constants
  const RATE_LIMIT_DELAY = 10000; // 10 seconds between submissions
  
  // Clean timeout helper
  const addTimeout = (callback: () => void, delay: number) => {
    const timeout = setTimeout(callback, delay);
    timeoutRefs.current.push(timeout);
    return timeout;
  };

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      timeoutRefs.current.forEach(clearTimeout);
    };
  }, []);

  // PERSISTENCE LOGIC
  useEffect(() => {
    try {
      const saved = typeof window !== "undefined" ? window.localStorage.getItem("lisa_email") : null;
      if (saved && typeof saved === "string") {
        setEmail(saved);
      }
      const subscribed = typeof window !== "undefined" ? window.localStorage.getItem("lisa_email_subscribed") : null;
      if (subscribed === "1") {
        setInviteState("success");
        setInviteAnim("none");
      }
      
      // Check if user is currently rate limited
      const lastSubmission = typeof window !== "undefined" ? window.localStorage.getItem("lisa_last_submission") : null;
      if (lastSubmission) {
        const timeSinceLastSubmission = Date.now() - parseInt(lastSubmission);
        if (timeSinceLastSubmission < RATE_LIMIT_DELAY) {
          setIsRateLimited(true);
          // Set timeout to clear rate limit when time expires
          addTimeout(() => {
            setIsRateLimited(false);
          }, RATE_LIMIT_DELAY - timeSinceLastSubmission);
        }
      }
    } catch (error) {
      console.warn("Failed to load from localStorage:", error);
    }
  }, []);

  // Persist email on changes
  useEffect(() => {
    try {
      if (typeof window === "undefined") return;
      if (email && email.trim().length > 0) {
        window.localStorage.setItem("lisa_email", email.trim());
      } else {
        window.localStorage.removeItem("lisa_email");
      }
    } catch (error) {
      console.warn("Failed to save email to localStorage:", error);
    }
  }, [email]);

  const handleSubmit = useCallback(async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Rate limiting check
    if (isRateLimited) {
      setInviteState("error");
      return;
    }
    
    // Client-side validation
    const isValid = /[^\s@]+@[^\s@]+\.[^\s@]+/.test(email);
    if (!email || !isValid) {
      setInviteState("error");
      return;
    }
    
    // Set rate limit immediately to prevent spam
    setIsRateLimited(true);
    try {
      if (typeof window !== "undefined") {
        window.localStorage.setItem("lisa_last_submission", Date.now().toString());
      }
    } catch (error) {
      console.warn("Failed to save rate limit timestamp:", error);
    }
    
    // Set timeout to clear rate limit
    addTimeout(() => {
      setIsRateLimited(false);
    }, RATE_LIMIT_DELAY);
    
    // Start loading with animation
    setInviteState("loading");
    setInviteAnim("validating");
    
    try {
      // API call to external backend
      const res = await fetch("https://hey-lisa.com/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });
      
      if (!res.ok) throw new Error("invite_failed");
      
      // Success animation sequence
      addTimeout(() => {
        setInviteAnim("fadeout");
      }, 300);
      
      addTimeout(() => {
        setInviteState("success");
        setInviteAnim("none");
        
        // Analytics tracking for conversion measurement
        if (typeof window !== 'undefined' && window.gtag) {
          window.gtag('event', 'email_submit_success', {
            event_category: 'conversion',
            event_label: 'lisa_modal_email_collection',
            description: 'User successfully submitted email in LiSA modal'
          });
        }
      }, 800);
      
      // Persist success state
      try {
        if (typeof window !== "undefined") {
          window.localStorage.setItem("lisa_email_subscribed", "1");
          window.localStorage.setItem("lisa_email", email.trim());
        }
      } catch (error) {
        console.warn("Failed to save subscription state:", error);
      }
      
    } catch (error) {
      setInviteState("error");
      setInviteAnim("none");
    }
  }, [email, addTimeout, isRateLimited]);

  return (
    <div className="container mx-auto px-1 sm:px-2 md:px-4 py-8">
      <section>
        <div className="flip-cards-container">
          
          {/* Card 1: Tales from the Mines */}
          <FlipCard
            title={dict.lab.projects.tales_from_mines.title}
            subtitle={dict.lab.projects.tales_from_mines.subtitle}
            tags={dict.lab.projects.tales_from_mines.tags}
            description={dict.lab.projects.tales_from_mines.description}
            frontImage="/TalesFromTheMines.webp"
            backImage="/TalesFromTheMines.webp"
            cardType="tales"
            dict={dict}
          />

          {/* Card 2: LiSA */}
          <FlipCard
            title={dict.lab.projects.lisa.title}
            subtitle={dict.lab.projects.lisa.subtitle}
            tags={dict.lab.projects.lisa.tags}
            description={dict.lab.projects.lisa.description}
            frontImage="/LisaAppFront.webp"
            backImage="/LisaAppBack.webp"
            tokenLine={dict.lab.projects.lisa.token_line}
            hasOpenButton={true}
            onOpenClick={() => {
              setShowModal(true);
              
              // Track modal opening event
              if (typeof window !== 'undefined' && window.gtag) {
                window.gtag('event', 'modal_open', {
                  event_category: 'engagement',
                  event_label: 'lisa_flip_card_back',
                  description: 'User opened LiSA app modal from flip card back'
                });
              }
            }}
            cardType="lisa"
            dict={dict}
          />

          {/* Card 3: Jensoo AI */}
          <FlipCard
            title={dict.lab.projects.jensoo.title}
            subtitle={dict.lab.projects.jensoo.subtitle}
            tags={dict.lab.projects.jensoo.tags}
            description={dict.lab.projects.jensoo.description}
            frontImage="/JensooFront.webp"
            backImage="/Jensoo2.webp"
            cardType="jensoo"
            dict={dict}
          />

          {/* Card 4: 0xPokPak */}
          <FlipCard
            title={dict.lab.projects.pokpak.title}
            subtitle={dict.lab.projects.pokpak.subtitle}
            tags={dict.lab.projects.pokpak.tags}
            description={dict.lab.projects.pokpak.description}
            frontImage="/Pokpak.webp"
            backImage="/Pokpak.webp"
            cardType="pokpak"
            dict={dict}
          />
          
        </div>
      </section>

      <LiSAModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        email={email}
        setEmail={setEmail}
        inviteState={inviteState}
        setInviteState={setInviteState}
        inviteAnim={inviteAnim}
        isRateLimited={isRateLimited}
        onSubmit={handleSubmit}
        dict={dict}
      />
    </div>
  );
}
