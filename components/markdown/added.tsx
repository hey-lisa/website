// components/markdown/added.tsx
interface AddedProps {
  children: React.ReactNode;
}

export default function Added({ children }: AddedProps) {
  return (
    <div className="chg-list cat-added">
      {children}
    </div>
  );
}
