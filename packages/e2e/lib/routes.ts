// Central list of routes the suite exercises. Keep in sync with the app's
// route groups. Dynamic [param] routes use a representative example.

export interface RouteInfo {
  path: string
  // A heading/text we expect to be present once the page renders.
  heading?: RegExp
  group: "marketing" | "docs" | "xchange" | "dashboard"
}

export const MARKETING_ROUTES: RouteInfo[] = [
  { path: "/", group: "marketing" },
  { path: "/about", group: "marketing" },
  { path: "/community", group: "marketing" },
  { path: "/getstarted", group: "marketing" },
  { path: "/ill", group: "marketing" },
  { path: "/ill/amortizing", group: "marketing" },
  { path: "/ill/interest", group: "marketing" },
  { path: "/ill/simple", group: "marketing" },
  { path: "/nfts", group: "marketing" },
  { path: "/nfts/borrowing-maxi", group: "marketing" },
  { path: "/nfts/dex-maxi", group: "marketing" },
  { path: "/nfts/ecosystem-maxi", group: "marketing" },
  { path: "/nfts/liquidity-maxi", group: "marketing" },
  { path: "/nfts/magister", group: "marketing" },
  { path: "/nfts/pioneers", group: "marketing" },
  { path: "/products", group: "marketing" },
  { path: "/products/ill", group: "marketing" },
  { path: "/products/xchange", group: "marketing" },
  { path: "/tokens", group: "marketing" },
  { path: "/tokens/x7100", group: "marketing" },
  { path: "/tokens/x7d", group: "marketing" },
  { path: "/tokens/x7dao", group: "marketing" },
  { path: "/tokens/x7r", group: "marketing" },
]

export const DOCS_ROUTES: RouteInfo[] = [
  { path: "/docs", group: "docs" },
  { path: "/blog", group: "docs" },
]

export const XCHANGE_ROUTES: RouteInfo[] = [
  { path: "/swap", group: "xchange" },
  { path: "/create", group: "xchange" },
  { path: "/deployer", group: "xchange" },
  { path: "/fund", group: "xchange" },
  { path: "/governance", group: "xchange" },
  { path: "/lending", group: "xchange" },
  { path: "/liquidity", group: "xchange" },
  { path: "/vote", group: "xchange" },
]

export const DASHBOARD_ROUTES: RouteInfo[] = [
  { path: "/dashboard", group: "dashboard" },
  { path: "/dashboard/contracts/hubs", group: "dashboard" },
  { path: "/dashboard/contracts/splitters", group: "dashboard" },
  { path: "/dashboard/marketplace", group: "dashboard" },
  { path: "/dashboard/pioneer", group: "dashboard" },
]

export const ALL_ROUTES: RouteInfo[] = [
  ...MARKETING_ROUTES,
  ...DOCS_ROUTES,
  ...XCHANGE_ROUTES,
  ...DASHBOARD_ROUTES,
]
