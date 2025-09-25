import React from "react";
import { Dictionary } from "@/lib/dictionaries";

interface FlipCardProps {
  title: string;
  subtitle: string;
  tags: string[];
  description: string;
  frontImage: string;
  backImage: string;
  tokenLine?: string;
  hasOpenButton?: boolean;
  onOpenClick?: () => void;
  dict: Dictionary;
  cardType?: 'lisa' | 'jensoo' | 'pokpak' | 'tales'; // For color theming
}

export function FlipCard({
  title,
  subtitle,
  tags,
  description,
  frontImage,
  backImage,
  tokenLine,
  hasOpenButton,
  onOpenClick,
  dict,
  cardType = 'lisa',
}: FlipCardProps) {
  
  return (
    <div className={`flip-card-container flip-card-${cardType}`}>
      <div className="flip-card">
        
        {/* FRONT SIDE */}
        <div className="card-front">
          <figure>
            <img src={frontImage} alt={title} />
          </figure>
          <div className="front-gradient"></div>
          <div className="front-dim"></div>
          <div className="front-soon">{dict.lab.coming_soon}</div>
          <div className="front-overlay">
            {cardType === 'lisa' && <span className="front-scanline"></span>}
            {cardType === 'jensoo' && (
              <div className="jensoo-effect">
                <div className="jensoo-grid"></div>
                <div className="jensoo-circuit"></div>
                <div className="jensoo-nodes">
                  <span></span>
                  <span></span>
                  <span></span>
                  <span></span>
                  <span></span>
                  <span></span>
                  <span></span>
                  <span></span>
                  <span></span>
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            )}
            {cardType === 'pokpak' && (
              <div className="quantum-field">
                {/* Digital static background */}
                <div className="digital-static"></div>
                
                {/* Crystalline grid overlay */}
                <div className="crystalline-grid"></div>
                
                {/* Data stream lanes with quantum particles */}
                <div className="data-streams">
                  {/* Lane 1 - Top */}
                  <span className="data-particle" style={{'--size': '2px', '--duration': '5.2s', '--delay': '0s', '--opacity': '.7', '--tunnel': '10s', '--jump': '15px', top: '25%'} as React.CSSProperties}></span>
                  <span className="data-particle" style={{'--size': '3px', '--duration': '4.8s', '--delay': '1.2s', '--opacity': '.8', '--tunnel': '12s', '--jump': '-20px', top: '28%'} as React.CSSProperties}></span>
                  <span className="data-particle" style={{'--size': '2px', '--duration': '5.6s', '--delay': '2.4s', '--opacity': '.6', '--tunnel': '9s', '--jump': '25px', top: '22%'} as React.CSSProperties}></span>
                  
                  {/* Lane 2 - Middle */}
                  <span className="data-particle" style={{'--size': '4px', '--duration': '4.2s', '--delay': '0.8s', '--opacity': '.9', '--tunnel': '11s', '--jump': '-15px', top: '48%'} as React.CSSProperties}></span>
                  <span className="data-particle" style={{'--size': '3px', '--duration': '5.0s', '--delay': '2.0s', '--opacity': '.7', '--tunnel': '8s', '--jump': '18px', top: '52%'} as React.CSSProperties}></span>
                  <span className="data-particle" style={{'--size': '2px', '--duration': '4.6s', '--delay': '3.2s', '--opacity': '.8', '--tunnel': '13s', '--jump': '-25px', top: '45%'} as React.CSSProperties}></span>
                  
                  {/* Lane 3 - Bottom */}
                  <span className="data-particle" style={{'--size': '3px', '--duration': '5.4s', '--delay': '0.4s', '--opacity': '.8', '--tunnel': '10s', '--jump': '20px', top: '72%'} as React.CSSProperties}></span>
                  <span className="data-particle" style={{'--size': '2px', '--duration': '4.4s', '--delay': '1.6s', '--opacity': '.6', '--tunnel': '14s', '--jump': '-18px', top: '68%'} as React.CSSProperties}></span>
                  <span className="data-particle" style={{'--size': '4px', '--duration': '4.8s', '--delay': '2.8s', '--opacity': '.9', '--tunnel': '7s', '--jump': '12px', top: '75%'} as React.CSSProperties}></span>
                  
                  {/* Deep lane particles */}
                  <span className="data-particle" style={{'--size': '1px', '--duration': '6.2s', '--delay': '1.0s', '--opacity': '.5', '--tunnel': '15s', '--jump': '30px', top: '35%'} as React.CSSProperties}></span>
                  <span className="data-particle" style={{'--size': '5px', '--duration': '3.8s', '--delay': '2.6s', '--opacity': '.85', '--tunnel': '9s', '--jump': '-22px', top: '58%'} as React.CSSProperties}></span>
                </div>
                
                {/* Electromagnetic pulse waves */}
                <div className="em-pulses">
                  <div className="em-pulse" style={{'--pulse-duration': '8s', '--pulse-delay': '0s', '--pulse-x': '25%', '--pulse-y': '30%'} as React.CSSProperties}></div>
                  <div className="em-pulse" style={{'--pulse-duration': '10s', '--pulse-delay': '3s', '--pulse-x': '75%', '--pulse-y': '60%'} as React.CSSProperties}></div>
                  <div className="em-pulse" style={{'--pulse-duration': '7s', '--pulse-delay': '6s', '--pulse-x': '45%', '--pulse-y': '80%'} as React.CSSProperties}></div>
                  <div className="em-pulse" style={{'--pulse-duration': '12s', '--pulse-delay': '2s', '--pulse-x': '65%', '--pulse-y': '20%'} as React.CSSProperties}></div>
                </div>
          </div>
            )}
            {cardType === 'tales' && (
              <>
                <div className="mines-embers-container">
                  {/* CSS-only continuous ember stream - 15 particles with staggered timing */}
                  
                  {/* Wave 1 - Start immediately */}
                  <span className="mines-ember" style={{'--dur': '4.2s', '--delay': '0s', '--rise': '145%', '--drift': '12px', '--size': '3px', left: '22%'} as React.CSSProperties}></span>
                  <span className="mines-ember" style={{'--dur': '3.8s', '--delay': '0.3s', '--rise': '155%', '--drift': '-8px', '--size': '4px', left: '68%'} as React.CSSProperties}></span>
                  <span className="mines-ember" style={{'--dur': '4.6s', '--delay': '0.7s', '--rise': '140%', '--drift': '18px', '--size': '2px', left: '45%'} as React.CSSProperties}></span>
                  
                  {/* Wave 2 - Offset timing for continuous flow */}
                  <span className="mines-ember" style={{'--dur': '3.4s', '--delay': '1.0s', '--rise': '165%', '--drift': '-15px', '--size': '5px', left: '18%'} as React.CSSProperties}></span>
                  <span className="mines-ember" style={{'--dur': '4.0s', '--delay': '1.4s', '--rise': '150%', '--drift': '5px', '--size': '3px', left: '78%'} as React.CSSProperties}></span>
                  <span className="mines-ember" style={{'--dur': '3.6s', '--delay': '1.8s', '--rise': '135%', '--drift': '-22px', '--size': '4px', left: '35%'} as React.CSSProperties}></span>
                  
                  {/* Wave 3 - Mid-cycle timing */}
                  <span className="mines-ember" style={{'--dur': '4.4s', '--delay': '2.1s', '--rise': '160%', '--drift': '25px', '--size': '2px', left: '58%'} as React.CSSProperties}></span>
                  <span className="mines-ember" style={{'--dur': '3.2s', '--delay': '2.5s', '--rise': '142%', '--drift': '-10px', '--size': '6px', left: '28%'} as React.CSSProperties}></span>
                  <span className="mines-ember" style={{'--dur': '4.8s', '--delay': '2.9s', '--rise': '170%', '--drift': '14px', '--size': '3px', left: '85%'} as React.CSSProperties}></span>
                  
                  {/* Wave 4 - Later timing for overlap */}
                  <span className="mines-ember" style={{'--dur': '3.7s', '--delay': '3.2s', '--rise': '148%', '--drift': '-18px', '--size': '4px', left: '48%'} as React.CSSProperties}></span>
                  <span className="mines-ember" style={{'--dur': '4.1s', '--delay': '3.6s', '--rise': '152%', '--drift': '8px', '--size': '5px', left: '15%'} as React.CSSProperties}></span>
                  <span className="mines-ember" style={{'--dur': '3.5s', '--delay': '4.0s', '--rise': '138%', '--drift': '-25px', '--size': '2px', left: '72%'} as React.CSSProperties}></span>
                  
                  {/* Wave 5 - Complete the cycle */}
                  <span className="mines-ember" style={{'--dur': '4.3s', '--delay': '4.3s', '--rise': '162%', '--drift': '20px', '--size': '3px', left: '38%'} as React.CSSProperties}></span>
                  <span className="mines-ember" style={{'--dur': '3.9s', '--delay': '4.7s', '--rise': '145%', '--drift': '-12px', '--size': '4px', left: '65%'} as React.CSSProperties}></span>
                  <span className="mines-ember" style={{'--dur': '4.5s', '--delay': '5.1s', '--rise': '155%', '--drift': '15px', '--size': '5px', left: '25%'} as React.CSSProperties}></span>
            </div>
              </>
            )}
            <div className="front-content">
              <h2 className={`front-title ${cardType === 'lisa' ? 'glitch' : ''}`} 
                  data-text={cardType === 'lisa' ? title : undefined}>
                {title}
                {cardType === 'lisa' && <span className="cursor blink">_</span>}
              </h2>
              <p className="front-sub">{subtitle}</p>
              <div className="front-tags">
              {tags.map((tag, index) => (
                  <span key={index} className="front-tag">{tag}</span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* BACK SIDE */}  
        <div className="card-back">
          <figure>
            <img src={backImage} alt={title} />
          </figure>
          <div className="back-gradient"></div>
          <div className="back-dim"></div>
          <div className="back-soon">{dict.lab.coming_soon}</div>
          {cardType === 'lisa' && <span className="back-scanline"></span>}
          <div className="back-overlay">
            <div className="back-panel">
              <div className={`back-title ${cardType === 'lisa' ? 'glitch' : ''}`}
                   data-text={cardType === 'lisa' ? title : undefined}>
                {title}
                {cardType === 'lisa' && <span className="cursor blink">_</span>}
              </div>
              <div className="back-text">{description}</div>
              {tokenLine && <div className="token-line">{tokenLine}</div>}
            {hasOpenButton && onOpenClick && (
                <button className="btn-content" onClick={onOpenClick} style={{marginTop: '16px', alignSelf: 'center'}}>
                  {dict.lab.open_app}
              </button>
            )}
            </div>
          </div>
        </div>
        
      </div>
    </div>
  );
}
