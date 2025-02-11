"use client"

import { useState } from "react"
import { ClaimItem } from "./Claim"
import { Input } from "@/components/ui/input"

const mockClaims = [
  { 
    id: "id", 
    user_id: "John Doe", 
    item_id: "item_id",
    date: "2025-02-10", 
    status: "pending" as "pending" | "approved" | "rejected"
  },
]

export function ClaimsList() {
  const [searchTerm, setSearchTerm] = useState("")

  const filteredClaims = mockClaims.filter(
    (claim) =>
      claim.user_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      claim.item_id.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-4">
      <Input
        type="text"
        placeholder="Search by user or item..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-4"
      />
      {filteredClaims.length > 0 ? (
        filteredClaims.map((claim) => <ClaimItem key={claim.id} claim={claim} />)
      ) : (
        <p className="text-center text-gray-500">No matching claims found.</p>
      )}
    </div>
  )
}

