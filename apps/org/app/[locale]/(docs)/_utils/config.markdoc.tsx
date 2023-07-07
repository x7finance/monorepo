import type { Config } from "@markdoc/markdoc"

import { Fence } from "../_components/fence.markdoc"
import { Heading } from "../_components/heading.markdoc"
import { Callout } from "../_components/tags/callout.markdoc"
import { QuickLink } from "../_components/tags/quick-link.markdoc"
import { QuickLinks } from "../_components/tags/quick-links.markdoc"
import { Spacer } from "../_components/tags/spacer.markdoc"

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
