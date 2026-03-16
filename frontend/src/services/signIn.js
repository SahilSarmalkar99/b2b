import axios from "axios";
import { baseUrl } from "../config/api";

export const login = async (phone , otp) =>{
    const res = await axios.post(`${baseUrl}/auth/login` ,{
        phone,
        otp,
    });

    return res.data;
}