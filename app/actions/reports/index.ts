"use server";

import { prisma } from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { ReportStatus } from "@/types/types";

export async function getReports() {
  try {
    const reports = await prisma.report.findMany({
      orderBy: {
        created_at: "desc",
      },
      include: {
        user: {
          select: {
            full_name: true,
            emailAddress: true,
            image: true,
          },
        },
        item: true,
      },
    });

    console.log("Fetched reports:", reports); // Add this for debugging
    return reports;
  } catch (error) {
    console.error("Error fetching reports:", error);
    throw new Error("Failed to fetch reports");
  }
}

export async function createReport(
  item_id: string,
  reason: string,
  status: ReportStatus = ReportStatus.PENDING
) {
  const user = await currentUser();
  if (!user) {
    throw new Error("User not found");
  }

  try {
    // First find the user in our database to get their internal ID
    const dbUser = await prisma.user.findUnique({
      where: { user_id: user.id },
    });

    if (!dbUser) {
      throw new Error("User not found in database");
    }

    const newReport = await prisma.report.create({
      data: {
        user_id: dbUser.user_id, // Use the user_id from our database
        item_id,
        reason,
        status,
      },
      include: {
        user: true,
        item: true,
      },
    });

    console.log("Created report:", newReport); // Add this for debugging
    return newReport;
  } catch (error) {
    console.error("Error creating report:", error);
    throw new Error("Failed to create report");
  }
}

export async function updateReportStatus(
  reportId: string,
  status: ReportStatus,
  adminNote: string
) {
  try {
    const updatedReport = await prisma.report.update({
      where: {
        id: reportId,
      },
      data: {
        status: status,
        notes: adminNote || null,
      },
    });

    if (status === ReportStatus.RESOLVED) {
      // Handle the case when a report is resolved
    }

    return updatedReport;
  } catch (error) {
    console.error("Error updating report status:", error);
    throw new Error("Failed to update report status");
  }
}
