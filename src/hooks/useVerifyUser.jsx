import Swal from "sweetalert2";
import useAxiosSecure from "./useAxiosSecure";
import toast from "react-hot-toast";

const useVerifyUser = () => {
	const axiosSecure = useAxiosSecure();

	/**
	 * Verify User PIN before a transaction.
	 *
	 * @param {function} proceedTransaction - Send Money or Cash Out Function
	 * @param {object} transactionInfo - Transaction info
     * 
	 */

	const verifyPIN = (proceedTransaction, transactionInfo) => {
		Swal.fire({
			title: "Verify PIN!",
			text: "Enter Your PIN!",
			// icon: "info",
			input: "password",
			color: "#fff",
			inputPlaceholder: "Enter Your PIN!",
			background: "#f15d24ee",
			inputAttributes: {
				autocapitalize: "off",
			},
			showCancelButton: true,
			confirmButtonText: "Submit",
			showLoaderOnConfirm: true,
			preConfirm: async (pin) => {
				try {
					const res = await axiosSecure.post(`/auth/verify`, { pin });
					// console.log(secretResponse);
					if (!res?.data?.success) {
						toast.error(res?.data?.message);
						Swal.showValidationMessage("Invalid PIN! Try Again!");
						return false;
                    }
                    // else {
					// 	return toast.success(res?.data?.message);
					// }
				} catch (error) {
					// console.error(error);
					if (error?.response && error?.response?.status === 500) {
						toast.error(error.response.data.message);
						Swal.showValidationMessage("Server Error! Try Again!");
						return false;
					} else {
						toast.error("Error Occurred! Try Again!");
						Swal.showValidationMessage(
							"Error Occurred! Try Again!"
						);
						return false;
					}
				}
			},
			allowOutsideClick: () => !Swal.isLoading(),
        }).then((result) => {
			if (result.isConfirmed) {
				proceedTransaction(transactionInfo);
			}
		});
	};

	return verifyPIN;
};

export default useVerifyUser;
