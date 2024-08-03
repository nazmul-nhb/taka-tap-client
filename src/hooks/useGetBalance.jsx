import useAuth from "../hooks/useAuth";
import useAxiosSecure from "./useAxiosSecure";
import { useQuery } from "@tanstack/react-query";

const useGetBalance = () => {
	const { currentUser, userLoading } = useAuth();
	const axiosSecure = useAxiosSecure();

	const {
		data: balance = 0,
		refetch: balanceRefetch,
		isLoading: balanceLoading,
	} = useQuery({
		queryKey: ["balance", currentUser?.email],
		enabled: !userLoading && !!currentUser?.email,
		queryFn: async () => {
			const { data } = await axiosSecure.get(
				`/users/single?email=${currentUser?.email}`
			);
			return data?.balance;
		},
    });

    return { balance, balanceRefetch, balanceLoading };
};

export default useGetBalance;
