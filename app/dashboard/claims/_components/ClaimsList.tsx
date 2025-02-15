"use client";

import { useState } from "react";
import { ClaimRequest } from "./ClaimRequest";
import { Input } from "@/components/ui/input";
import { useClaim } from "@/utils/hook/useClaim";
import Spinner from "@/components/spinner";

export function ClaimsList() {
  const [searchTerm, setSearchTerm] = useState("");    
  const { claims, isLoading } = useClaim();

  if (isLoading || !claims) {
    return <Spinner/>
  }

  const filteredClaims = claims.filter(
    (claim) =>
      claim.user_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      claim.item_id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <Input
        type="text"
        placeholder="Search by user or item..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-4"
      />
      {filteredClaims.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {filteredClaims.map((claim) => (
            <ClaimRequest key={claim.id} claim={claim} />
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500">No claim requests found.</p>
      )}
    </div>
  );
}
