import Image from "next/image";

export default function NotFound() {
  return (
    <div className="flex items-center justify-center px-0 md:px-4 py-10">
      
      {/* Image with overlaid 404 */}
      <div className="relative w-full max-w-none md:max-w-4xl overflow-hidden">
        <Image
          src="/404.webp"
          alt="404"
          width={1200}
          height={600}
          className="w-full h-auto"
          priority
        />
        
        {/* Overlaid Glitchy 404 */}
        <div className="error-404-container-overlay">
          <h1 className="error-404-overlay">
            404
          </h1>
          
          {/* Digital particles */}
          <div className="digital-particles">
            <span className="particle particle-1"></span>
            <span className="particle particle-2"></span>
            <span className="particle particle-3"></span>
            <span className="particle particle-4"></span>
            <span className="particle particle-5"></span>
            <span className="particle particle-6"></span>
            {/* Added more particles for denser field */}
            <span className="particle particle-7"></span>
            <span className="particle particle-8"></span>
            <span className="particle particle-9"></span>
            <span className="particle particle-10"></span>
            <span className="particle particle-11"></span>
            <span className="particle particle-12"></span>
          </div>
        </div>
      </div>

    </div>
  );
}
