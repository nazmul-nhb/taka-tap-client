import toast from "react-hot-toast";
import PropTypes from "prop-types";
import { jwtDecode } from "jwt-decode";
import { createContext, useEffect, useState } from "react";
import useAxiosPublic from "../hooks/useAxiosPublic";
import Swal from "sweetalert2";

export const AuthContext = createContext(null);

const AuthProvider = ({ children }) => {
	const [currentUser, setCurrentUser] = useState(null);
	const [userLoading, setUserLoading] = useState(true);
	const axiosPublic = useAxiosPublic();

	// set user from token if already logged in
	useEffect(() => {
		const token = localStorage.getItem("taka-token");
		if (token) {
			const decodedUser = jwtDecode(token);
			setCurrentUser(decodedUser);
		}
		setUserLoading(false);
	}, []);

	// register function
	const registerUser = async (user) => {
		try {
			const { data } = await axiosPublic.post(`/auth/register`, user);
			return data;
		} catch (error) {
			console.error(error);

			if (error.response) {
				return {
					success: false,
					message:
						error.response.data?.message || "Registration Failed!",
					status: error.response.status || 500,
				};
			}

			// If the error doesn't have a response (e.g. network error)
			return {
				success: false,
				message: error.response.data?.message || "Registration Error!",
				status: 500,
			};
		}
	};

	// console.log(currentUser);

	const login = async (credential, pin) => {
		setUserLoading(true);
		try {
			const { data } = await axiosPublic.post(`/auth/login`, {
				credential,
				pin,
			});
			if (data?.success) {
				localStorage.setItem("taka-token", data?.token);
				const decodedUser = jwtDecode(data?.token);
				setCurrentUser(decodedUser);
				setUserLoading(false);
				return data;
			} else {
				return data;
			}
		} catch (error) {
			console.error(error);
			setUserLoading(false);
			if (error.response) {
				return {
					success: false,
					message: error.response.data?.message || "Login Failed!",
					status: error.response.status || 500,
				};
			}

			// If the error doesn't have a response (e.g. network error)
			return {
				success: false,
				message: error.response.data?.message || "Login Error!",
				status: 500,
			};
		}
	};

	const logOut = () => {
		if (currentUser) {
			Swal.fire({
				title: "Are You Sure?",
				text: `Want to Log Out Now?`,
				icon: "warning",
				showCancelButton: true,
				confirmButtonColor: "#ff0000",
				cancelButtonColor: "#2a7947",
				confirmButtonText: "Log Out!",
				color: "#fff",
				background: "#f15d24ee",
			}).then((result) => {
				if (result.isConfirmed) {
					localStorage.removeItem("taka-token");
					setCurrentUser(null);
					toast.success("Logged Out Successfully!");
				}
			});
		} else {
			toast.error("No User Logged In!");
		}
	};

	const authInfo = { currentUser, userLoading, registerUser, login, logOut };

	return (
		<AuthContext.Provider value={authInfo}>
			{children}
		</AuthContext.Provider>
	);
};

AuthProvider.propTypes = {
	children: PropTypes.node,
};

export default AuthProvider;
