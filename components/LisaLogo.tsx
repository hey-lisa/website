export default function LisaLogo({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-center font-bold tracking-wide ${className}`}>
      <span className="lisa-accent glow-accent transition-colors group-hover:lisa-primary">[</span>
      <span className="mx-1 lisa-primary glow-green">LiSA</span>
      <span className="lisa-accent glow-accent transition-colors group-hover:lisa-primary">]</span>
      <span className="ml-1 lisa-primary blink">_</span>
    </span>
  );
}



