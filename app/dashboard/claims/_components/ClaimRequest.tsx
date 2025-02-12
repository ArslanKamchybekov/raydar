"use client";

import { useState } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle, Check, Clock, X } from "lucide-react";
import { Claim, ClaimStatus } from "@/types/types";
import { useUser } from "@/utils/hook/useUser";
import { useItem } from "@/utils/hook/useItem";
import { Textarea } from "@/components/ui/textarea";
import ImageWithZoom from "@/components/image-zoom";
import { updateClaimStatus } from "@/app/actions/claims";

export function ClaimRequest({ claim }: { claim: Claim }) {
  const [status, setStatus] = useState(claim.status);
  const [isProcessing, setIsProcessing] = useState(false);
  const [adminNote, setAdminNote] = useState("");
  const [error, setError] = useState("");
  
  const { user, isLoading: isUserLoading } = useUser(claim.user_id);
  const { item, isLoading: isItemLoading } = useItem(claim.item_id);

  const handleApprove = async () => {
    try {
      setIsProcessing(true);
      setError("");
      await updateClaimStatus(claim.id, ClaimStatus.APPROVED, adminNote);
      setStatus(ClaimStatus.APPROVED);
    } catch (err) {
      setError("Failed to approve claim request. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReject = async () => {
    try {
      setIsProcessing(true);
      setError("");
      await updateClaimStatus(claim.id, ClaimStatus.REJECTED, adminNote);
      setStatus(ClaimStatus.REJECTED);
    } catch (err) {
      setError("Failed to reject claim request. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  if (isUserLoading || isItemLoading) {
    return (
      <Card className="max-w-2xl w-full">
        <CardContent className="p-6">
          <div className="space-y-4">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="max-w-2xl w-full">
      <CardHeader>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2">
          <CardTitle className="text-lg">Claim Request #{claim.id}</CardTitle>
          <Badge 
            variant={status === "pending" ? "secondary" : status === "approved" ? "default" : "destructive"}
            className="flex items-center gap-1"
          >
            {status === "pending" ? <Clock className="h-3 w-3" /> : 
             status === "approved" ? <Check className="h-3 w-3" /> :
             <X className="h-3 w-3" />}
            {status[0].toUpperCase() + status.slice(1)}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div>
          <h3 className="font-medium text-sm mb-2">Found Item Details</h3>
          <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded-lg flex flex-col md:flex-row gap-4">
            <ImageWithZoom src={item?.image || "/logo.png"} alt="Found Item"/>
            <div className="flex-1 grid grid-cols-2 gap-2">
              <div>
                <p className="text-xs text-gray-500">Description</p>
                <p className="text-sm">{item?.description}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Location</p>
                <p className="text-sm">{item?.location}</p>
              </div>
            </div>
          </div>
        </div>

        <div>
          <h3 className="font-medium text-sm mb-2">Claimant Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
            <div>
              <p className="text-xs text-gray-500">Name</p>
              <p className="text-sm font-medium">{user?.full_name}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Email</p>
              <p className="text-sm font-medium">{user?.emailAddress}</p>
            </div>
          </div>
        </div>

        {status === "pending" && (
          <div>
            <h3 className="font-medium text-sm mb-2">Admin Notes</h3>
            <Textarea
              placeholder="Add notes about your decision (optional)"
              value={adminNote}
              onChange={(e) => setAdminNote(e.target.value)}
              className="min-h-[80px]"
            />
          </div>
        )}

        {error && (
          <div className="text-sm text-red-500 flex items-center gap-2">
            <AlertCircle className="h-4 w-4" />
            {error}
          </div>
        )}
      </CardContent>

      {status === "pending" && (
        <CardFooter className="flex flex-col md:flex-row justify-end gap-2">
          <Button onClick={handleReject} variant="outline" disabled={isProcessing} className="w-full md:w-auto">
            {isProcessing ? "Processing..." : "Reject Claim"}
          </Button>
          <Button onClick={handleApprove} variant="default" disabled={isProcessing} className="w-full md:w-auto">
            {isProcessing ? "Processing..." : "Approve Claim"}
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}
