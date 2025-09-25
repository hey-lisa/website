import React from "react";
import { Dictionary } from "@/lib/dictionaries";
import LocalizedLink from "./localized-link";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { ChevronRight } from "lucide-react";

interface DocsBreadcrumbProps {
  slug: string[];
  dict: Dictionary;
  lang: string;
}

export default function DocsBreadcrumb({ slug, dict, lang }: DocsBreadcrumbProps) {
  // Don't show breadcrumb on the root docs page
  if (!slug.length) return null;

  // Function to convert URL slug to dictionary key
  const slugToDictKey = (slug: string): string => {
    return slug.replace(/-/g, '_');
  };

  // Function to get translated title from dictionary or fallback to auto-capitalization
  const getTranslatedTitle = (segment: string): string => {
    const dictKey = slugToDictKey(segment);
    
    // Check if translation exists in leftbar
    if (dict.leftbar && (dict.leftbar as any)[dictKey]) {
      return (dict.leftbar as any)[dictKey];
    }
    
    // Fallback to auto-capitalization if no translation found
    return segment
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const breadcrumbItems = [];

  // Always start with "Docs" as home
  breadcrumbItems.push({
    title: dict.navbar.links.docs,
    href: `/${lang}/docs`,
    isLast: false,
  });

  // Build breadcrumb path
  let currentPath = `/${lang}/docs`;
  
  slug.forEach((segment, index) => {
    currentPath += `/${segment}`;
    const isLast = index === slug.length - 1;
    
    // Get translated title from dictionary
    const title = getTranslatedTitle(segment);

    breadcrumbItems.push({
      title,
      href: currentPath,
      isLast,
    });
  });

  return (
    <Breadcrumb className="mb-4">
      <BreadcrumbList>
        {breadcrumbItems.map((item, index) => (
          <React.Fragment key={index}>
            <BreadcrumbItem>
              {item.isLast ? (
                <BreadcrumbPage>{item.title}</BreadcrumbPage>
              ) : (
                <BreadcrumbLink asChild>
                  <LocalizedLink href={item.href}>{item.title}</LocalizedLink>
                </BreadcrumbLink>
              )}
            </BreadcrumbItem>
            {!item.isLast && (
              <BreadcrumbSeparator>
                <ChevronRight className="h-4 w-4" />
              </BreadcrumbSeparator>
            )}
          </React.Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
