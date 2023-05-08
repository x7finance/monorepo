import { SiteConfig } from "types"

export const siteConfig: SiteConfig = {
  name: "X7 Finance",
  description:
    "Documentation, live updates and detailed information on the X7 Finance protocol",
  url: process.env.NODE_ENV === "production" ? "https://www.x7finance.org" : "",
  ogImage: "https://assets.x7finance.org/images/open-graph/background.png",
  links: {
    twitter: "https://twitter.com/x7_finance",
    github: "https://github.com/x7finance",
  },
}
