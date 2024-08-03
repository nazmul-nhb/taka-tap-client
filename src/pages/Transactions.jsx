import { Helmet } from "react-helmet-async";
import useGetTransactionHistory from "../hooks/useGetTransactionHistory";

const Transactions = () => {
	const { data: transactionData } = useGetTransactionHistory(
		["transactionData"],
		""
	);

	return (
		<section className="m-4 md:m-8">
			<Helmet>
				<title>Transaction History - TakaTap</title>
			</Helmet>
			{transactionData.map((td) => (
				<ul key={td._id}>
					<li>{td.name}</li>
					<li>{td.mobile}</li>
					<li>{td.transactionID}</li>
					<li>{td.amount}</li>
					<li>{td.request_status}</li>
					<hr />
				</ul>
			))}
		</section>
	);
};

export default Transactions;
