import Image from "next/image";

export default function NotFound() {
  return (
    <div className="min-h-[87vh] flex flex-col items-center justify-center gap-8 px-4">
      
      {/* Banner Image */}
      <div className="w-full max-w-4xl">
        <Image
          src="/404.webp"
          alt="404"
          width={1200}
          height={600}
          className="w-full h-auto"
          priority
        />
      </div>

      {/* Glitchy 404 */}
      <div className="error-404-container">
        <h1 className="error-404">
          404
        </h1>
      </div>

    </div>
  );
}
