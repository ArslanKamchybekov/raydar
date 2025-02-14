"use client";

import { useState } from "react";
import { Item } from "@/types/types";
import SearchAndFilter from "./_components/SearchAndFilter";
import ItemGrid from "./_components/ItemGrid";
import Pagination from "./_components/Pagination";
import ItemDetailModal from "./_components/ItemDetailModal";
import ClaimModal from "./_components/ClaimModal";
import ReportModal from "./_components/ReportModal";
import { useItems } from "@/utils/hook/useItem";
import { Chatbot } from "./_components/Chatbot";
import ItemGridSkeleton from "./_components/ItemGridSkeleton";

const FeedPage = () => {
  const { items, isLoading, error } = useItems();
  const [filteredItems, setFilteredItems] = useState<Item[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isClaimModalOpen, setIsClaimModalOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const itemsPerPage = 9;

  const handleItemClick = (item: Item) => {
    setSelectedItem(item);
    setIsDetailModalOpen(true);
  };

  const handleClaimClick = (item: Item) => {
    setSelectedItem(item);
    setIsClaimModalOpen(true);
  };

  const handleReportClick = (item: Item) => {
    setSelectedItem(item);
    setIsReportModalOpen(true);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems =
    filteredItems.length > 0
      ? filteredItems.slice(indexOfFirstItem, indexOfLastItem)
      : items?.slice(indexOfFirstItem, indexOfLastItem) || [];

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
            <ItemGridSkeleton />
          ) : (
            <div className="flex flex-col gap-4">
              <SearchAndFilter
                items={items || []}
                setFilteredItems={setFilteredItems}
              />

              <ItemGrid
                items={currentItems}
                onItemClick={handleItemClick}
                onClaimClick={handleClaimClick}
                onReportClick={handleReportClick}
              />

              <Pagination
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                totalItems={
                  (filteredItems.length > 0 ? filteredItems : items || [])
                    .length
                }
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

              <ReportModal
                isOpen={isReportModalOpen}
                onOpenChange={setIsReportModalOpen}
                itemId={selectedItem?.id || null}
              />

              <Chatbot />
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default FeedPage;
