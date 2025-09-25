"use client";

import { useDictionary } from "@/components/contexts/dictionary-provider";
import Link from "next/link";

export default function NotFound() {
  const dict = useDictionary();
  
  // Get current language from URL
  const currentPath = typeof window !== 'undefined' ? window.location.pathname : '';
  const lang = currentPath.startsWith('/fr') ? 'fr' : 'en';

  return (
    <div className="error-404-container">
      {/* 404 Image with Overlay */}
      <div className="error-404-image-wrapper">
        <img
          src="/404.webp"
          alt="404 - Page Not Found"
          className="error-404-image"
        />
        
        {/* Digital Particles */}
        <div className="digital-particles">
          <span className="particle particle-1"></span>
          <span className="particle particle-2"></span>
          <span className="particle particle-3"></span>
          <span className="particle particle-4"></span>
          <span className="particle particle-5"></span>
          <span className="particle particle-6"></span>
          <span className="particle particle-7"></span>
          <span className="particle particle-8"></span>
          <span className="particle particle-9"></span>
          <span className="particle particle-10"></span>
          <span className="particle particle-11"></span>
          <span className="particle particle-12"></span>
        </div>
        
        {/* 404 Overlay - Centered on Image */}
        <div className="error-404-container-overlay">
          <h1 className="error-404-overlay">
            404
          </h1>
        </div>
      </div>
      
      {/* Home Button */}
      <Link href={`/${lang}`} className="btn-content">
        {dict?.not_found?.back_to_homepage || (lang === 'fr' ? 'Retour à la page d\'accueil' : 'Back to homepage')}
      </Link>
    </div>
  );
}
