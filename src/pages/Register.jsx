import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import useAuth from "../hooks/useAuth";
import { useLocation, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { RiLockPasswordFill } from "react-icons/ri";

const Register = () => {
    const [showPassword, setShowPassword] = useState(false);
    const { registerUser, login, currentUser } = useAuth();
    const { register, handleSubmit, reset, formState: { errors } } = useForm();
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || "/";

    useEffect(() => {
        if (currentUser) {
            navigate(from, { replace: true });
        }
    }, [currentUser, from, navigate]);

    const handleRegister = async (userInfo) => {
        try {
            userInfo.account_status = 'pending';
            const res = await registerUser(userInfo);
           
            if (res?.insertedId) {
                reset();
                toast.success("Registration Successful!");

                // after successful registration login the user
                const loginRes = await login(userInfo.mobile, userInfo.pin);
                if (loginRes?.success) {
                    toast.success(loginRes?.message);
                    navigate('/');
                } else {
                    toast.error(loginRes?.message);
                }
            } else {
                toast.error(res?.message);
            }
        } catch (error) {
            toast.error('Something Went Wrong!');
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
            <form
                onSubmit={handleSubmit(handleRegister)}
                className="flex flex-col gap-5 items-center justify-between w-full mx-auto bg-transOrange p-6 rounded-md shadow-md shadow-transYellow"
            >
                {/* Name */}
                <div className="w-full flex items-center gap-2 rounded-lg bg-transparent border-transYellow border shadow-md shadow-transYellow">
                    <label htmlFor='name' className="flex items-center gap-1 pl-2 w-24">Name</label>
                    <input
                        {...register("name", {
                            required: { value: true, message: "Name is required!" }
                        })}
                        name='name' id="name" type="text" placeholder="Your Name" className="px-2 rounded-r-lg py-2 w-full border-l bg-transparent focus:outline-0 text-white" />
                </div>

                {/* Pin */}
                <div className="w-full flex items-center gap-2 rounded-lg bg-transparent border-transYellow border shadow-md shadow-transYellow">
                    <label htmlFor="pin" className="flex items-center gap-1 pl-2 w-24"><RiLockPasswordFill />PIN</label>
                    <div className="relative w-full">
                        <input
                            {...register("pin", {
                                required: { value: true, message: "Provide a valid PIN." },
                                minLength: { value: 5, message: "PIN must be 5 digits!" },
                                maxLength: { value: 5, message: "PIN must be 5 digits!" }
                            })}
                            className="px-2 rounded-r-lg py-2 w-full border-l bg-transparent focus:outline-0 text-white" type={showPassword ? "text" : "password"} name="pin" id="pin" placeholder="Your PIN" />
                        <span className="absolute top-1/2 right-2 -translate-y-1/2 cursor-pointer" onClick={() => setShowPassword(!showPassword)}>
                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                        </span>
                    </div>
                </div>

                {/* Mobile */}
                <div className="w-full flex items-center gap-2 rounded-lg bg-transparent border-transYellow border shadow-md shadow-transYellow">
                    <label htmlFor='mobile' className="flex items-center gap-1 pl-2 w-24">Mobile</label>
                    <input
                        {...register("mobile", {
                            required: { value: true, message: "Mobile number is required!" },
                            pattern: { value: /^01\d{9}$/, message: "Provide a valid 11 digit number!" }
                        })}
                        name='mobile' id="mobile" type="number" placeholder="Your Mobile" className="px-2 rounded-r-lg py-2 w-full border-l bg-transparent focus:outline-0 text-white" />
                </div>

                {/* Email */}
                <div className="w-full flex items-center gap-2 rounded-lg bg-transparent border-transYellow border shadow-md shadow-transYellow">
                    <label htmlFor='email' className="flex items-center gap-1 pl-2 w-24">Email</label>
                    <input
                        {...register("email", {
                            required: { value: true, message: "Email is required!" },
                            pattern: { value: /^\S+@\S+$/i, message: "Invalid email format!" }
                        })}
                        name='email' id="email" type="email" placeholder="Your Email" className="px-2 rounded-r-lg py-2 w-full border-l bg-transparent focus:outline-0 text-white" />
                </div>

                {/* Account Type */}
                <div className="w-full flex items-center gap-2 rounded-lg bg-transparent border-transYellow border shadow-md shadow-transYellow">
                    <label htmlFor='account_type' className="flex items-center gap-1 pl-2 whitespace-pre w-24">Account</label>
                    <select
                        {...register("account_type", {
                            required: { value: true, message: "Account type is required!" }
                        })}
                        name='account_type' id="account_type" className="px-2 rounded-r-lg py-2 w-full border-l bg-transOrange focus:outline-0 text-white"
                    >
                        <option className="text-gray-300" value="">Select Account Type</option>
                        <option value="user">User</option>
                        <option value="agent">Agent</option>
                    </select>
                </div>

                {/* Submit Button */}
                <button type="submit" className="flex items-center gap-1 px-3 py-1 text-xl md:text-2xl border border-transYellow rounded-3xl hover:text-takaOrange hover:bg-white hover:scale-105 transition-all duration-700 font-semibold shadow-md shadow-transYellow">
                    Register
                </button>
            </form>
        </section>
    );
};

export default Register;