"use client"

import { useEffect, useState, useCallback } from "react"
import Image from "next/image"
import { getFoundItems } from "@/app/actions/foundItems"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import debounce from "lodash/debounce"
import { getUserData } from "@/app/actions/user"

const FeedPage = () => {
  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedItem, setSelectedItem] = useState<any>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [sortBy, setSortBy] = useState("newest")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [claimModalOpen, setClaimModalOpen] = useState(false)
  const [selectedItemForClaim, setSelectedItemForClaim] = useState<any>(null)
  const itemsPerPage = 9

  useEffect(() => {
    const fetchItems = async () => {
      try {
        setLoading(true)
        const data = await getFoundItems()
        setItems(data)
      } catch (err: any) {
        setError(err)
      } finally {
        setLoading(false)
      }
    }

    fetchItems()
  }, [])

  // Get unique categories from items
  const categories = ["all", ...Array.from(new Set(items.map((item) => item.category)))].sort()

  const debouncedSearch = useCallback(
    debounce((value: string) => setSearchQuery(value), 300),
    [],
  )

  const sortItems = (items: any[]) => {
    return [...items].sort((a, b) => {
      if (sortBy === "newest") {
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      } else if (sortBy === "oldest") {
        return new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      }
      return 0
    })
  }

  const filteredItems = sortItems(
    items.filter((item: any) => {
      const searchLower = searchQuery.toLowerCase()
      const matchesSearch =
        item.description?.toLowerCase().includes(searchLower) ||
        item.location_name.toLowerCase().includes(searchLower) ||
        item.category.toLowerCase().includes(searchLower) ||
        (item.keywords || []).some((keyword: string) => keyword.toLowerCase().includes(searchLower))

      const matchesCategory = selectedCategory === "all" || item.category === selectedCategory

      return matchesSearch && matchesCategory
    }),
  )

  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = filteredItems.slice(indexOfFirstItem, indexOfLastItem)

  const handleItemClick = (item: any) => {
    setSelectedItem(item)
    setIsModalOpen(true)
  }

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber)

  const handleClaimClick = async (item: any) => {
    try {
      if (!item.user_id) {
        console.error("User ID is missing for this item")
        return
      }
      const userData = await getUserData(item.user_id)
      setSelectedItemForClaim({ ...item, userData })
      setClaimModalOpen(true)
    } catch (error) {
      console.error("Error fetching user data:", error)
      // You might want to show an error message to the user here
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto py-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, index) => (
            <Card key={index} className="animate-pulse">
              <CardHeader>
                <CardTitle className="text-xl">Loading...</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="w-full h-48 bg-gray-200 rounded-md mb-4"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded"></div>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full" disabled>
                  Loading...
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg text-red-500">Error: {error}</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="flex items-center gap-2 mb-2">
        <h1 className="text-3xl font-semibold tracking-tight">Raydar Feed</h1>
      </div>
      <p className="leading-7 text-sm text-gray-600 dark:text-gray-400 mb-6">
        Browse through the items that have been found on campus.
      </p>
      <div className="container mx-auto py-4">
        <div className="flex gap-4 mb-4">
          <Select onValueChange={setSortBy} defaultValue="newest">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by date" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest First</SelectItem>
              <SelectItem value="oldest">Oldest First</SelectItem>
            </SelectContent>
          </Select>

          <Select onValueChange={setSelectedCategory} defaultValue="all">
            <SelectTrigger className="w-[180px]">
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
          <Input
            type="search"
            placeholder="Search items..."
            value={searchQuery}
            onChange={(e) => debouncedSearch(e.target.value)}
            className="max-w-sm mx-auto mb-8"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {currentItems.map((item: any) => (
            <Card key={item.id} className={`hover:shadow-lg transition-shadow ${item.claimed ? "opacity-50" : ""}`}>
              <CardHeader>
                <CardTitle className="text-xl">{item.category}</CardTitle>
              </CardHeader>
              <CardContent>
                <Image
                  src={item.image_url || "/sparkhacks-logo.png"}
                  alt={item.description || "Found item"}
                  width={500}
                  height={500}
                  className="w-full h-48 object-cover rounded-md mb-4"
                />
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Location: {item.location_name}</p>
                  {item.description && <p className="text-sm">{item.description}</p>}
                  {item.colors && item.colors.length > 0 && <p className="text-sm">Colors: {item.colors.join(", ")}</p>}
                  {item.brand && <p className="text-sm">Brand: {item.brand}</p>}
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button onClick={() => handleItemClick(item)} className="flex-1 mr-2">
                  View Details
                </Button>
                <Button onClick={() => handleClaimClick(item)} className="flex-1 ml-2" variant="outline">
                  Claim
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        {filteredItems.length === 0 && (
          <div className="text-center text-muted-foreground mt-8">No items found. Try adjusting your search.</div>
        )}

        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="max-w-3xl">
            {selectedItem && (
              <>
                <DialogHeader>
                  <DialogTitle className="text-2xl">{selectedItem.category}</DialogTitle>
                </DialogHeader>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    {selectedItem.image_id && (
                      <Image
                        src={selectedItem.image_url || "/sparkhacks-logo.png"}
                        alt={selectedItem.description || "Found item"}
                        width={500}
                        height={500}
                        className="w-full h-48 object-cover rounded-md mb-4"
                      />
                    )}
                  </div>
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold">Location</h3>
                      <p>{selectedItem.location_name}</p>
                    </div>
                    {selectedItem.description && (
                      <div>
                        <h3 className="font-semibold">Description</h3>
                        <p>{selectedItem.description}</p>
                      </div>
                    )}
                    {selectedItem.colors && selectedItem.colors.length > 0 && (
                      <div>
                        <h3 className="font-semibold">Colors</h3>
                        <p>{selectedItem.colors.join(", ")}</p>
                      </div>
                    )}
                    {selectedItem.brand && (
                      <div>
                        <h3 className="font-semibold">Brand</h3>
                        <p>{selectedItem.brand}</p>
                      </div>
                    )}
                    {selectedItem.size && (
                      <div>
                        <h3 className="font-semibold">Size</h3>
                        <p>{selectedItem.size}</p>
                      </div>
                    )}
                    {selectedItem.material && (
                      <div>
                        <h3 className="font-semibold">Material</h3>
                        <p>{selectedItem.material}</p>
                      </div>
                    )}
                    {selectedItem.weather_found && (
                      <div>
                        <h3 className="font-semibold">Weather When Found</h3>
                        <p>{selectedItem.weather_found}</p>
                      </div>
                    )}
                    {selectedItem.keywords && selectedItem.keywords.length > 0 && (
                      <div>
                        <h3 className="font-semibold">Keywords</h3>
                        <p>{selectedItem.keywords.join(", ")}</p>
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>
        <Dialog open={claimModalOpen} onOpenChange={setClaimModalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Claim Item</DialogTitle>
            </DialogHeader>
            {selectedItemForClaim && (
              <div className="mt-4">
                <h3 className="font-semibold mb-2">Item Details</h3>
                <p>Category: {selectedItemForClaim.category}</p>
                <p>Location: {selectedItemForClaim.location_name}</p>
                {selectedItemForClaim.description && <p>Description: {selectedItemForClaim.description}</p>}

                <h3 className="font-semibold mt-4 mb-2">Posted by</h3>
                {selectedItemForClaim.userData ? (
                  <>
                    <p>
                      Name: {selectedItemForClaim.userData.firstName} {selectedItemForClaim.userData.lastName}
                    </p>
                    <p>Email: {selectedItemForClaim.userData.emailAddress || "Not provided"}</p>
                  </>
                ) : (
                  <p>User information not available</p>
                )}

                <Button onClick={() => setClaimModalOpen(false)} className="w-full mt-4">
                  Close
                </Button>
              </div>
            )}
          </DialogContent>
        </Dialog>
        <div className="flex justify-center mt-8">
          {Array.from({ length: Math.ceil(filteredItems.length / itemsPerPage) }).map((_, index) => (
            <Button
              key={index}
              onClick={() => paginate(index + 1)}
              variant={currentPage === index + 1 ? "default" : "outline"}
              className="mx-1"
            >
              {index + 1}
            </Button>
          ))}
        </div>
      </div>
    </div>
  )
}

export default FeedPage

