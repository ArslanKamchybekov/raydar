import { useQuery } from "@tanstack/react-query";
import { getAlerts } from "@/app/actions/alerts";

const getAlert = () => {
    const { data: userAlerts, isLoading } = useQuery({
        queryKey: ["alerts"],
        queryFn: () => getAlerts()
    });

    return { userAlerts, isLoading };
}

export { getAlert };