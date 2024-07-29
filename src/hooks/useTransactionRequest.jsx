import toast from "react-hot-toast";
import useAxiosSecure from "./useAxiosSecure";
import Swal from "sweetalert2";

const useTransactionRequest = () => {
	const axiosSecure = useAxiosSecure();

	/**
	 * Make a cash-in or cash-out Request!
	 *
	 * @param {object} transactionInfo - Transaction info must have: { amount, agent, transaction_type, request_time, request_status }.
	 */

	const sendRequest = (transactionInfo) => {
		axiosSecure
			.post(`/transactions/request`, transactionInfo)
			.then((res) => {
				if (res?.data?.success) {
					toast.success(res?.data?.message);
				} else {
					toast.error(res?.data?.message);
					Swal.fire({
						title: "Error!",
						text: res?.data?.message,
						icon: "error",
						confirmButtonText: "Close",
						color: "#fff",
						background: "#f15d24ee",
					});
				}
			})
			.catch((error) => {
				console.error(error);
				if (error) {
					Swal.fire({
						title: "Error!",
						text: error?.message,
						icon: "error",
						confirmButtonText: "Close",
						color: "#fff",
						background: "#f15d24ee",
					});
				}
			});
	};

	return sendRequest;
};

export default useTransactionRequest;
