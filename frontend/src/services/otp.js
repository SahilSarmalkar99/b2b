import axios from "axios";
import { baseUrl } from "../config/api";

export const sendOtp = async (phone) => {
  const res = await axios.post(`${baseUrl}/auth/send-otp`, {
    phone,
  });

  return res.data;
};