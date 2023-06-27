import { Config } from "@markdoc/markdoc"

import { Fence } from "../(blog.components)/fence.markdoc"
import { Heading } from "../(blog.components)/heading.markdoc"
import { Callout } from "../(blog.components)/tags/callout.markdoc"
import { QuickLink } from "../(blog.components)/tags/quick-link.markdoc"
import { QuickLinks } from "../(blog.components)/tags/quick-links.markdoc"
import { Spacer } from "../(blog.components)/tags/spacer.markdoc"

const config: Config = {
  nodes: {
    heading: {
      render: "Heading",
      attributes: {
        level: { type: String },
      },
    },
    fence: {
      render: "Fence",
      attributes: {
        language: {
          type: String,
        },
      },
    },
  },
  tags: {
    callout: {
      render: "Callout",
      attributes: {
        title: {
          type: String,
          default: "default title",
        },
      },
    },
    quickLink: {
      selfClosing: true,
      render: "QuickLink",
      attributes: {
        title: { type: String },
        description: { type: String },
        icon: { type: String },
        href: { type: String },
      },
    },
    spacer: {
      selfClosing: true,
      render: "Spacer",
    },
    quickLinks: {
      render: "QuickLinks",
    },
  },
}

const components = {
  Heading,
  Callout,
  Fence,
  QuickLink,
  QuickLinks,
  Spacer,
}

export { config, components }
