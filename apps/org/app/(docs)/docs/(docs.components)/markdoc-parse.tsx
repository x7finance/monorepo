import fs from "fs"
import path from "path"

import Markdoc from "@markdoc/markdoc"
import { slugifyWithCounter } from "@sindresorhus/slugify"
import matter from "gray-matter"

import { config } from "../config.markdoc"

const SOURCE_FILES = "app/(docs)/docs/(source-files)"
export const SOURCE_DIR = path.join(process.cwd(), SOURCE_FILES)

interface ParamsProps {
  slug: string | undefined
  section: "whitepaper" | "faq" | "onchains" | "integration"
  description?: string
  title: string
}

export type DocsPageProps = {
  params: ParamsProps
}

export async function getMarkdownContent(params: ParamsProps) {
  try {
    const { slug, section = "" } = params

    const filePath = path.join(
      SOURCE_DIR,
      section,
      slug === undefined ? "index.md" : `${slug}.md`
    )

    const source = fs.readFileSync(filePath, "utf-8")
    const matterResult = matter(source)

    const { title, tags = [], date, description, seoTitle } = matterResult.data
    const ast = Markdoc.parse(source)
    const content = Markdoc.transform(ast, config)
    const tableOfContents = collectHeadings(content) ?? []

    return {
      content,
      title,
      tags,
      tableOfContents,
      date,
      description,
      slug,
      slugPath: `/docs${section ? `/${section}` : ``}${slug ? `/${slug}` : ``}`,
      seoTitle,
    }
  } catch (error) {
    return { content: null, title: null, tags: null, tableOfContents: null }
  }
}

function getNodeText(node: any) {
  let text = ""
  for (let child of node.children ?? []) {
    if (typeof child === "string") {
      text += child
    }
    text += getNodeText(child)
  }
  return text
}

const SUBHEADINGS = [2, 3]

interface SectionsType {
  id: string
  title: string
  children: JSX.Element[] | JSX.Element
}

function collectHeadings(nodes: any, slugify = slugifyWithCounter()) {
  let sections = []

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
          if (!sections[sections.length - 1]) {
            throw new Error(
              "Cannot add `h3` to table of contents without a preceding `h2`"
            )
          }

          // @ts-expect-error
          sections[sections.length - 1].children.push({
            ...node.attributes,
            title,
          })
        } else {
          // @ts-expect-error
          sections.push({ ...node.attributes, title, children: [] })
        }
      }
    }

    sections.push(...collectHeadings(node.children ?? [], slugify))
  }

  return sections
}
