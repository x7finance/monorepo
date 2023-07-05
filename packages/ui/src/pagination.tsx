import { cn } from "@x7/utils"

import { Button } from "./button"

type PaginationProps = {
  currentPage: number
  pageLength: number
  itemsPerPage?: number
  goToPreviousPage: () => void
  goToNextPage: () => void
}

export function Pagination(props: PaginationProps) {
  const {
    currentPage,
    pageLength,
    itemsPerPage = 10,
    goToPreviousPage,
    goToNextPage,
  } = props

  return (
    <div className="mt-4 flex justify-center">
      <Button
        size={"sm"}
        variant={"outline"}
        className={cn(`m-2`)}
        disabled={currentPage === 1}
        onClick={goToPreviousPage}
      >
        Previous
      </Button>
      <div className="mx-2 flex items-center">
        <span className="mr-1 text-gray-500">
          {currentPage} of {Math.ceil(pageLength / itemsPerPage)}
        </span>
      </div>
      <Button
        size={"sm"}
        variant={"outline"}
        className={cn(`m-2`)}
        disabled={currentPage * itemsPerPage >= pageLength}
        onClick={goToNextPage}
      >
        Next
      </Button>
    </div>
  )
}
