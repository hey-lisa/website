import { compileMDX } from "next-mdx-remote/rsc";
import path from "path";
import { promises as fs } from "fs";
import remarkGfm from "remark-gfm";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeSlug from "rehype-slug";
import { page_routes, ROUTES } from "./routes-config";
import matter from "gray-matter";
import { Locale } from "./locale";

// custom components imports
import Link from "@/components/markdown/link";
import StrategyExecutionDiagram from "@/components/markdown/strategy-executation-diagram";
import IntentToStrategyDiagram from "@/components/markdown/intent-to-strategy-diagram";
import TransactionFlowDiagram from "@/components/markdown/transaction-flow-diagram";
import Release from "@/components/markdown/release";
import Version from "@/components/markdown/version";
import Added from "@/components/markdown/added";
import Fixed from "@/components/markdown/fixed";

// add custom components
const components = {
  a: Link,
  StrategyExecutionDiagram,
  IntentToStrategyDiagram,
  TransactionFlowDiagram,
  Release,
  Version,
  Added,
  Fixed,
};

// can be used for other pages like blogs, Guides etc
async function parseMdx<Frontmatter>(rawMdx: string) {
  return await compileMDX<Frontmatter>({
    source: rawMdx,
    options: {
      parseFrontmatter: true,
      mdxOptions: {
        rehypePlugins: [
          rehypeSlug,
          rehypeAutolinkHeadings,
        ],
        remarkPlugins: [remarkGfm],
      },
    },
    components,
  });
}

// logic for docs

export type BaseMdxFrontmatter = {
  title: string;
  description: string;
};

export async function getDocsForSlug(slug: string) {
  try {
    const contentPath = getDocsContentPath(slug);
    const rawMdx = await fs.readFile(contentPath, "utf-8");
    return await parseMdx<BaseMdxFrontmatter>(rawMdx);
  } catch (err) {
    console.log(err);
  }
}

export async function getDocsTocs(slug: string) {
  const contentPath = getDocsContentPath(slug);
  const rawMdx = await fs.readFile(contentPath, "utf-8");
  const headingsRegex = /^(#{2,4})\s(.+)$/gm;
  let match;
  const extractedHeadings = [];
  while ((match = headingsRegex.exec(rawMdx)) !== null) {
    const headingLevel = match[1].length;
    const headingText = match[2].trim();
    const slug = sluggify(headingText);
    extractedHeadings.push({
      level: headingLevel,
      text: headingText,
      href: `#${slug}`,
    });
  }
  return extractedHeadings;
}

export function getPreviousNext(path: string) {
  const index = page_routes.findIndex(({ href }) => href == `/${path}`);
  return {
    prev: page_routes[index - 1],
    next: page_routes[index + 1],
  };
}

function sluggify(text: string) {
  return text
    .normalize("NFKC") 
    .toLowerCase()
    .trim()
    .replace(/[\s]+/g, "-")   
    .replace(/[!\"#$%&'()*+,./:;<=>?@[\\\]^_`{|}~]/g, ""); 
}

function getDocsContentPath(slug: string) {
  return path.join(process.cwd(), "/contents/docs/", `${slug}/index.mdx`);
}

function justGetFrontmatterFromMD<Frontmatter>(rawMd: string): Frontmatter {
  return matter(rawMd).data as Frontmatter;
}

export async function getAllChilds(pathString: string) {
  const items = pathString.split("/").filter((it) => it != "");
  let page_routes_copy = ROUTES;

  let prevHref = "";
  for (const it of items) {
    const found = page_routes_copy.find((innerIt) => innerIt.href == `/${it}`);
    if (!found) break;
    prevHref += found.href;
    page_routes_copy = found.items ?? [];
  }
  if (!prevHref) return [];

  return await Promise.all(
    page_routes_copy.map(async (it) => {
      const totalPath = path.join(
        process.cwd(),
        "/contents/docs/",
        prevHref,
        it.href,
        "index.mdx",
      );
      const raw = await fs.readFile(totalPath, "utf-8");
      return {
        ...justGetFrontmatterFromMD<BaseMdxFrontmatter>(raw),
        href: `/docs${prevHref}${it.href}`,
      };
    }),
  );
}


export type Author = {
  avatar?: string;
  handle: string;
  username: string;
  handleUrl: string;
};

export type BlogMdxFrontmatter = BaseMdxFrontmatter & {
  date: string;
  authors: Author[];
  cover: string;
};

export async function getAllBlogStaticPaths(lang: Locale) {
  try {
  const hqFolder = path.join(process.cwd(), `/contents/hq/${lang}`);
  const res = await fs.readdir(hqFolder);
    return res.map((file) => file.split(".")[0]);
  } catch (err) {
    console.log(err);
  }
}

export async function getAllBlogs(lang: Locale) {
  const hqFolder = path.join(process.cwd(), `/contents/hq/${lang}`);
  const files = await fs.readdir(hqFolder);
  const uncheckedRes = await Promise.all(
    files.map(async (file) => {
      if (!file.endsWith(".mdx")) return undefined;
      const filepath = path.join(
        process.cwd(),
        `/contents/hq/${lang}/${file}`,
      );
      const rawMdx = await fs.readFile(filepath, "utf-8");
      return {
        ...justGetFrontmatterFromMD<BlogMdxFrontmatter>(rawMdx),
        slug: file.split(".")[0],
      };
    }),
  );
  return uncheckedRes.filter((it) => !!it) as (BlogMdxFrontmatter & {
    slug: string;
  })[];
}

export async function getBlogForSlug(slug: string, lang: Locale) {
  const hqFile = path.join(
    process.cwd(),
    "/contents/hq/",
    `${lang}/${slug}.mdx`,
  );
  try {
    const rawMdx = await fs.readFile(hqFile, "utf-8");
    return await parseMdx<BlogMdxFrontmatter>(rawMdx);
  } catch {
    return undefined;
  }
}
