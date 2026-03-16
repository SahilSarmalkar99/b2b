import axios from "axios";
import { baseUrl } from "../config/api";

export const register = async (name , phone , otp , role) =>{

    const res = await axios.post(`${baseUrl}/auth/register`,{
        username:name,
        phone,
        otp,
        role,
    });

    return res.data
}