import { Helmet } from "react-helmet-async";
import useGetUserType from "../hooks/useGetUserType";

const Home = () => {
	const { userType } = useGetUserType();

	return (
		<section>
			<Helmet>
				<title>Home - TakaTap</title>
			</Helmet>
			{userType}
		</section>
	);
};

export default Home;
