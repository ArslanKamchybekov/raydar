import { Button } from "@/components/ui/button"
import type React from "react" // Added import for React

interface PaginationProps {
  currentPage: number
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>
  totalItems: number
  itemsPerPage: number
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, setCurrentPage, totalItems, itemsPerPage }) => {
  return (
    <div className="flex justify-center mt-8">
      <Button
        onClick={() => setCurrentPage((prev) => prev - 1)}
        disabled={currentPage === 1}
        variant="outline"
        className="mr-2"
      >
        Previous
      </Button>
      <Button
        onClick={() => setCurrentPage((prev) => prev + 1)}
        disabled={currentPage * itemsPerPage >= totalItems}
        variant="outline"
      >
        Next
      </Button>
    </div>
  )
}

export default Pagination

