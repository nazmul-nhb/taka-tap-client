import useAxiosSecure from "./useAxiosSecure"
import toast from "react-hot-toast";
import Swal from "sweetalert2";

const useMoneyCashIn = () => {
    const axiosSecure = useAxiosSecure();

    /**
     * Make a cash in request successful!
     *
     * @param {object} transactionInfo - Transaction info must have: { amount, agent, cash_in_time }.
     */

    const moneyCashIn = (transactionInfo) => {

        axiosSecure.post(`/transactions/in`, transactionInfo)
            .then(res => {
                if (res?.success) {
                    toast.success(res?.message);
                } else {
                    toast.error(res?.message);
                    Swal.fire({
                        title: 'Error!',
                        text: res?.message,
                        icon: 'error',
                        confirmButtonText: 'Close',
                        color: '#fff',
                        background: '#f15d24ee'
                    });
                }
            })
            .catch(error => {
                console.error(error);
                if (error) {
                    Swal.fire({
                        title: 'Error!',
                        text: error?.message,
                        icon: 'error',
                        confirmButtonText: 'Close',
                        color: '#fff',
                        background: '#f15d24ee'
                    });
                }
            });
    }

    return moneyCashIn;
};

export default useMoneyCashIn;