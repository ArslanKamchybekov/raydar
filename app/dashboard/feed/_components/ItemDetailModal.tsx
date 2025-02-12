import Image from "next/image"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { VisuallyHidden } from "@radix-ui/react-visually-hidden"
import type { Item } from "@/types/types"

interface ItemDetailModalProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  item: Item | null
}

const ItemDetailModal: React.FC<ItemDetailModalProps> = ({ isOpen, onOpenChange, item }) => {
  if (!item) return null

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="w-full max-w-full sm:max-w-3xl h-[90vh] overflow-auto p-4 sm:p-6">
        <DialogHeader>
          <VisuallyHidden>
            <DialogTitle className="text-2xl">{item.category}</DialogTitle>
          </VisuallyHidden>
        </DialogHeader>
        <div className="space-y-6">
          {item.image && (
            <div className="w-full">
              <Image
                src={item.image || "/placeholder.svg"}
                alt={item.description || "Found item"}
                width={500}
                height={500}
                className="w-full max-w-full h-auto max-h-[300px] object-cover rounded-md"
              />
            </div>
          )}

          <div className="space-y-4 text-sm sm:text-base">
            <div>
              <h3 className="font-semibold">Location</h3>
              <p>{item.location}</p>
            </div>
            {item.description && (
              <div>
                <h3 className="font-semibold">Description</h3>
                <p>{item.description}</p>
              </div>
            )}
            {item.colors?.length > 0 && (
              <div>
                <h3 className="font-semibold">Colors</h3>
                <p>{item.colors.join(", ")}</p>
              </div>
            )}
            {item.brand && (
              <div>
                <h3 className="font-semibold">Brand</h3>
                <p>{item.brand}</p>
              </div>
            )}
            {item.size && (
              <div>
                <h3 className="font-semibold">Size</h3>
                <p>{item.size}</p>
              </div>
            )}
            {item.material && (
              <div>
                <h3 className="font-semibold">Material</h3>
                <p>{item.material}</p>
              </div>
            )}
            {item.weather && (
              <div>
                <h3 className="font-semibold">Weather When Found</h3>
                <p>{item.weather}</p>
              </div>
            )}
            {item.keywords?.length > 0 && (
              <div>
                <h3 className="font-semibold">Keywords</h3>
                <p>{item.keywords.join(", ")}</p>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default ItemDetailModal

