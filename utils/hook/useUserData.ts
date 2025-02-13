import { useQuery } from "@tanstack/react-query";
import { getUserData, getCurrentUserData } from "@/app/actions/user";

export const useUserData = (user_id?: string) => {
  const { data: user, isLoading, error } = useQuery({
    queryKey: user_id ? ["user", user_id] : ["currentUser"],
    queryFn: async () => {
      return user_id ? getUserData(user_id) : getCurrentUserData();
    },
    enabled: user_id !== undefined || typeof window !== "undefined",
  });

  return { user, isLoading, error };
};
