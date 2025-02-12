"use client"

import { useState, useCallback, useEffect, useMemo } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { SlidersHorizontal } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import debounce from "lodash/debounce"
import { Item } from "@/types/types"
import type React from "react"

interface SearchAndFilterProps {
  items: Item[]
  setFilteredItems: React.Dispatch<React.SetStateAction<Item[]>>
}

const SearchAndFilter: React.FC<SearchAndFilterProps> = ({ items, setFilteredItems }) => {
  const [isFilterSheetOpen, setIsFilterSheetOpen] = useState(false)
  const [sortBy, setSortBy] = useState("oldest")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")

  // Get unique categories once when items change
  const categories = useMemo(() => 
    ["all", ...Array.from(new Set(items.map((item) => item.category)))].sort(),
    [items]
  )

  const filterAndSortItems = useCallback(() => {
    let result = [...items]

    // Apply search filter if there's a query
    if (searchQuery) {
      const searchLower = searchQuery.toLowerCase()
      result = result.filter((item: Item) => {
        const searchableFields = [
          item.description,
          item.location,
          item.category,
          ...(item.keywords || []),
          item.brand,
          item.material,
          item.size
        ].filter(Boolean)

        return searchableFields.some(field => 
          field?.toLowerCase().includes(searchLower)
        )
      })
    }

    // Apply category filter
    if (selectedCategory !== "all") {
      result = result.filter(item => item.category === selectedCategory)
    }

    // Apply sorting
    result.sort((a, b) => {
      const dateA = new Date(a.created_at).getTime()
      const dateB = new Date(b.created_at).getTime()
      return sortBy === "newest" ? dateB - dateA : dateA - dateB
    })

    setFilteredItems(result)
  }, [items, searchQuery, selectedCategory, sortBy, setFilteredItems])

  // Effect to trigger filtering when dependencies change
  useEffect(() => {
    filterAndSortItems()
  }, [filterAndSortItems])

  const debouncedSearch = useMemo(
    () => debounce((value: string) => {
      setSearchQuery(value)
    }, 300),
    []
  )

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    debouncedSearch(e.target.value)
  }

  const handleSortChange = (value: string) => {
    setSortBy(value)
  }

  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value)
  }

  // Cleanup debounce on unmount
  useEffect(() => {
    return () => {
      debouncedSearch.cancel()
    }
  }, [debouncedSearch])

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Input 
          type="search" 
          placeholder="Search items..." 
          onChange={handleSearch} 
          className="flex-1"
          aria-label="Search items"
        />
        <Sheet open={isFilterSheetOpen} onOpenChange={setIsFilterSheetOpen}>
          <SheetTrigger asChild>
            <Button 
              variant="outline" 
              size="icon" 
              className="md:hidden"
              aria-label="Filter options"
            >
              <SlidersHorizontal className="h-4 w-4" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[300px]">
            <div className="mt-6">
              <FilterControls
                sortBy={sortBy}
                selectedCategory={selectedCategory}
                categories={categories}
                onSortChange={handleSortChange}
                onCategoryChange={handleCategoryChange}
              />
            </div>
          </SheetContent>
        </Sheet>
      </div>

      <div className="hidden md:flex gap-4">
        <FilterControls
          sortBy={sortBy}
          selectedCategory={selectedCategory}
          categories={categories}
          onSortChange={handleSortChange}
          onCategoryChange={handleCategoryChange}
        />
      </div>
    </div>
  )
}

interface FilterControlsProps {
  sortBy: string
  selectedCategory: string
  categories: string[]
  onSortChange: (value: string) => void
  onCategoryChange: (value: string) => void
}

const FilterControls: React.FC<FilterControlsProps> = ({
  sortBy,
  selectedCategory,
  categories,
  onSortChange,
  onCategoryChange,
}) => (
  <>
    <Select onValueChange={onSortChange} defaultValue={sortBy}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Sort by date" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="newest">Newest First</SelectItem>
        <SelectItem value="oldest">Oldest First</SelectItem>
      </SelectContent>
    </Select>

    <Select onValueChange={onCategoryChange} defaultValue={selectedCategory}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Filter by category" />
      </SelectTrigger>
      <SelectContent>
        {categories.map((category) => (
          <SelectItem key={category} value={category}>
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  </>
)

export default SearchAndFilter