import fs from "fs"
import path from "path"
import type { RenderableTreeNode } from "@markdoc/markdoc"
import Markdoc from "@markdoc/markdoc"
import { slugifyWithCounter } from "@sindresorhus/slugify"
import matter from "gray-matter"

import type { BlogType } from "@/lib/types"
import { AUTHORS } from "./authors"
import { config } from "./config.markdoc"

export const SOURCE_FILES = path.join("content", "blog")

export const SOURCE_DIR = path.join(process.cwd(), SOURCE_FILES)

// Define the type for the slug
type SlugType = string[] | undefined

// Define the return type for parsing the markdown file
interface ParsedMarkdown {
  matterResult: matter.GrayMatterFile<string>
  content: RenderableTreeNode
  tableOfContents: SectionType[]
}

// Create function to parse the markdown file
async function parseMarkdownFile(filePath: string): Promise<ParsedMarkdown> {
  const absolutePath = path.resolve(filePath)

  // Check if the file exists and is accessible
  try {
    await fs.promises.access(absolutePath, fs.constants.F_OK)
  } catch (error) {
    throw new Error(`File does not exist or is not accessible: ${absolutePath}`)
  }

  // If the file exists and is accessible, proceed with reading and parsing
  const source = await fs.promises.readFile(absolutePath, "utf-8")

  const matterResult = matter(source)
  const ast = Markdoc.parse(source)
  const content = Markdoc.transform(ast, config)
  const tableOfContents = collectHeadings(content) ?? []

  return { matterResult, content, tableOfContents }
}

// Define the types for the parameters
export interface ParamsProps {
  slug: SlugType
  section: BlogType
  omitProperties?: (keyof MarkdownContent)[]
}

interface Author {
  id: string
  name: string
  twitter: string
  image: string
}

// Define the type for the return object
export interface MarkdownContent {
  section: BlogType
  content: RenderableTreeNode | null
  title?: string
  tags?: string[]
  tableOfContents: SectionType[] | null
  date?: string
  description: string | null
  slug?: string
  seoTitle: string | null
  imageUrl?: string
  authors: Author[]
  summary?: string
}

function findAuthorsByIds(ids: string[]): Author[] {
  return AUTHORS.filter((author) => ids.includes(author.id))
}

// Main function to get the markdown content
export async function getMarkdownContent(
  params: ParamsProps
): Promise<Partial<MarkdownContent>> {
  const { slug, omitProperties = [] } = params

  try {
    const chainPath = slug?.join("/")

    const { matterResult, content, tableOfContents } = await parseMarkdownFile(
      path?.join(SOURCE_DIR, `posts/${chainPath}.md`)
    )

    const {
      title,
      tags = [],
      date,
      description,
      seoTitle,
      imageUrl,
      authors,
      summary,
    } = matterResult.data

    const section = (slug ? slug[0] : "posts") as BlogType
    const result: Partial<MarkdownContent> = {
      section,
      content,
      title,
      tags,
      tableOfContents,
      date,
      description,
      imageUrl,
      authors: findAuthorsByIds(authors),
      slug: `/blog/posts/${!slug ? "" : slug.join("/")}`,
      seoTitle,
      summary,
    }

    // Omit the properties if any
    omitProperties.forEach((prop) => {
      delete result[prop]
    })

    return result
  } catch (error) {
    console.error(error)
    // @ts-expect-error todo: fix this
    return { content: null, title: null, tags: null, tableOfContents: null }
  }
}

function getNodeText(node: any): string {
  let text = ""
  for (const child of node.children ?? []) {
    if (typeof child === "string") {
      text += child
    } else {
      text += getNodeText(child)
    }
  }
  return text
}

const SUBHEADINGS: number[] = [2, 3]

interface SectionType {
  id: string
  title: string
  children: SectionType[]
}

type SlugifyFunction = (title: string) => string

function collectHeadings(
  nodes: any,
  slugify: SlugifyFunction = slugifyWithCounter()
): SectionType[] {
  const sections: SectionType[] = []

  for (const node of nodes?.children ?? []) {
    if (
      node?.name === "Heading" &&
      SUBHEADINGS.includes(node?.attributes?.level)
    ) {
      const title = getNodeText(node)

      if (title) {
        const id = slugify(title)
        node.attributes.id = id

        if (node.name === "Heading" && node.attributes.level === 3) {
          if (sections.length === 0) {
            throw new Error(
              "Cannot add `h3` to the table of contents without a preceding `h2`"
            )
          }

          // @ts-expect-error
          sections?.[sections.length - 1].children.push({
            id,
            title,
            children: [],
          })
        } else {
          sections.push({ id, title, children: [] })
        }
      }
    }

    sections.push(...collectHeadings(node.children ?? [], slugify))
  }

  return sections
}
