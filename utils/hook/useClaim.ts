import { useQuery } from "@tanstack/react-query";
import { getClaims } from "@/app/actions/claims";

export const useClaim = () => {
  const { data: claims, isLoading } = useQuery({
    queryKey: ["claims"],
    queryFn: async () => {
      const claims = await getClaims();
      return claims;
    }
  });
  return { claims, isLoading };
}



