import fs from "fs"
import path from "path"

import Markdoc, { RenderableTreeNode } from "@markdoc/markdoc"
import { slugifyWithCounter } from "@sindresorhus/slugify"
import matter from "gray-matter"

import { DocType } from "@/lib/types"

import { config } from "./config.markdoc"

export const SOURCE_FILES = "app/(docs)/(source-files)"
export const SOURCE_DIR = path.join(process.cwd(), SOURCE_FILES)

// Define the type for the slug
type SlugType = string[] | undefined

async function pathExists(path: string): Promise<boolean> {
  try {
    await fs.promises.access(path)
    return true
  } catch {
    return false
  }
}

async function appendMdIfFileOrIndexMdIfDirectory(pathString) {
  try {
    if (await pathExists(pathString)) {
      const stats = await fs.promises.stat(pathString)

      if (stats.isDirectory()) {
        return path.join(pathString, "index.md")
      }
    } else {
      return `${pathString}.md`
    }
  } catch (error) {
    console.error(`Error reading path: ${error}`)
  }

  // Return original path if it's neither a file nor a directory
  return pathString
}

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
  section: DocType
  omitProperties?: (keyof MarkdownContent)[]
}

// Define the type for the return object
interface MarkdownContent {
  section: DocType
  content?: RenderableTreeNode | null
  title?: string
  tags?: string[]
  tableOfContents: SectionType[] | null
  date?: string
  description: string | null
  slug?: string
  seoTitle: string | null
  authors: string[]
  headerImage: string | null
}

// Main function to get the markdown content
export async function getMarkdownContent(
  params: ParamsProps
): Promise<Partial<MarkdownContent>> {
  const { slug, omitProperties = [] } = params

  try {
    const chainPath = slug?.join("/")

    const filePath = await appendMdIfFileOrIndexMdIfDirectory(
      path?.join(SOURCE_DIR, !chainPath ? `index` : chainPath)
    )

    const { matterResult, content, tableOfContents } = await parseMarkdownFile(
      filePath
    )
    const {
      title,
      tags = [],
      date,
      description,
      seoTitle,
      authors,
      headerImage,
    } = matterResult.data
    const section = (slug ? slug[0] : "docs") as DocType
    let result: Partial<MarkdownContent> = {
      section,
      content,
      title,
      tags,
      tableOfContents,
      date,
      description,
      authors,
      headerImage,
      slug: `/docs/${!slug ? "" : slug.join("/")}`,
      seoTitle,
    }

    // Omit the properties if any
    omitProperties.forEach((prop) => {
      delete result[prop]
    })

    return result
  } catch (error) {
    console.error(error)
    // @ts-expect-error
    return { content: null, title: null, tags: null, tableOfContents: null }
  }
}

function getNodeText(node: any): string {
  let text = ""
  for (let child of node.children ?? []) {
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

function collectHeadings(
  nodes: any,
  slugify = slugifyWithCounter()
): SectionType[] {
  let sections: SectionType[] = []

  for (let node of nodes?.children ?? []) {
    if (
      node.name === "Heading" &&
      SUBHEADINGS.includes(node.attributes.level)
    ) {
      let title = getNodeText(node)

      if (title) {
        let id = slugify(title)
        node.attributes.id = id

        if (node.name === "Heading" && node.attributes.level === 3) {
          if (sections.length === 0) {
            throw new Error(
              "Cannot add `h3` to the table of contents without a preceding `h2`"
            )
          }

          sections[sections.length - 1].children.push({
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
