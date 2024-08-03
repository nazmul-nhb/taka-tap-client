import { useState } from "react";
import Loader from "../shared/Loader";
import { Helmet } from "react-helmet-async";
import useGetBalance from "../hooks/useGetBalance";
import useGetUserType from "../hooks/useGetUserType";

const Home = () => {
	const [showBalance, setShowBalance] = useState(false);
	const { userType } = useGetUserType();
	const { balance, balanceRefetch, balanceLoading } = useGetBalance();

	const handleShowBalance = () => {
		setShowBalance(!showBalance);
		if (showBalance) {
			balanceRefetch();
		}
	};

	if (balanceLoading) return <Loader />;

	return (
		<section>
			<Helmet>
				<title>Home - TakaTap</title>
			</Helmet>
			<div
				className="cursor-pointer flex items-center justify-center text-2xl"
				onClick={handleShowBalance}
			>
				{userType !== "admin" &&
					(showBalance ? balance : "Check Balance")}
			</div>
		</section>
	);
};

export default Home;
