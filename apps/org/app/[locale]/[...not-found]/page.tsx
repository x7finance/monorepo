import { NotFoundContent } from "@/site-components/not-found"
import { SiteFooter } from "@/site-components/site-footer"

export default function NotFoundPage() {
  return (
    <div>
      <NotFoundContent />
      <SiteFooter className="border-t dark:border-gray-800 border-gray-200  dark:bg-[#111111] bg-[#fafafa]" />
    </div>
  )
}
