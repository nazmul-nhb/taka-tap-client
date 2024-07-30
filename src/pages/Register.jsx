import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import useAuth from "../hooks/useAuth";
import { useLocation, useNavigate } from "react-router-dom";
import { MdEmail, MdSwitchAccount } from "react-icons/md";
import { FaEye, FaEyeSlash, FaMobileRetro } from "react-icons/fa6";
import { RiLockPasswordFill } from "react-icons/ri";
import { FaUserEdit } from "react-icons/fa";
import Swal from "sweetalert2";
import { Helmet } from "react-helmet-async";

const Register = () => {
    const [showPassword, setShowPassword] = useState(false);
    const { registerUser, currentUser } = useAuth();
    const { register, handleSubmit, formState: { errors } } = useForm();
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || "/";

    // redirect logged in user
    useEffect(() => {
        if (currentUser) {
            navigate(from, { replace: true });
        }
    }, [currentUser, from, navigate]);

    // register user
    const handleRegister = async (userInfo) => {
        try {
            // show loading spinner
            Swal.fire({
                title: 'Registering...',
                text: 'Please wait for a while...',
                allowOutsideClick: false,
                background: '#f15d24ee',
                color: '#fff',
                didOpen: () => {
                    Swal.showLoading();
                }
            });

            const res = await registerUser(userInfo);

            // hide loading spinner
            Swal.hideLoading();
            Swal.close();

            if (res?.insertedId) {
                toast.success("Registration Successful!");
                toast.success("Wait for Admin Approval!");
                navigate('/login')
            } else {
                toast.error(res?.message);
                Swal.fire({
                    title: 'Error!',
                    text: res?.message,
                    icon: 'error',
                    confirmButtonText: 'Close',
                    confirmButtonColor: 'red',
                    color: '#fff',
                    background: '#f15d24ee'
                });
            }
        } catch (error) {
            console.error(error);
            toast.error('Something Went Wrong!');
            Swal.fire({
                title: 'Error!',
                text: 'Something Went Wrong!',
                icon: 'error',
                confirmButtonText: 'Close',
                confirmButtonColor: 'red',
                color: '#fff',
                background: '#f15d24ee'
            });
        }
    };

    // show input errors as toasts
    useEffect(() => {
        if (errors.name) {
            toast.error(errors.name.message, { duration: 2000 });
            return;
        }
        if (errors.pin) {
            toast.error(errors.pin.message, { duration: 2000 });
            return;
        }
        if (errors.mobile) {
            toast.error(errors.mobile.message, { duration: 2000 });
            return;
        }
        if (errors.email) {
            toast.error(errors.email.message, { duration: 2000 });
            return;
        }
        if (errors.account_type) {
            toast.error(errors.account_type.message, { duration: 2000 });
            return;
        }
    }, [errors.account_type, errors.email, errors.mobile, errors.name, errors.pin]);

    return (
		<section className="m-8">
			<Helmet>
				<title>Register - TakaTap</title>
			</Helmet>
			<form
				onSubmit={handleSubmit(handleRegister)}
				className="md:w-3/5 lg:w-2/5 flex flex-col gap-5 items-center justify-between w-full mx-auto bg-transOrange p-6 rounded-md shadow-md shadow-transYellow"
			>
				{/* Name */}
				<div className="w-full flex items-center gap-2 rounded-lg bg-transparent border-transYellow border shadow-md shadow-transYellow">
					<label
						htmlFor="name"
						className="flex items-center gap-1 pl-2 sm:w-24"
					>
						<FaUserEdit />
						<span className="hidden sm:inline">Name</span>
					</label>
					<input
						{...register("name", {
							required: {
								value: true,
								message: "Name is required!",
							},
						})}
						name="name"
						id="name"
						type="text"
						placeholder="Your Name"
						className="px-2 rounded-r-lg py-2 w-full border-l bg-transparent focus:outline-0 text-white"
					/>
				</div>

				{/* PIN */}
				<div className="w-full flex items-center gap-2 rounded-lg bg-transparent border-transYellow border shadow-md shadow-transYellow">
					<label
						htmlFor="pin"
						className="flex items-center gap-1 pl-2 sm:w-24"
					>
						<RiLockPasswordFill />
						<span className="hidden sm:inline">PIN</span>
					</label>
					<div className="relative w-full">
						<input
							{...register("pin", {
								required: {
									value: true,
									message: "Provide a valid PIN!",
								},
								minLength: {
									value: 5,
									message: "PIN must be 5 digits!",
								},
								maxLength: {
									value: 5,
									message: "PIN must be 5 digits!",
								},
							})}
							className="px-2 rounded-r-lg py-2 w-full border-l bg-transparent focus:outline-0 text-white"
							type={showPassword ? "text" : "password"}
							name="pin"
							id="pin"
							placeholder="Choose a 5 digit PIN"
						/>
						<span
							className="absolute top-1/2 right-2 -translate-y-1/2 cursor-pointer"
							onClick={() => setShowPassword(!showPassword)}
						>
							{showPassword ? <FaEyeSlash /> : <FaEye />}
						</span>
					</div>
				</div>

				{/* Mobile */}
				<div className="w-full flex items-center gap-2 rounded-lg bg-transparent border-transYellow border shadow-md shadow-transYellow">
					<label
						htmlFor="mobile"
						className="flex items-center gap-1 pl-2 sm:w-24"
					>
						<FaMobileRetro />
						<span className="hidden sm:inline">Mobile</span>
					</label>
					<input
						{...register("mobile", {
							required: {
								value: true,
								message: "Mobile number is required!",
							},
							pattern: {
								value: /^01\d{9}$/,
								message: "Provide a valid 11 digit number!",
							},
						})}
						name="mobile"
						id="mobile"
						type="number"
						placeholder="Your Mobile"
						className="px-2 rounded-r-lg py-2 w-full border-l bg-transparent focus:outline-0 text-white"
					/>
				</div>

				{/* Email */}
				<div className="w-full flex items-center gap-2 rounded-lg bg-transparent border-transYellow border shadow-md shadow-transYellow">
					<label
						htmlFor="email"
						className="flex items-center gap-1 pl-2 sm:w-24"
					>
						<MdEmail />
						<span className="hidden sm:inline">Email</span>
					</label>
					<input
						{...register("email", {
							required: {
								value: true,
								message: "Email is required!",
							},
							pattern: {
								value: /^\S+@\S+$/i,
								message: "Invalid email format!",
							},
						})}
						name="email"
						id="email"
						type="email"
						placeholder="Your Email"
						className="px-2 rounded-r-lg py-2 w-full border-l bg-transparent focus:outline-0 text-white"
					/>
				</div>

				{/* Account Type */}
				<div className="w-full flex items-center gap-2 rounded-lg bg-transparent border-transYellow border shadow-md shadow-transYellow">
					<label
						htmlFor="account_type"
						className="flex items-center gap-1 pl-2 whitespace-pre sm:w-24"
					>
						<MdSwitchAccount />
						<span className="hidden sm:inline">Account</span>
					</label>
					<select
						{...register("account_type", {
							required: {
								value: true,
								message: "Account type is required!",
							},
						})}
						name="account_type"
						id="account_type"
						className="px-2 rounded-r-lg py-2 w-full border-l bg-transOrange focus:outline-0 text-white"
					>
						<option className="text-gray-300" value="">
							Select Account Type
						</option>
						<option value="user">User</option>
						<option value="agent">Agent</option>
					</select>
				</div>

				{/* Submit Button */}
				<button
					type="submit"
					className="flex items-center gap-1 px-3 py-1 text-xl md:text-2xl border border-transYellow rounded-3xl hover:text-takaOrange hover:bg-white hover:scale-105 transition-all duration-700 font-semibold shadow-md shadow-transYellow"
				>
					Register
				</button>
			</form>
		</section>
	);
};

export default Register;