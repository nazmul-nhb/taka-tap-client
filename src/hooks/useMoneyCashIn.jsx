import useAxiosSecure from "./useAxiosSecure"
import toast from "react-hot-toast";
import Swal from "sweetalert2";

const useMoneyCashIn = () => {
    const axiosSecure = useAxiosSecure();

    /**
     * Make a cash in.
     *
     * @param {string} amount - Cash in amount.
     * @param {object} transactionInfo - Transaction info as { agent, cash_in_time }.
     */

    const moneyCashIn = (amount, transactionInfo) => {

        axiosSecure.post(`/transactions/in/${amount}`, transactionInfo)
            .then(res => {
                if (res?.success) {
                    toast.success(res?.message);
                } else {
                    toast.error(res?.message);
                }
            })
            .catch(error => {
                console.error(error);
                if (error) {
                    Swal.fire({
                        title: 'Error!!',
                        text: error?.message,
                        icon: 'error',
                        confirmButtonText: 'Close',
                        color: '#fff',
                        background: '#f15d24de'
                    })
                }
            })
    }

    return moneyCashIn;
};

export default useMoneyCashIn;