import { MetadataRoute } from 'next';
import { locales } from '@/lib/locale';
import { page_routes } from '@/lib/routes-config';
import { getAllBlogStaticPaths } from '@/lib/markdown';
import { promises as fs } from 'fs';
import path from 'path';

// Helper function to get file modification time
async function getFileModTime(filePath: string): Promise<Date> {
  try {
    const stats = await fs.stat(filePath);
    return stats.mtime;
  } catch {
    return new Date(); // Fallback to current date if file doesn't exist
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://hey-lisa.com';
  
  const routes: MetadataRoute.Sitemap = [];
  
  // Generate routes for each language
  for (const lang of locales) {
    
    // Home page
    routes.push({
      url: `${baseUrl}/${lang}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
      alternates: {
        languages: locales.reduce((acc, locale) => {
          acc[locale] = `${baseUrl}/${locale}`;
          return acc;
        }, {} as Record<string, string>),
      },
    });
    
    // Static pages
    const staticPages = [
      { path: '/contact', priority: 0.8, changeFreq: 'monthly' as const },
      { path: '/lab', priority: 0.7, changeFreq: 'weekly' as const },
      { path: '/hq', priority: 0.8, changeFreq: 'weekly' as const },
      { path: '/docs', priority: 0.9, changeFreq: 'weekly' as const },
    ];
    
    for (const page of staticPages) {
      routes.push({
        url: `${baseUrl}/${lang}${page.path}`,
        lastModified: new Date(),
        changeFrequency: page.changeFreq,
        priority: page.priority,
        alternates: {
          languages: locales.reduce((acc, locale) => {
            acc[locale] = `${baseUrl}/${locale}${page.path}`;
            return acc;
          }, {} as Record<string, string>),
        },
      });
    }
    
    // Documentation pages
    for (const route of page_routes) {
      if (route.href && route.href !== '/docs') {
        const docFilePath = path.join(process.cwd(), 'contents/docs', lang, route.href, 'index.mdx');
        const lastModified = await getFileModTime(docFilePath);
        
        routes.push({
          url: `${baseUrl}/${lang}/docs${route.href}`,
          lastModified,
          changeFrequency: 'weekly',
          priority: 0.8,
          alternates: {
            languages: locales.reduce((acc, locale) => {
              acc[locale] = `${baseUrl}/${locale}/docs${route.href}`;
              return acc;
            }, {} as Record<string, string>),
          },
        });
      }
    }
    
    // HQ/Blog posts
    try {
      const hqPosts = await getAllBlogStaticPaths(lang);
      if (hqPosts) {
        for (const slug of hqPosts) {
          const hqFilePath = path.join(process.cwd(), 'contents/hq', lang, `${slug}.mdx`);
          const lastModified = await getFileModTime(hqFilePath);
          
          routes.push({
            url: `${baseUrl}/${lang}/hq/${slug}`,
            lastModified,
            changeFrequency: 'monthly',
            priority: 0.6,
            alternates: {
              languages: locales.reduce((acc, locale) => {
                acc[locale] = `${baseUrl}/${locale}/hq/${slug}`;
                return acc;
              }, {} as Record<string, string>),
            },
          });
        }
      }
    } catch (error) {
      console.warn(`Failed to generate HQ sitemap entries for ${lang}:`, error);
    }
  }
  
  return routes;
}
