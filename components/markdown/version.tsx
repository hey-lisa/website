// components/markdown/version.tsx
interface VersionProps {
  version: string;
  title: string;
  status?: string;
  children: React.ReactNode;
}

export default function Version({ version, title, status, children }: VersionProps) {
  const showChip = !!status && status !== "planned";
  const statusClass = status ? ` rm-status-${status}` : "";

  return (
    <div className={`version-block${statusClass}`}>
      <div className="version-head">
        <span className="version-num">{version}</span>
        <span className="version-title">
          {title}
          {showChip ? (
            <span className="rm-status-chip" aria-hidden>
              {status}
            </span>
          ) : null}
        </span>
      </div>
      <div className="version-body">{children}</div>
    </div>
  );
}

