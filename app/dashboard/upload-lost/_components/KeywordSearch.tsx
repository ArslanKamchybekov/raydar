"use client"

import { useState } from "react"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"

const KeywordSearch = ({
  selectedKeywords,
  setSelectedKeywords,
  availableKeywords,
}: {
  selectedKeywords: string[]
  setSelectedKeywords: (keywords: string[]) => void
  availableKeywords: string[]
}) => {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState("")

  const filteredKeywords = availableKeywords.filter(
    (keyword) => keyword.toLowerCase().includes(search.toLowerCase()) && !selectedKeywords.includes(keyword),
  )

  const handleSelect = (currentValue: string) => {
    setSelectedKeywords([...selectedKeywords, currentValue])
    setOpen(false)
    setSearch("")
  }

  const handleRemove = (keywordToRemove: string) => {
    setSelectedKeywords(selectedKeywords.filter((k) => k !== keywordToRemove))
  }

  return (
    <div className="flex flex-col gap-2">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="w-full justify-start text-left font-normal"
            role="combobox"
            aria-expanded={open}
          >
            <span className="truncate">
              {selectedKeywords.length > 0
                ? `${selectedKeywords.length} keyword${selectedKeywords.length > 1 ? "s" : ""} selected`
                : "Select keywords..."}
            </span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="p-0" align="start">
          <Command>
            <CommandInput placeholder="Search keywords..." value={search} onValueChange={setSearch} />
            <CommandList>
              <CommandEmpty>No keywords found.</CommandEmpty>
              <CommandGroup className="max-h-60 overflow-auto">
                {filteredKeywords.map((keyword) => (
                  <CommandItem key={keyword} onSelect={() => handleSelect(keyword)} className="cursor-pointer">
                    {keyword}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {selectedKeywords.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selectedKeywords.map((keyword) => (
            <Badge key={keyword} variant="secondary" className="flex items-center gap-1">
              <span className="select-text">{keyword}</span>
              <button
                type="button"
                className="ml-1 ring-offset-background rounded-full outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                onClick={() => handleRemove(keyword)}
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}
    </div>
  )
}

export default KeywordSearch

