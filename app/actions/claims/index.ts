'use server'

import { supabase } from "@/lib/supabase";
import { prisma } from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { ClaimStatus } from "@/types/types";

export async function getClaims() {
    try {
        const claims = await prisma.claim.findMany({
            include: {
                user: true,
                item: true,
            },
        });
        return claims;
    } catch (error) {
        console.error("Error fetching claims:", error);
        throw new Error("Failed to fetch claims");
    }
}

export async function createClaim(
    item_id: string,
    reason: string,
    image: File | null,
    status: ClaimStatus = ClaimStatus.PENDING
) {
    const user = await currentUser();
    if (!user) {
        throw new Error("User not found");
    }

    let imageUrl: string | null = null;

    if (image) {
        // Generate unique file name
        const fileName = `${user.id}-${Date.now()}-${image.name}`;

        // Upload to Supabase Storage
        const { data, error } = await supabase.storage
            .from("claims_images")
            .upload(fileName, image, { contentType: image.type });

        if (error) {
            console.error("Error uploading image:", error);
            throw new Error("Image upload failed");
        }

        // Get public URL
        imageUrl = supabase.storage.from("claims_images").getPublicUrl(fileName).data.publicUrl;
    }

    try {
        const newClaim = await prisma.claim.create({
            data: {
                user_id: user.id,
                item_id: item_id,
                reason: reason,
                image: imageUrl,
                status: status,
            },
        });

        return newClaim;
    } catch (error) {
        console.error("Error creating claim:", error);
        throw new Error("Failed to create claim");
    }
}

export async function updateClaimStatus(claimId: string, status: ClaimStatus, adminNote: string) {
    try {
        console.log("Updating claim status:", claimId, status, adminNote);
        const updatedClaim = await prisma.claim.update({
            where: {
                id: claimId
            },
            data: {
                status: status as ClaimStatus,
                notes: adminNote || null
            },
        });
        return updatedClaim;
    } catch (error) {
        console.error("Error updating claim status:", error);
        throw new Error("Failed to update claim status");
    }
}