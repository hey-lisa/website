import React from "react";
import Image from "next/image";

type HueVars = React.CSSProperties & { "--hue"?: number | string };
type GlitchVars = React.CSSProperties & {
  "--n"?: number | string;
  "--t"?: string;
  "--d"?: string;
};

interface FlipCardProps {
  hue: number;
  className?: string;
  frontImage: string;
  backImage: string;
  title: string;
  subtitle: string;
  tags: string[];
  backDescription: string;
  specialEffects?: React.ReactNode;
  backSpecialContent?: React.ReactNode;
  cardRef?: React.RefObject<HTMLDivElement | null>;
  isComingSoon?: boolean;
  // LiSA-specific props
  hasGlitchTitle?: boolean;
  hasTokenLine?: boolean;
  tokenLineText?: string;
  hasOpenButton?: boolean;
  onOpenClick?: () => void;
}

export function FlipCard({
  hue,
  className = "",
  frontImage,
  backImage,
  title,
  subtitle,
  tags,
  backDescription,
  specialEffects,
  backSpecialContent,
  cardRef,
  isComingSoon = true,
  hasGlitchTitle = false,
  hasTokenLine = false,
  tokenLineText = "",
  hasOpenButton = false,
  onOpenClick
}: FlipCardProps) {
  return (
    <div 
      ref={cardRef}
      className={`flip-card-container${className ? ` ${className}` : ""}`}
      style={{ "--hue": hue } as HueVars}
    >
      <div className="flip-card">
        <div className="card-front">
          <figure>
            <Image src={frontImage} alt={title} width={400} height={300} />
          </figure>

          <div className="front-overlay">
            {isComingSoon && <span className="back-soon">Coming soon</span>}
            <div className="front-content">
              <h2 className={`front-title${hasGlitchTitle ? " glitch" : ""}`} 
                  {...(hasGlitchTitle && { "data-text": title })}>
                {title}
                {hasGlitchTitle && <span className="blink">_</span>}
              </h2>
              <p className="front-sub">{subtitle}</p>
              <div className="front-tags">
                {tags.map((tag, index) => (
                  <span key={index} className="front-tag">{tag}</span>
                ))}
              </div>
            </div>
            {specialEffects}
          </div>
        </div>

        <div className="card-back">
          <figure>
            <Image src={backImage} alt={title} width={400} height={300} />
          </figure>

          <div className="back-overlay">
            {isComingSoon && <span className="back-soon">Coming soon</span>}
            <div className="back-panel">
              <div className="back-title">
                {hasGlitchTitle ? (
                  <>
                    <span
                      className="type-nocaret glitch"
                      data-text={title}
                      style={{ "--n": 6, "--t": "1.8s", "--d": "0s" } as GlitchVars}
                    >
                      {title}
                    </span>
                    <span className="blink">_</span>
                  </>
                ) : (
                  title
                )}
              </div>
              <div className="back-text">{backDescription}</div>
              {hasTokenLine && (
                <div className="back-text token-line">{tokenLineText}</div>
              )}
              {hasOpenButton && onOpenClick && (
                <div style={{ marginTop: 12 }}>
                  <button type="button" className="open-cta" onClick={onOpenClick}>
                    Open app
                  </button>
                </div>
              )}
            </div>
            {backSpecialContent}
          </div>
        </div>
      </div>
    </div>
  );
}
