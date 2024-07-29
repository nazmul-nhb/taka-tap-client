import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../hooks/useAxiosSecure";
import TakaTable from "../components/TakaTable";
import { FaUserTie } from "react-icons/fa";
import { FaMobileRetro } from "react-icons/fa6";
import Loader from "../shared/Loader";
import { useForm } from "react-hook-form";
import { TbCoinTaka } from "react-icons/tb";
import toast from "react-hot-toast";
import moment from "moment";
import useTransactionRequest from "../hooks/useTransactionRequest";

const CashOut = () => {
	const [agentNumber, setAgentNumber] = useState("");
	const axiosSecure = useAxiosSecure();
	const sendRequest = useTransactionRequest();

	const {
		register,
		handleSubmit,
		setValue,
		formState: { errors },
	} = useForm();

	const { data: agents = [], isLoading: isAgentsLoading } = useQuery({
		queryKey: ["agents"],
		queryFn: async () => {
			const { data } = await axiosSecure(`users/agents`);
			return data;
		},
	});

	const handleAgentNumberChange = (e) => {
		setAgentNumber(e.target.value);
	};

	const handleCashOutRequest = (info) => {
		const transInfo = {
			amount: parseInt(info.amount),
			agent: info.mobile,
			request_type: "cash-out",
			request_time: moment().format(),
			request_status: "pending",
		};

		sendRequest(transInfo);
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

	const agentsWithSerial = agents?.map((agent, index) => ({
		...agent,
		serial: index + 1,
	}));

	const agentData = useMemo(() => agentsWithSerial, [agentsWithSerial]);

	/** @type import('@tanstack/react-table').ColumnDef<any> */
	const agentColumns = [
		{
			header: "#",
			accessorKey: "serial",
		},
		{
			header: "Agent Name",
			accessorKey: "name",
			cell: (cell) => {
				const { mobile, name } = cell.row.original;
				return (
					<>
						{
							<button
								className={`flex items-center gap-0.5 hover:text-red-900 transition-all duration-500 mx-auto`}
								onClick={() => setAgentNumber(mobile)}
							>
								<FaUserTie /> {name}
							</button>
						}
					</>
				);
			},
		},
		{
			header: "Mobile",
			accessorKey: "mobile",
			cell: (cell) => {
				const { mobile } = cell.row.original;
				return (
					<>
						{
							<button
								className={`flex items-center gap-0.5 hover:text-red-900 transition-all duration-500 mx-auto`}
								onClick={() => setAgentNumber(mobile)}
							>
								<FaMobileRetro /> {mobile}
							</button>
						}
					</>
				);
			},
		},
	];

	if (isAgentsLoading) return <Loader />;

	return (
		<section className="m-4 md:m-8 flex flex-col lg:flex-row justify-between gap-6">
			<form
				onSubmit={handleSubmit(handleCashOutRequest)}
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
						<span className="hidden sm:inline">Agent</span>
					</label>
					<input
						{...register("mobile", {
							required: {
								value: true,
								message: "Agent number is required!",
							},
							pattern: {
								value: /^01\d{9}$/,
								message: "Provide a valid 11 digit number!",
							},
						})}
						onChange={handleAgentNumberChange}
						value={agentNumber}
						name="mobile"
						id="mobile"
						type="number"
						placeholder="Agent Mobile Number"
						className="px-2 rounded-r-lg py-2 w-full border-l bg-transparent focus:outline-0 text-white"
					/>
				</div>

				{/* Submit Button */}
				<button
					onClick={() => {
						setAgentNumber(agentNumber);
						setValue("mobile", agentNumber);
					}}
					type="submit"
					className="flex items-center gap-1 px-3 py-1 text-xl md:text-2xl border border-transYellow rounded-3xl hover:text-takaOrange hover:bg-white hover:scale-105 transition-all duration-700 font-semibold shadow-md shadow-transYellow"
				>
					Request Cash-Out
				</button>
			</form>
			<div className="lg:w-3/5">
				<TakaTable data={agentData} columns={agentColumns} />
			</div>
		</section>
	);
};

export default CashOut;
