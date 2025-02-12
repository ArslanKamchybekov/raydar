import { useQuery } from "@tanstack/react-query";
import { getFoundItem } from "@/app/actions/foundItems";

export const useItem = (id?: string) => {
    const { data: item, isLoading, error } = useQuery({
        queryKey: id ? ["item", id] : ["currentItem"],
        queryFn: async () => {
            return id ? getFoundItem(id) : null;
        }
    });
    return { item, isLoading, error };
}
