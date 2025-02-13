import { useQuery } from "@tanstack/react-query";
import { getFoundItem, getFoundItems } from "@/app/actions/foundItems";

export const useItem = (id?: string) => {
    const { data: item, isLoading, error } = useQuery({
        queryKey: ["item", id],
        queryFn: async () => id ? getFoundItem(id) : null,
        enabled: !!id,
    });

    return { item, isLoading, error };
};


export const useItems = () => {
    const { data: items, isLoading, error } = useQuery({
        queryKey: ["items"],
        queryFn: getFoundItems,
        staleTime: 5 * 60 * 1000,
        refetchOnWindowFocus: false,
    });

    return { items, isLoading, error };
};
