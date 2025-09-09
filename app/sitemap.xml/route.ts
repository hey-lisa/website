import { NextResponse } from 'next/server';
import { page_routes } from '@/lib/routes-config';
import { getAllHQFrontmatter } from '@/lib/markdown';

export async function GET() {
  const baseUrl = 'https://hey-lisa.com';
  const currentDate = new Date().toISOString();

  // Static pages
  const staticPages = [
    {
      url: baseUrl,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/lab`,
      lastModified: currentDate,
      changeFrequency: 'weekly', // Lab showcases evolving products
      priority: 0.9, // High priority - main product showcase
    },
    {
      url: `${baseUrl}/hq`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.7,
    },
  ];

  // Documentation pages from routes - high priority for evolving docs
  const docPages = page_routes.map(route => ({
    url: `${baseUrl}/docs${route.href}`,
    lastModified: currentDate,
    changeFrequency: 'weekly', // Docs evolve quickly
    priority: 0.8, // Higher priority - core content
  }));

  // HQ posts (individual posts) - high priority content
  const hqPosts = (await getAllHQFrontmatter()).map(post => ({
    url: `${baseUrl}/hq/${post.slug}`,
    lastModified: new Date(post.date.split('-').reverse().join('-')).toISOString(),
    changeFrequency: 'monthly', // Posts don't change after publication
    priority: 0.8, // High priority - contains announcements, updates, company news
  }));

  // Combine all pages
  const allPages = [...staticPages, ...docPages, ...hqPosts];

  // Generate XML
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allPages
  .map(
    (page) => `  <url>
    <loc>${page.url}</loc>
    <lastmod>${page.lastModified}</lastmod>
    <changefreq>${page.changeFrequency}</changefreq>
    <priority>${page.priority}</priority>
  </url>`
  )
  .join('\n')}
</urlset>`;

  return new NextResponse(sitemap, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=86400, s-maxage=86400', // Cache for 1 day maximum
    },
  });
}
