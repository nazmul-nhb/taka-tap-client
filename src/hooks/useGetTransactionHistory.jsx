import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "./useAxiosSecure";

/**
 * @param {string[]} queryKey - Query keys for useQuery
 * @param {string} queryString - Query parameters
 **/

const useGetTransactionHistory = (queryKey, queryString) => {
	const axiosSecure = useAxiosSecure();

	const {
		data = [],
		isLoading: transactionLoading,
		isError,
		error,
	} = useQuery({
		queryKey: [...queryKey, queryString],

		queryFn: async () => {
			const { data } = await axiosSecure(`/transactions?${queryString}`);
			return data;
		},
	});

	return { data, transactionLoading, isError, error };
};

export default useGetTransactionHistory;
