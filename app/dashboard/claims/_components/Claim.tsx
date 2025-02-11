"use client"

import { useState } from "react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Claim } from "@/types/types"

export function ClaimItem({ claim }: { claim: Claim }) {
  const [status, setStatus] = useState(claim.status)

  const handleApprove = async () => {
    // await approveClaim(claim.id)
    setStatus("approved")
  }

  const handleReject = async () => {
    // await rejectClaim(claim.id)
    setStatus("rejected")
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Claim #{claim.id}</CardTitle>
      </CardHeader>
      <CardContent>
        <p>
          <strong>User:</strong> {claim.user_id}
        </p>
        <p>
          <strong>Item:</strong> {claim.item_id}
        </p>
        <p>
          <strong>Date:</strong> {claim.date}
        </p>
        <p>
          <strong>Status:</strong> {status}
        </p>
      </CardContent>
      <CardFooter className="flex justify-end space-x-2">
        {status === "pending" && (
          <>
            <Button onClick={handleApprove} variant="default">
              Approve
            </Button>
            <Button onClick={handleReject} variant="outline">
              Reject
            </Button>
          </>
        )}
      </CardFooter>
    </Card>
  )
}

