/* oxlint-disable @typescript-eslint/no-unnecessary-condition */
import { generateBlogPostSlugs } from "~/lib/utils/generateBlogPostSlugs"
import { generateDocsSlugs } from "~/lib/utils/generateDocsSlugs"

const URL = "https://www.x7finance.org"

interface PageType {
  slug: string[]
  locale: string
  lastmod?: string // Optional last modification date
}

// Get current date in ISO format for lastmod
const getCurrentDate = () => new Date().toISOString().split("T")[0]

function generateSiteMap({
  blogPosts,
  docsPosts,
}: {
  blogPosts: PageType[]
  docsPosts: PageType[]
}) {
  return `<?xml version="1.0" encoding="UTF-8"?>
   <urlset xmlns="https://www.sitemaps.org/schemas/sitemap/0.9">
    <!-- Home page - highest priority -->
    <url>
      <loc>https://www.x7finance.org/</loc>
      <lastmod>${getCurrentDate()}</lastmod>
      <changefreq>daily</changefreq>
      <priority>1.0</priority>
    </url>
    
    <!-- Main product pages - high priority -->
    <url>
      <loc>https://www.x7finance.org/lending</loc>
      <lastmod>${getCurrentDate()}</lastmod>
      <changefreq>weekly</changefreq>
      <priority>0.9</priority>
    </url>
    <url>
      <loc>https://www.x7finance.org/liquidity</loc>
      <lastmod>${getCurrentDate()}</lastmod>
      <changefreq>weekly</changefreq>
      <priority>0.9</priority>
    </url>
    <url>
      <loc>https://www.x7finance.org/products/ill</loc>
      <lastmod>${getCurrentDate()}</lastmod>
      <changefreq>weekly</changefreq>
      <priority>0.9</priority>
    </url>
    <url>
      <loc>https://www.x7finance.org/products/x7d</loc>
      <lastmod>${getCurrentDate()}</lastmod>
      <changefreq>weekly</changefreq>
      <priority>0.9</priority>
    </url>
    <url>
      <loc>https://www.x7finance.org/products/xchange</loc>
      <lastmod>${getCurrentDate()}</lastmod>
      <changefreq>weekly</changefreq>
      <priority>0.9</priority>
    </url>
    <url>
      <loc>https://www.x7finance.org/dashboard</loc>
      <lastmod>${getCurrentDate()}</lastmod>
      <changefreq>daily</changefreq>
      <priority>0.9</priority>
    </url>
    
    <!-- Information pages - medium-high priority -->
    <url>
      <loc>https://www.x7finance.org/about</loc>
      <lastmod>${getCurrentDate()}</lastmod>
      <changefreq>monthly</changefreq>
      <priority>0.8</priority>
    </url>
    <url>
      <loc>https://www.x7finance.org/community</loc>
      <lastmod>${getCurrentDate()}</lastmod>
      <changefreq>weekly</changefreq>
      <priority>0.8</priority>
    </url>
    <url>
      <loc>https://www.x7finance.org/getstarted</loc>
      <lastmod>${getCurrentDate()}</lastmod>
      <changefreq>monthly</changefreq>
      <priority>0.8</priority>
    </url>
    <url>
      <loc>https://www.x7finance.org/integrations</loc>
      <lastmod>${getCurrentDate()}</lastmod>
      <changefreq>monthly</changefreq>
      <priority>0.8</priority>
    </url>
    <url>
      <loc>https://www.x7finance.org/faq/</loc>
      <lastmod>${getCurrentDate()}</lastmod>
      <changefreq>monthly</changefreq>
      <priority>0.8</priority>
    </url>
    
    <!-- Token pages - medium priority -->
    <url>
      <loc>https://www.x7finance.org/tokens/x7101</loc>
      <lastmod>${getCurrentDate()}</lastmod>
      <changefreq>weekly</changefreq>
      <priority>0.7</priority>
    </url>
    <url>
      <loc>https://www.x7finance.org/tokens/x7102</loc>
      <lastmod>${getCurrentDate()}</lastmod>
      <changefreq>weekly</changefreq>
      <priority>0.7</priority>
    </url>
    <url>
      <loc>https://www.x7finance.org/tokens/x7103</loc>
      <lastmod>${getCurrentDate()}</lastmod>
      <changefreq>weekly</changefreq>
      <priority>0.7</priority>
    </url>
    <url>
      <loc>https://www.x7finance.org/tokens/x7104</loc>
      <lastmod>${getCurrentDate()}</lastmod>
      <changefreq>weekly</changefreq>
      <priority>0.7</priority>
    </url>
    <url>
      <loc>https://www.x7finance.org/tokens/x7105</loc>
      <lastmod>${getCurrentDate()}</lastmod>
      <changefreq>weekly</changefreq>
      <priority>0.7</priority>
    </url>
    <url>
      <loc>https://www.x7finance.org/tokens/x7r</loc>
      <lastmod>${getCurrentDate()}</lastmod>
      <changefreq>weekly</changefreq>
      <priority>0.7</priority>
    </url>
    <url>
      <loc>https://www.x7finance.org/tokens/x7dao</loc>
      <lastmod>${getCurrentDate()}</lastmod>
      <changefreq>weekly</changefreq>
      <priority>0.7</priority>
    </url>
    
    <!-- NFT pages - medium priority -->
    <url>
      <loc>https://www.x7finance.org/nfts</loc>
      <lastmod>${getCurrentDate()}</lastmod>
      <changefreq>weekly</changefreq>
      <priority>0.7</priority>
    </url>
    <url>
      <loc>https://www.x7finance.org/nfts/borrowing-maxi</loc>
      <lastmod>${getCurrentDate()}</lastmod>
      <changefreq>monthly</changefreq>
      <priority>0.6</priority>
    </url>
    <url>
      <loc>https://www.x7finance.org/nfts/dex-maxi</loc>
      <lastmod>${getCurrentDate()}</lastmod>
      <changefreq>monthly</changefreq>
      <priority>0.6</priority>
    </url>
    <url>
      <loc>https://www.x7finance.org/nfts/ecosystem-maxi</loc>
      <lastmod>${getCurrentDate()}</lastmod>
      <changefreq>monthly</changefreq>
      <priority>0.6</priority>
    </url>
    <url>
      <loc>https://www.x7finance.org/nfts/liquidity-maxi</loc>
      <lastmod>${getCurrentDate()}</lastmod>
      <changefreq>monthly</changefreq>
      <priority>0.6</priority>
    </url>
    <url>
      <loc>https://www.x7finance.org/nfts/magister</loc>
      <lastmod>${getCurrentDate()}</lastmod>
      <changefreq>monthly</changefreq>
      <priority>0.6</priority>
    </url>
    <url>
      <loc>https://www.x7finance.org/nfts/pioneers</loc>
      <lastmod>${getCurrentDate()}</lastmod>
      <changefreq>monthly</changefreq>
      <priority>0.6</priority>
    </url>
    
    <!-- Dashboard secondary pages - medium priority -->
    <url>
      <loc>https://www.x7finance.org/dashboard/contracts/splits</loc>
      <lastmod>${getCurrentDate()}</lastmod>
      <changefreq>weekly</changefreq>
      <priority>0.6</priority>
    </url>
    <url>
      <loc>https://www.x7finance.org/dashboard/marketplace</loc>
      <lastmod>${getCurrentDate()}</lastmod>
      <changefreq>weekly</changefreq>
      <priority>0.7</priority>
    </url>
    
    <!-- Blog posts - medium-high priority as they contain fresh content -->
     ${blogPosts
       .map(({ slug, lastmod }) => {
         return `
           <url>
               <loc>${URL}/blog/public/${!slug ? "" : slug.join("/")}</loc>
               <lastmod>${lastmod ?? getCurrentDate()}</lastmod>
               <changefreq>monthly</changefreq>
               <priority>0.8</priority>
           </url>
         `
       })
       .join("")}
       
    <!-- Documentation pages - medium priority -->
       ${docsPosts
         .map(({ slug, lastmod }) => {
           return `
            <url>
                <loc>${URL}/docs/${!slug ? "" : slug.join("/")}</loc>
                <lastmod>${lastmod ?? getCurrentDate()}</lastmod>
                <changefreq>monthly</changefreq>
                <priority>0.7</priority>
            </url>
          `
         })
         .join("")}
   </urlset>
 `
}

export async function GET() {
  const blogPosts = await generateBlogPostSlugs()
  const docsPosts = await generateDocsSlugs()

  const body = generateSiteMap({ blogPosts, docsPosts })

  return new Response(body, {
    status: 200,
    headers: {
      "Cache-control": "public, s-maxage=86400, stale-while-revalidate",
      "content-type": "application/xml",
    },
  })
}
