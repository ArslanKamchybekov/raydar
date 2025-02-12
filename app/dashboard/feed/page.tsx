"use client";

import { useState, useEffect } from "react";
import { Item } from "@/types/types";
import SearchAndFilter from "./_components/SearchAndFilter";
import ItemGrid from "./_components/ItemGrid";
import Pagination from "./_components/Pagination";
import ItemDetailModal from "./_components/ItemDetailModal";
import ClaimModal from "./_components/ClaimModal";
import { useItems } from "@/utils/hook/useItem";
import { Loader2 } from "lucide-react";

const FeedPage = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [filteredItems, setFilteredItems] = useState<Item[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isClaimModalOpen, setIsClaimModalOpen] = useState(false);
  const itemsPerPage = 9;

  const { items: fetchedItems, isLoading: isItemsLoading, error: itemsError } = useItems();

  useEffect(() => {
    if (fetchedItems) {
      setItems(fetchedItems);
      setFilteredItems(fetchedItems);
      setIsLoading(false);
    }
  }, [fetchedItems]);

  const handleItemClick = (item: Item) => {
    setSelectedItem(item);
    setIsDetailModalOpen(true);
  };

  const handleClaimClick = (item: Item) => {
    setSelectedItem(item);
    setIsClaimModalOpen(true);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredItems.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <>
      <div>
        <div>
          <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">
            Feed
          </h1>
          <p className="leading-7 text-sm text-gray-600 dark:text-gray-400 mb-6">
            Browse through the items that have been found on campus.
          </p>

          {isLoading ? (
            <div className="flex justify-center items-center h-screen">
              <Loader2 className="animate-spin h-6 w-6 text-gray-500" />
              </div>
          ) : (
            <div className="flex flex-col gap-4">
              <SearchAndFilter items={items} setFilteredItems={setFilteredItems} />

              <ItemGrid
                items={currentItems}
                isLoading={isLoading}
                error={error}
                onItemClick={handleItemClick}
                onClaimClick={handleClaimClick}
              />

              <Pagination
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                totalItems={filteredItems.length}
                itemsPerPage={itemsPerPage}
              />

              <ItemDetailModal
                isOpen={isDetailModalOpen}
                onOpenChange={setIsDetailModalOpen}
                item={selectedItem}
              />

              <ClaimModal
                isOpen={isClaimModalOpen}
                onOpenChange={setIsClaimModalOpen}
                item={selectedItem}
              />
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default FeedPage;
