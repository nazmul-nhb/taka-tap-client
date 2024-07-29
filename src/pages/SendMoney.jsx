import { useEffect } from "react";
import { FaMobileRetro } from "react-icons/fa6";
import { useForm } from "react-hook-form";
import { TbCoinTaka } from "react-icons/tb";
import toast from "react-hot-toast";
import moment from "moment";
import useVerifyUser from "../hooks/useVerifyUser";
import useAxiosSecure from "../hooks/useAxiosSecure";
import Swal from "sweetalert2";

const SendMoney = () => {
	const verifyPIN = useVerifyUser();
	const axiosSecure = useAxiosSecure();

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm();

	/**
	 * @param {function} sendMoney - Function to send money
	 * @param {object} info - Transaction info
	 **/
	const sendMoney = (info) => {
		axiosSecure
			.post(`/transactions/send`, info)
			.then((res) => {
				if (res?.success) {
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

	// send money with pin verification
	const handleSendMoney = (info) => {
		const sendMoneyInfo = {
			amount: parseInt(info.amount),
			receiver: info.number,
			request_type: "send-money",
			time: moment().format(),
		};
		// verify pin and send money
		verifyPIN(sendMoney, sendMoneyInfo);
	};

	// show input errors as toasts
	useEffect(() => {
		if (errors.amount) {
			toast.error(errors.amount.message, { duration: 2000 });
			return;
		}
		if (errors.mobile) {
			toast.error(errors.mobile.message, { duration: 2000 });
			return;
		}
	}, [errors.mobile, errors.amount]);

	return (
		<section className="m-4 md:m-8 flex flex-col lg:flex-row justify-between gap-6">
			<form
				onSubmit={handleSubmit(handleSendMoney)}
				className="lg:w-2/5 flex flex-col gap-5 items-center w-full mx-auto bg-transOrange p-6 rounded-md shadow-md shadow-transYellow"
			>
				{/* Amount */}
				<div className="w-full flex items-center gap-2 rounded-lg bg-transparent border-transYellow border shadow-md shadow-transYellow">
					<label
						htmlFor="amount"
						className="flex items-center gap-1 pl-2 sm:w-24"
					>
						<TbCoinTaka />
						<span className="hidden sm:inline">Amount</span>
					</label>
					<input
						{...register("amount", {
							required: {
								value: true,
								message: "Amount is required!",
							},
							min: {
								value: 50,
								message: "Cash Out at least 50 BDT",
							},
						})}
						name="amount"
						id="amount"
						type="number"
						placeholder="Cash in Amount"
						className="px-2 rounded-r-lg py-2 w-full border-l bg-transparent focus:outline-0 text-white"
					/>
				</div>
				{/* Mobile */}
				<div className="w-full flex items-center gap-2 rounded-lg bg-transparent border-transYellow border shadow-md shadow-transYellow">
					<label
						htmlFor="mobile"
						className="flex items-center gap-1 pl-2 sm:w-24"
					>
						<FaMobileRetro />
						<span className="hidden sm:inline">Receiver</span>
					</label>
					<input
						{...register("mobile", {
							required: {
								value: true,
								message: "Receiver's Mobile is required!",
							},
							pattern: {
								value: /^01\d{9}$/,
								message: "Provide a valid 11 digit number!",
							},
						})}
						name="mobile"
						id="mobile"
						type="number"
						placeholder="Receiver's Mobile Number"
						className="px-2 rounded-r-lg py-2 w-full border-l bg-transparent focus:outline-0 text-white"
					/>
				</div>

				{/* Submit Button */}
				<button
					type="submit"
					className="flex items-center gap-1 px-3 py-1 text-xl md:text-2xl border border-transYellow rounded-3xl hover:text-takaOrange hover:bg-white hover:scale-105 transition-all duration-700 font-semibold shadow-md shadow-transYellow"
				>
					Send Money
				</button>
			</form>
		</section>
	);
};

export default SendMoney;
