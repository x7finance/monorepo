import fs from "fs"
import path from "path"

import Markdoc from "@markdoc/markdoc"
import { slugifyWithCounter } from "@sindresorhus/slugify"
import matter from "gray-matter"

import { DocType } from "@/lib/types"

import { config } from "./config.markdoc"

const SOURCE_FILES = "app/(docs)/docs/(source-files)"
export const SOURCE_DIR = path.join(process.cwd(), SOURCE_FILES)

interface ParamsProps {
  slug?: string[]
  section: DocType
  description?: string
  title: string
}

export type DocsPageProps = {
  params: ParamsProps
}

export async function getMarkdownContent(params: ParamsProps) {
  try {
    const { slug } = params

    const isRoot = slug === undefined

    const filePath = path.join(
      SOURCE_DIR,
      isRoot
        ? "index.md"
        : slug?.length === 1
        ? `${slug[0]}/index.md`
        : `${slug.join("/")}.md`
    )

    const source = fs.readFileSync(filePath, "utf-8")
    const matterResult = matter(source)

    const { title, tags = [], date, description, seoTitle } = matterResult.data
    const ast = Markdoc.parse(source)

    const content = Markdoc.transform(ast, config)
    const tableOfContents = collectHeadings(content) ?? []

    const builtPath = isRoot ? `/docs/` : `/docs/${slug.join("/")}/`

    const parts = builtPath.split("/")

    const section = (parts[2] || "docs") as DocType

    return {
      section,
      content,
      title,
      tags,
      tableOfContents,
      date,
      description,
      slug: builtPath,
      seoTitle,
    }
  } catch (error) {
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
