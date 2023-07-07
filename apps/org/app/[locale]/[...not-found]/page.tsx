import { NotFoundContent } from "@/site-components/not-found"
import { SiteFooter } from "@/site-components/site-footer"

export default function NotFoundPage() {
  return (
    <div>
      <NotFoundContent />
      <SiteFooter className="border-t border-gray-200 bg-[#fafafa]  dark:border-gray-800 dark:bg-[#111111]" />
    </div>
  )
}
