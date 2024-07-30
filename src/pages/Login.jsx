import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import useAuth from "../hooks/useAuth";
import toast from "react-hot-toast";
import { MdEmail } from "react-icons/md";
import { RiLockPasswordFill } from "react-icons/ri";
import { FaEye, FaEyeSlash, FaMobileRetro } from "react-icons/fa6";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { Helmet } from "react-helmet-async";

const Login = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [useEmail, setUseEmail] = useState(true);
    const { register, handleSubmit, formState: { errors } } = useForm();
    const { currentUser, userLoading, login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || "/";

    // redirect logged in user
    useEffect(() => {
        if (currentUser) {
            navigate(from, { replace: true });
        }
    }, [currentUser, from, navigate]);

    // show input errors as toasts
    useEffect(() => {
        if (errors.email) {
            toast.error(errors.email.message, { duration: 2000 });
            return;
        }
        if (errors.mobile) {
            toast.error(errors.mobile.message, { duration: 2000 });
            return;
        }
        if (errors.pin) {
            toast.error(errors.pin.message, { duration: 2000 });
            return;
        }
    }, [errors.email, errors.mobile, errors.pin]);

    // log in user
    const handleLogin = async (userInfo) => {
        const { email, mobile, pin } = userInfo;
        const credential = useEmail ? email : mobile;

        try {
            // show loading spinner
            Swal.fire({
                title: 'Logging in...',
                text: 'Please wait while we log you in.',
                allowOutsideClick: false,
                background: '#f15d24ee',
                color: '#fff',
                didOpen: () => {
                    Swal.showLoading();
                }
            });

            const res = await login(credential, pin);

            // hide loading spinner
            Swal.hideLoading();
            Swal.close();

            if (res?.success) {
                toast.success(res?.message);
                navigate('/');
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

    return (
		<section className="m-8">
			<Helmet>
				<title>Login - TakaTap</title>
			</Helmet>
			<form
				onSubmit={handleSubmit(handleLogin)}
				className="md:w-3/5 lg:w-2/5 flex flex-col gap-5 items-center justify-between w-full mx-auto bg-transOrange p-6 rounded-md shadow-md shadow-transYellow"
			>
				<h2 className="text-xl md:text-2xl font-medium font-kreonSerif">
					Login with {useEmail ? "Email" : "Mobile"} & PIN
				</h2>
				<div className="flex flex-col gap-3 w-full">
					<div className="w-full flex items-center gap-2 rounded-lg bg-transparent border-transYellow border shadow-md shadow-transYellow">
						{useEmail ? (
							<>
								<label
									htmlFor="email"
									className="flex items-center gap-1 pl-2 sm:w-24"
								>
									<MdEmail />
									<span className="hidden sm:inline">
										Email
									</span>
								</label>
								<input
									{...register("email", {
										required: {
											value: useEmail,
											message:
												"Provide your email address.",
										},
									})}
									className="px-2 rounded-r-lg py-2 w-full border-l bg-transparent focus:outline-0 text-white"
									type="email"
									name="email"
									id="email"
									placeholder="Your Email"
								/>
							</>
						) : (
							<>
								<label
									htmlFor="mobile"
									className="flex items-center gap-1 pl-2 sm:w-24"
								>
									<FaMobileRetro />
									<span className="hidden sm:inline">
										Mobile
									</span>
								</label>
								<input
									{...register("mobile", {
										required: {
											value: !useEmail,
											message:
												"Provide your mobile number.",
										},
										pattern: {
											value: /^(01)\d{9}$/,
											message:
												"Mobile number must start with 01 and be 11 digits.",
										},
									})}
									className="px-2 rounded-r-lg py-2 w-full border-l bg-transparent focus:outline-0 text-white"
									type="tel"
									name="mobile"
									id="mobile"
									placeholder="Your Mobile Number"
								/>
							</>
						)}
					</div>
					<button
						type="button"
						className="text-blue-700"
						onClick={() => setUseEmail(!useEmail)}
					>
						{useEmail ? "Use Mobile Instead" : "Use Email Instead"}
					</button>
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
									message: "Provide a valid PIN.",
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
							placeholder="Your PIN"
						/>
						<span
							className="absolute top-1/2 right-2 -translate-y-1/2 cursor-pointer"
							onClick={() => setShowPassword(!showPassword)}
						>
							{showPassword ? <FaEyeSlash /> : <FaEye />}
						</span>
					</div>
				</div>

				<button
					type="submit"
					className="flex items-center gap-1 px-3 py-1 text-xl md:text-2xl border border-transYellow rounded-3xl hover:text-takaOrange hover:bg-white hover:scale-105 transition-all duration-700 font-semibold shadow-md shadow-transYellow"
				>
					{userLoading ? "Loading..." : "Login!"}
				</button>
				<p className="text-center text-sm md:text-base font-medium">
					New to this site?{" "}
					<Link
						className="hover:pl-4 text-[#3c5cc3] font-bold hover:text-nexus-secondary transition-all duration-500"
						to={"/register"}
					>
						Register Here!
					</Link>
				</p>
			</form>
		</section>
	);
};

export default Login;
