import { useState } from "react";
import Logo from "../Components/Logo";
import { login } from "../services/signIn";
import { sendOtp } from "../services/otp";
import { useNavigate } from "react-router-dom";


export default function SignIn() {
  const navigate = useNavigate();
  const [phone, setPhone] = useState("");
  const [showOtp, setShowOtp] = useState(false);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);

  const handleOtp = async () => {
    try {
      const data = await sendOtp(phone);
      console.log(data);

      // clear previous otp
      setOtp(["", "", "", "", "", ""]);

      setShowOtp(true);

      // focus first box
      setTimeout(() => {
        document.getElementById("otp-0")?.focus();
      }, 100);
    } catch (error) {
      console.log(error);
    }
  };

  const handleOtpChange = (value, index) => {
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto move cursor
    if (value && index < 5) {
      document.getElementById(`otp-${index + 1}`).focus();
    }
  };

  const handleLogin = async () => {
    try {
      const finalOtp = otp.join("");
      const data = await login(phone, finalOtp);
      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.user.role);
      localStorage.setItem("profileType", data.profileType);
      localStorage.setItem("profileCompleted", data.profileCompleted);

      // Routing logic
      if (!data.profileCompleted) {
        if (data.profileType === "worker") {
          navigate("/worker/complete-profile");
        }

        if (data.profileType === "owner") {
          navigate("/owner/select-society");
        }
      } else {
        if (data.profileType === "worker") {
          navigate("/worker/dashboard");
        }

        if (data.profileType === "owner") {
          navigate("/owner/dashboard");
        }
      }

      console.log(data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
        <Logo />

        <h2 className="text-xl font-semibold mb-6 text-gray-700">Sign In</h2>

        {/* Phone Input */}
        <input
          type="tel"
          placeholder="Enter phone number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="w-full border p-3 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        {/* Generate OTP */}
        <button
          className="w-full bg-gray-200 text-gray-800 p-3 rounded-lg mb-4 hover:bg-gray-300"
          onClick={handleOtp}
        >
          {showOtp ? "Resend OTP" : "Generate OTP"}
        </button>

        {/* OTP BOXES */}
        {showOtp && (
          <div className="flex justify-center gap-2 sm:gap-3 mb-4 flex-wrap">
            {otp.map((digit, index) => (
              <input
                key={index}
                id={`otp-${index}`}
                type="text"
                maxLength="1"
                value={digit}
                onChange={(e) => handleOtpChange(e.target.value, index)}
                className="w-9 h-10 sm:w-11 sm:h-12 text-center border rounded-lg text-lg focus:ring-2 focus:ring-blue-500"
              />
            ))}
          </div>
        )}

        {/* Login Button */}
        <button
          className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700"
          onClick={handleLogin}
        >
          Login
        </button>

        <p className="text-sm mt-4 text-center">
          Don't have an account?{" "}
          <a href="/register" className="text-blue-600 font-medium">
            Register
          </a>
        </p>
      </div>
    </div>
  );
}
