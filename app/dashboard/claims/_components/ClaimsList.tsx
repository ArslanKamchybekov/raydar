"use client"

import { useState } from "react"
import { ClaimRequest } from "./ClaimRequest"
import { Input } from "@/components/ui/input"
import { useClaim } from "@/utils/hook/useClaim"
import { Loader2 } from "lucide-react"

export function ClaimsList() {
  const [searchTerm, setSearchTerm] = useState("")    
  
  const { claims, isLoading } = useClaim()

  if (isLoading || !claims) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
      </div>
    )
  }

  const filteredClaims = claims.filter(
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
        filteredClaims.map((claim) => <ClaimRequest key={claim.id} claim={claim} />)
      ) : (
        <p className="text-center text-gray-500">No claims found.</p>
      )}
    </div>
  )
}

