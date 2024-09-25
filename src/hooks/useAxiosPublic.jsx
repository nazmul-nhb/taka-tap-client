import axios from "axios";

export const baseURL = import.meta.env.VITE_API_URL;

const axiosPublic = axios.create({ baseURL });

const useAxiosPublic = () => {
	return axiosPublic;
};

export default useAxiosPublic;
