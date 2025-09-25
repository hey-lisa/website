import React, { useState } from "react";
import { Dictionary } from "@/lib/dictionaries";
import LocalizedLink from "@/components/localized-link";
import { page_routes } from "@/lib/routes-config";

interface LiSAModalProps {
  isOpen: boolean;
  onClose: () => void;
  email: string;
  setEmail: (email: string) => void;
  inviteState: "idle" | "loading" | "success" | "error";
  setInviteState: (state: "idle" | "loading" | "success" | "error") => void;
  inviteAnim: "none" | "validating" | "fadeout";
  isRateLimited: boolean;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  dict: Dictionary;
}

export function LiSAModal({
  isOpen,
  onClose,
  email,
  setEmail,
  inviteState,
  setInviteState,
  inviteAnim,
  isRateLimited,
  onSubmit,
  dict,
}: LiSAModalProps) {
  const [isClosing, setIsClosing] = useState(false);

  const handleClose = () => {
    setIsClosing(true);
    // Wait for CRT closing animation to complete before actually closing
    setTimeout(() => {
      setIsClosing(false);
      onClose();
    }, 400); // Match animation duration
  };

  // Prevent body scrolling when modal is open
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      document.body.style.paddingRight = '0px'; // Prevent layout shift
    } else {
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
    }

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div 
      className="modal-overlay"
      onClick={handleClose}
    >
      <div 
        className={`modal-card${isClosing ? ' closing' : ''}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button 
          onClick={handleClose}
          className="modal-close-x"
        >
          {dict.lab.close}
        </button>

        {/* Header */}
        <div>
          <h2 className="modal-title glitch" data-text={dict.lab.modal.title}>
            {dict.lab.modal.title}
            <span className="cursor blink">_</span>
          </h2>
          <p className="modal-text">{dict.lab.modal.subtitle}</p>
        </div>

          {/* Description */}
          <div className="modal-paragraph">
            {dict.lab.modal.description.split('documentation').map((part, i, arr) => 
              i === arr.length - 1 ? part : (
                <React.Fragment key={i}>
                  {part}
                  <LocalizedLink href={`/docs${page_routes[0].href}`} className="text-primary hover:underline">
                    documentation
                  </LocalizedLink>
                  {part === '' && i === 0 ? ', ' : ''}
                  {part !== '' && part.endsWith(' ') ? '' : ' '}
                </React.Fragment>
              )
            ).map((part, i) => {
              if (typeof part === 'string' && part.includes('changelog')) {
                return part.split('changelog').map((subPart, j, subArr) =>
                  j === subArr.length - 1 ? subPart : (
                    <React.Fragment key={`${i}-${j}`}>
                      {subPart}
                      <LocalizedLink href="/docs/project-updates/changelog/lisa" className="text-primary hover:underline">
                        changelog
                      </LocalizedLink>
                    </React.Fragment>
                  )
                );
              }
              if (typeof part === 'string' && part.includes('roadmap')) {
                return part.split('roadmap').map((subPart, j, subArr) =>
                  j === subArr.length - 1 ? subPart : (
                    <React.Fragment key={`${i}-${j}`}>
                      {subPart}
                      <LocalizedLink href="/docs/project-updates/roadmap" className="text-primary hover:underline">
                        roadmap
                      </LocalizedLink>
                    </React.Fragment>
                  )
                );
              }
              return part;
            })}
          </div>

          {/* Features Grid */}
          <div className="spec-grid">
            {Object.entries(dict.lab.modal.features).map(([key, feature]) => (
              <div key={key} className="spec-item">
                <h4 className="spec-key">{feature.title}</h4>
                <p className="spec-desc">{feature.description}</p>
              </div>
            ))}
          </div>

          {/* Email Form */}
          <div className="modal-invite">
            <form onSubmit={onSubmit}>
              {inviteState !== "success" ? (
                <div>
                  <div className="invite-heading">
                    {dict.lab.modal.form.prompt}
                  </div>
                  <div className="invite-wrap">
                    <span className="input-prefix">&gt;</span>
                    <input
                      type="email"
                      placeholder={dict.lab.modal.form.placeholder}
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (inviteState !== "idle") setInviteState("idle");
                      }}
                      className="invite-input"
                      disabled={inviteState === "loading"}
                    />
                    <button 
                      type="submit" 
                      disabled={inviteState === "loading" || isRateLimited}
                      className={`invite-cta ${inviteAnim === "validating" ? "validating" : ""} ${inviteAnim === "fadeout" ? "fadeout" : ""} ${isRateLimited ? "rate-limited" : ""}`}
                    >
                      {inviteState === "loading" ? "✔" : "⏎"}
                    </button>
                  </div>
                  {inviteState === "error" && (
                    <div style={{color: '#ef4444', fontSize: '13px', textAlign: 'center', marginTop: '8px'}}>
                      {isRateLimited ? dict.lab.modal.form.rate_limited : dict.lab.modal.form.error}
                    </div>
                  )}
                </div>
              ) : (
                <div className="invite-success">
                  {dict.lab.modal.form.success.split('follow on X').map((part, i, arr) => 
                    i === arr.length - 1 ? part : (
                      <React.Fragment key={i}>
                        {part}
                        <a 
                          href="https://x.com/HeyLisaAi" 
                          target="_blank" 
                          rel="noopener noreferrer"
                        >
                          follow on X
                        </a>
                      </React.Fragment>
                    )
                  )}
                </div>
              )}
            </form>
          </div>
      </div>
    </div>
  );
}



