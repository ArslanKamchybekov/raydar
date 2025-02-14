"use client";

import { useState } from "react";

import { Input } from "@/components/ui/input";
import { useReports } from "@/utils/hook/useReports";
import { Loader2 } from "lucide-react";
import { ReportRequest } from "./ReportRequest";
import { $Enums } from "@prisma/client";
import { ReportStatus as CustomReportStatus } from "@/types/types";

export function ReportsList() {
  const [searchTerm, setSearchTerm] = useState("");
  const { data: reports, isLoading, error } = useReports();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
      </div>
    );
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  const filteredReports =
    reports?.filter(
      (report) =>
        report.user_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        report.item_id.toLowerCase().includes(searchTerm.toLowerCase())
    ) ?? [];

  return (
    <div className="space-y-4">
      <Input
        type="text"
        placeholder="Search by user or item..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-4"
      />
      {filteredReports.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {filteredReports.map((report) => (
            <ReportRequest
              key={report.id}
              report={{
                ...report,
                status: report.status as CustomReportStatus,
              }}
            />
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500">No reports found.</p>
      )}
    </div>
  );
}
