import { useQuery } from "@tanstack/react-query";
import { Report } from "@/types/types";
import { prisma } from "@/lib/prisma";

async function getReport(id: string): Promise<Report> {
  const report = await prisma.report.findUnique({
    where: { id },
    include: {
      user: true,
      item: true,
    },
  });

  if (!report) throw new Error("Report not found");
  return report as Report;
}

export function useReport(id: string) {
  return useQuery({
    queryKey: ["report", id],
    queryFn: () => getReport(id),
    enabled: !!id,
  });
}
