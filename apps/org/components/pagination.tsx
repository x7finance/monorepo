import { cn } from "utils"
import { Button } from "ui-server"

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
    <div className="flex justify-center mt-4">
      <Button
        size={"sm"}
        variant={"outline"}
        className={cn(`m-2`)}
        disabled={currentPage === 1}
        onClick={goToPreviousPage}
      >
        Previous
      </Button>
      <div className="flex items-center mx-2">
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
