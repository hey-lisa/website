import { compileMDX } from "next-mdx-remote/rsc";
import path from "path";
import { promises as fs } from "fs";
import remarkGfm from "remark-gfm";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeSlug from "rehype-slug";
import { page_routes } from "./routes-config";
import { visit } from "unist-util-visit";
import matter from "gray-matter";

// custom components imports
import Image from "@/components/markdown/image";
import Link from "@/components/markdown/link";
import Release from "@/components/markdown/release";
import Version from "@/components/markdown/version";
import TransactionFlowDiagram from "@/components/markdown/transaction-flow-diagram";
import StrategyExecutionDiagram from "@/components/markdown/strategy-execution-diagram";
import IntentToStrategyDiagram from "@/components/markdown/intent-to-strategy-diagram";

// add custom components
const components = {
  img: Image,
  a: Link,
  Release,
  Version,
  TransactionFlowDiagram,
  StrategyExecutionDiagram,
  IntentToStrategyDiagram,
};

// can be used for other pages like HQ posts, Guides etc
async function parseMdx<Frontmatter>(rawMdx: string) {
  return await compileMDX<Frontmatter>({
    source: rawMdx,
    options: {
      parseFrontmatter: true,
      mdxOptions: {
        rehypePlugins: [
          preProcess,
          rehypeSlug,
          rehypeAutolinkHeadings,
          postProcess,
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

// Make raw MDX resilient to custom changelog markers like "<added> :"
// We replace marker lines with self-closing tags (e.g., <added />)
// so the MDX parser doesn't error on unclosed tags and our runtime
// Version component can detect them.
function normalizeChangelogMarkers(raw: string): string {
  // Replace lines like "<added> :" with self-closing tags to avoid MDX parse errors
  const markerRegex = /^(<\s*(added|changed|fixed)\s*>)\s*:\s*$/gmi;
  let normalized = raw.replace(markerRegex, (_m, _g1, tag) => `<${tag} />`);
  // Ensure wrapped tags are treated as components
  normalized = normalized.replace(/<\/?(added|changed|fixed)>/gmi, (m) => m.toLowerCase());
  return normalized;
}

export async function getCompiledDocsForSlug(slug: string) {
  try {
    const contentPath = getDocsContentPath(slug);
    const rawMdx = await fs.readFile(contentPath, "utf-8");
    const normalized = normalizeChangelogMarkers(rawMdx);
    return await parseMdx<BaseMdxFrontmatter>(normalized);
  } catch (err) {
    console.error('Error compiling docs for slug:', slug, err);
  }
}

export async function getDocsTocs(slug: string) {
  const contentPath = getDocsContentPath(slug);
  const rawMdx = await fs.readFile(contentPath, "utf-8");
  // captures between ## - #### can modify accordingly
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
  const slug = text.toLowerCase().replace(/\s+/g, "-");
  return slug.replace(/[^a-z0-9-]/g, "");
}

function getDocsContentPath(slug: string) {
  return path.join(process.cwd(), "/contents/docs/", `${slug}/index.mdx`);
}

function justGetFrontmatterFromMD<Frontmatter>(rawMd: string): Frontmatter {
  return matter(rawMd).data as Frontmatter;
}


// for copying the code in pre
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const preProcess = () => (tree: any) => {
  visit(tree, (node) => {
    if (node?.type === "element" && node?.tagName === "pre") {
      const [codeEl] = node.children;
      if (codeEl.tagName !== "code") return;
      node.raw = codeEl.children?.[0].value;
    }
  });
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const postProcess = () => (tree: any) => {
  visit(tree, "element", (node) => {
    if (node?.type === "element" && node?.tagName === "pre") {
      node.properties["raw"] = node.raw;
    }
  });
};

export type Author = {
  avatar?: string;
  handle: string;
  username: string;
  handleUrl: string;
};

export type HQMdxFrontmatter = BaseMdxFrontmatter & {
  date: string;
  authors: Author[];
  cover: string;
};


export async function getAllHQStaticPaths() {
  try {
    const hqFolder = path.join(process.cwd(), "/contents/blogs/");
    const res = await fs.readdir(hqFolder);
    return res.map((file) => file.split(".")[0]);
  } catch (err) {
    console.error('Error reading HQ static paths:', err);
  }
}


export async function getAllHQFrontmatter() {
  const hqFolder = path.join(process.cwd(), "/contents/blogs/");
  const files = await fs.readdir(hqFolder);
  const uncheckedRes = await Promise.all(
    files.map(async (file) => {
      if (!file.endsWith(".mdx")) return undefined;
      const filepath = path.join(process.cwd(), `/contents/blogs/${file}`);
      const rawMdx = await fs.readFile(filepath, "utf-8");
      return {
        ...justGetFrontmatterFromMD<HQMdxFrontmatter>(rawMdx),
        slug: file.split(".")[0],
      };
    })
  );
  return uncheckedRes.filter((it) => !!it) as (HQMdxFrontmatter & {
    slug: string;
  })[];
}


export async function getCompiledHQForSlug(slug: string) {
  const hqFile = path.join(process.cwd(), "/contents/blogs/", `${slug}.mdx`);
  try {
    const rawMdx = await fs.readFile(hqFile, "utf-8");
    return await parseMdx<HQMdxFrontmatter>(rawMdx);
  } catch {
    return undefined;
  }
}


export async function getHQFrontmatter(slug: string) {
  const hqFile = path.join(process.cwd(), "/contents/blogs/", `${slug}.mdx`);
  try {
    const rawMdx = await fs.readFile(hqFile, "utf-8");
    return justGetFrontmatterFromMD<HQMdxFrontmatter>(rawMdx);
  } catch {
    return undefined;
  }
}


export async function getDocFrontmatter(path: string) {
  try {
    const contentPath = getDocsContentPath(path);
    const rawMdx = await fs.readFile(contentPath, "utf-8");
    return justGetFrontmatterFromMD<HQMdxFrontmatter>(rawMdx);
  } catch {
    return undefined;
  }
}

