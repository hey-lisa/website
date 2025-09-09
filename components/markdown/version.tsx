import React, { PropsWithChildren, isValidElement, Children, cloneElement } from "react";

type Status =
  | "planned"
  | "in-progress"
  | "done"
  | "blocked"
  | "research"
  | "backlog"
  | "critical";

export type VersionProps = PropsWithChildren<{
  version: string;
  title: string;
  date?: string; // not rendered
  status?: Status;
}>;

type Section = "added" | "changed" | "fixed" | null;

function isElementOfType(node: React.ReactNode, tag: string) {
  return isValidElement(node) && (node.type as string) === tag;
}

function transformChildrenWithSections(nodes: React.ReactNode): React.ReactNode {
  const arr = Children.toArray(nodes);
  const out: React.ReactNode[] = [];
  let keySeq = 0;
  const nextKey = () => `vk-${keySeq++}`;
  const push = (n: React.ReactNode) => {
    if (isValidElement(n)) out.push(cloneElement(n as React.ReactElement, { key: nextKey() }));
    else out.push(<React.Fragment key={nextKey()}>{n}</React.Fragment>);
  };

  for (const node of arr) {
    if (isElementOfType(node, "added") || isElementOfType(node, "changed") || isElementOfType(node, "fixed")) {
      const el = node as React.ReactElement;
      const tag = (el.type as string) as Exclude<Section, null>;
      // Render ULs inside with category class; if none, render children as-is
      const inner = Children.toArray((el.props as { children: React.ReactNode }).children);
      let foundUl = false;
      inner.forEach((child) => {
        if (isValidElement(child) && (child as React.ReactElement).type === 'ul') {
          foundUl = true;
          const prev = (child.props as { className?: string }).className || "";
          out.push(cloneElement(child as React.ReactElement<{ className?: string }>, { className: `chg-list cat-${tag} ${prev}`.trim(), key: nextKey() }, ((child as React.ReactElement).props as { children: React.ReactNode }).children));
        }
      });
      if (!foundUl) {
        inner.forEach((c) => push(c));
      }
      continue;
    }

    if (isValidElement(node)) {
      const el = node as React.ReactElement;
      if (el.props && (el.props as { children?: React.ReactNode }).children) {
        const transformed = transformChildrenWithSections((el.props as { children: React.ReactNode }).children);
        out.push(cloneElement(el, { key: nextKey() }, transformed));
      } else {
        out.push(cloneElement(el, { key: nextKey() }));
      }
      continue;
    }
    push(node);
  }
  return out;
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
      <div className="version-body">{transformChildrenWithSections(children)}</div>
    </div>
  );
}
