// components/markdown/fixed.tsx
interface FixedProps {
  children: React.ReactNode;
}

export default function Fixed({ children }: FixedProps) {
  return (
    <div className="chg-list cat-fixed">
      {children}
    </div>
  );
}

