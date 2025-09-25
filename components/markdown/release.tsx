// components/markdown/release.tsx
interface ReleaseProps {
  label: string;
  date: string;
  title: string;
  children: React.ReactNode;
}

export default function Release({ label, date, title, children }: ReleaseProps) {
  return (
    <div className="release-block">
      <div className="release-header">
        <span className="release-label-square">{label}</span>
        <span className="release-title">{title}</span>
        <span className="release-date-paren">({date})</span>
      </div>
      <div className="release-body">{children}</div>
    </div>
  );
}
