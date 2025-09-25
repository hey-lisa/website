import { Dictionary } from "@/lib/dictionaries";
import LocalizedLink from "./localized-link";

interface DocsNoticeProps {
  dict: Dictionary;
}

export default function DocsNotice({ dict }: DocsNoticeProps) {
  const content = dict.docs.notice.content;
  
  // Split the content to insert links at appropriate places
  const parts = content.split(/(changelog|roadmap)/gi);
  
  return (
    <div className="chg-notice">
      <h3 className="font-medium mb-2">
        {dict.docs.notice.title}
      </h3>
      <p className="leading-relaxed">
        {parts.map((part, index) => {
          const lowerPart = part.toLowerCase();
          if (lowerPart === 'changelog') {
            return (
              <LocalizedLink
                key={index}
                href="/docs/project-updates/changelog/lisa"
                className="branded-link"
              >
                {part}
              </LocalizedLink>
            );
          } else if (lowerPart === 'roadmap') {
            return (
              <LocalizedLink
                key={index}
                href="/docs/project-updates/roadmap"
                className="branded-link"
              >
                {part}
              </LocalizedLink>
            );
          }
          return part;
        })}
      </p>
    </div>
  );
}
