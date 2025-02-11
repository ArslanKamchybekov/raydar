"use client";

import { useEffect, useState, useCallback, ChangeEvent } from "react";
import Image from "next/image";
import { getFoundItems } from "@/app/actions/foundItems";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { SlidersHorizontal } from "lucide-react";
import debounce from "lodash/debounce";
import { getUserData } from "@/app/actions/user";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { ClerkUser } from "@/types/types";

const FeedPage = () => {
  const [items, setItems] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState("oldest");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [claimModalOpen, setClaimModalOpen] = useState(false);
  const [selectedItemForClaim, setSelectedItemForClaim] = useState<any>(null);
  const [isFilterSheetOpen, setIsFilterSheetOpen] = useState(false);
  const itemsPerPage = 9;

  useEffect(() => {
    const fetchItems = async () => {
      try {
        setIsLoading(true);
        const data = await getFoundItems();
        setItems(data);
      } catch (err: any) {
        setError(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchItems();
  }, []);

  const categories = [
    "all",
    ...Array.from(new Set(items.map((item) => item.category))),
  ].sort();

  const debouncedSetSearch = debounce((searchValue: string) => {
    setSearchQuery(searchValue);
    setCurrentPage(1); 
  }, 300);

  const handleSearch = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      debouncedSetSearch(e.target.value);
    },
    [debouncedSetSearch]
  );

  const sortItems = (items: any[]) => {
    return [...items].sort((a, b) => {
      if (sortBy === "newest") {
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      } else if (sortBy === "oldest") {
        return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      }
      return 0;
    });
  };

  const filteredItems = sortItems(
    items.filter((item: any) => {
      const searchLower = searchQuery.toLowerCase();
      const matchesSearch =
        item.description?.toLowerCase().includes(searchLower) ||
        item.location_name.toLowerCase().includes(searchLower) ||
        item.category.toLowerCase().includes(searchLower) ||
        (item.keywords || []).some((keyword: string) =>
          keyword.toLowerCase().includes(searchLower)
        );

      const matchesCategory =
        selectedCategory === "all" || item.category === selectedCategory;

      return matchesSearch && matchesCategory;
    })
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredItems.slice(indexOfFirstItem, indexOfLastItem);

  const handleItemClick = (item: any) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const handleClaimClick = async (item: any) => {
    try {
      if (!item.user_id) {
        console.error("User ID is missing for this item");
        return;
      }
      const userData: ClerkUser = await getUserData(item.user_id);
      console.log("User Data:", userData);
      setSelectedItemForClaim({ ...item, userData });
      setClaimModalOpen(true);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const FilterControls = () => (
    <div className="space-y-4">
      <Select onValueChange={setSortBy} defaultValue="oldest">
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Sort by date" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="newest">Newest First</SelectItem>
          <SelectItem value="oldest">Oldest First</SelectItem>
        </SelectContent>
      </Select>

      <Select onValueChange={setSelectedCategory} defaultValue="all">
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
    </div>
  );

  if (isLoading) {
    return (
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">Feed</h1>
        </div>
        <p className="leading-7 text-sm text-gray-600 dark:text-gray-400 mb-6">
          Browse through the items that have been found on campus.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {[...Array(6)].map((_, index) => (
            <Card key={index} className="animate-pulse">
              <CardHeader>
                <CardTitle className="text-xl">
                  <div className="h-4 bg-gray-400 rounded"></div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="w-full h-48 bg-gray-700 rounded-md mb-4"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-400 rounded"></div>
                  <div className="h-4 bg-gray-400 rounded"></div>
                  <div className="h-4 bg-gray-400 rounded"></div>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full" disabled></Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="text-lg text-red-500">Error: {error}</div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center gap-2">
        <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">Feed</h1>
      </div>
      <p className="leading-7 text-sm text-gray-600 dark:text-gray-400 mb-6">
        Browse through the items that have been found on campus.
      </p>

      <div className="space-y-4">
        {/* Mobile Search and Filter UI */}
        <div className="flex gap-2">
          <Input
            type="search"
            placeholder="Search items..."
            onChange={handleSearch}
            className="flex-1"
          />
          <Sheet open={isFilterSheetOpen} onOpenChange={setIsFilterSheetOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="md:hidden">
                <SlidersHorizontal className="h-4 w-4" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px]">
              <div className="mt-6">
                <FilterControls />
              </div>
            </SheetContent>
          </Sheet>
        </div>

        {/* Desktop Filter Controls */}
        <div className="hidden md:flex gap-4">
          <FilterControls />
        </div>

        {/* Items Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {currentItems.map((item: any) => (
            <Card
              key={item.id}
              className={`hover:shadow-lg transition-shadow ${
                item.claimed ? "opacity-50" : ""
              }`}
            >
              <CardHeader>
                <CardTitle className="text-lg md:text-xl">
                  {item.category[0].toUpperCase() + item.category.slice(1)}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Image
                  src={item.image_url || "/logo.png"}
                  alt={item.description || "Found item"}
                  width={500}
                  height={500}
                  className="w-full h-48 object-cover rounded-md mb-4"
                />
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">
                    Location: {item.location_name}
                  </p>
                  {item.description && (
                    <p className="text-sm line-clamp-2">{item.description}</p>
                  )}
                  {item.colors && item.colors.length > 0 && (
                    <p className="text-sm">Colors: {item.colors.join(", ")}</p>
                  )}
                  {item.brand && <p className="text-sm">Brand: {item.brand}</p>}
                </div>
              </CardContent>
              <CardFooter className="flex flex-col sm:flex-row gap-2">
                <Button
                  onClick={() => handleItemClick(item)}
                  className="w-full sm:flex-1"
                >
                  View
                </Button>
                <Button
                  onClick={() => handleClaimClick(item)}
                  className="w-full sm:flex-1"
                  variant="outline"
                >
                  Claim
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        {filteredItems.length === 0 && (
          <div className="text-center text-muted-foreground mt-8">
            No items found. Try adjusting your search.
          </div>
        )}

        {/* Item Detail Modal */}
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="w-full max-w-full sm:max-w-3xl h-[90vh] overflow-auto p-4 sm:p-6">
            <DialogHeader>
              <VisuallyHidden>
                <DialogTitle className="text-2xl">{selectedItem?.category}</DialogTitle>
              </VisuallyHidden>
            </DialogHeader>
            {selectedItem && (
              <div className="space-y-6">
                {/* Image Section */}
                {selectedItem.image_url && (
                  <div className="w-full">
                    <Image
                      src={selectedItem.image_url || "/logo.png"}
                      alt={selectedItem.description || "Found item"}
                      width={500}
                      height={500}
                      className="w-full max-w-full h-auto max-h-[300px] object-cover rounded-md"
                    />
                  </div>
                )}
                
                {/* Details Section */}
                <div className="space-y-4 text-sm sm:text-base">
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
                  {selectedItem.colors?.length > 0 && (
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
                  {selectedItem.keywords?.length > 0 && (
                    <div>
                      <h3 className="font-semibold">Keywords</h3>
                      <p>{selectedItem.keywords.join(", ")}</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Claim Modal */}
        <Dialog open={claimModalOpen} onOpenChange={setClaimModalOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <VisuallyHidden>
                <DialogTitle>Claim Item</DialogTitle>
              </VisuallyHidden>
            </DialogHeader>
            {selectedItemForClaim && (
              <div className="mt-4">
                <h3 className="font-semibold mb-2">Item Details</h3>
                <p>Category: {selectedItemForClaim.category}</p>
                <p>Location: {selectedItemForClaim.location_name}</p>
                {selectedItemForClaim.description && (
                  <p>Description: {selectedItemForClaim.description}</p>
                )}

                <h3 className="font-semibold mt-4 mb-2">Posted by</h3>
                {selectedItemForClaim.userData ? (
                  <>
                    <p>
                      Name: {selectedItemForClaim.userData.firstName}{" "}
                      {selectedItemForClaim.userData.lastName}
                    </p>
                    <p>Email: {selectedItemForClaim.userData.emailAddress}</p>
                  </>
                ) : (
                  <p>Fetching user data...</p>
                )}
              </div>
            )}
          </DialogContent>
        </Dialog>
        
        {/* Pagination */}
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
            disabled={currentItems.length < itemsPerPage}
            variant="outline"
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FeedPage;