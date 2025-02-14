import { useQuery } from "@tanstack/react-query";
import { Report } from "@/types/types";
import { getReports } from "@/app/actions/reports";

export function useReports() {
  return useQuery({
    queryKey: ["reports"],
    queryFn: getReports,
    refetchInterval: 5000, // Refetch every 5 seconds
    staleTime: 0, // Consider data stale immediately
  });
}
