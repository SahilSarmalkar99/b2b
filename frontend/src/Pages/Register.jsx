import { useState } from "react";
import Logo from "../Components/Logo";
import { sendOtp } from "../services/otp";
import { register } from "../services/register";
import { useNavigate } from "react-router-dom";

export default function Register() {

  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState("");

  const [showOtp, setShowOtp] = useState(false);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);

  const handleOtp = async () => {
    try {
      alert("clicked")
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

  const handleRegister = async () => {
    try {
      const otpValue = otp.join("");
      const data = await register(name, phone, otpValue, role);

      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.user.role);
      localStorage.setItem("profileType", data.profileType);
      localStorage.setItem("profileCompleted", data.profileCompleted);
      console.log(data);

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
      
    } catch (error) {
      console.log(error);
    }
  };

  const handleOtpChange = (value, index) => {
    if (!/^[0-9]?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      document.getElementById(`otp-${index + 1}`).focus();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4 sm:px-6">
      <div className="bg-white w-full max-w-md sm:max-w-lg rounded-2xl shadow-xl p-6 sm:p-8">
        <Logo />

        <h2 className="text-xl sm:text-2xl font-semibold text-center text-gray-700 mb-6">
          Create Account
        </h2>

        {/* Role Selection */}
        <div className="mb-6">
          <p className="text-sm font-medium text-gray-600 mb-2">Select Role</p>

          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            <div
              onClick={() => setRole("user")}
              className={`cursor-pointer border rounded-xl p-3 sm:p-4 text-center transition-all
              ${
                role === "user"
                  ? "border-blue-600 bg-blue-50 shadow-md"
                  : "border-gray-200 hover:border-blue-400 hover:shadow-md"
              }`}
            >
              <p className="font-semibold text-gray-700 text-sm sm:text-base">
                User
              </p>
              <p className="text-xs text-gray-500 mt-1">Book services</p>
            </div>

            <div
              onClick={() => setRole("worker")}
              className={`cursor-pointer border rounded-xl p-3 sm:p-4 text-center transition-all
              ${
                role === "worker"
                  ? "border-blue-600 bg-blue-50 shadow-md"
                  : "border-gray-200 hover:border-blue-400 hover:shadow-md"
              }`}
            >
              <p className="font-semibold text-gray-700 text-sm sm:text-base">
                Worker
              </p>
              <p className="text-xs text-gray-500 mt-1">Provide services</p>
            </div>
          </div>
        </div>

        {/* Name */}
        <input
          type="text"
          placeholder="Enter name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border p-3 rounded-lg mb-4 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        {/* Phone */}
        <input
          type="tel"
          placeholder="Enter phone number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="w-full border p-3 rounded-lg mb-4 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        {/* Generate OTP */}
        <button
          onClick={handleOtp}
          className="w-full bg-gray-200 text-gray-800 p-3 rounded-lg mb-4 hover:bg-gray-300 transition text-sm sm:text-base"
        >
          {showOtp ? "Resend OTP" : "Generate OTP"}
        </button>
        {/* OTP Boxes */}
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
                className="w-9 h-10 sm:w-11 sm:h-12 border rounded-lg text-center text-lg focus:ring-2 focus:ring-blue-500"
              />
            ))}
          </div>
        )}

        {/* Register */}
        {showOtp && (
          <button
            onClick={handleRegister}
            className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition text-sm sm:text-base"
          >
            Register
          </button>
        )}

        <p className="text-sm mt-5 text-center">
          Already have an account?{" "}
          <a href="/" className="text-blue-600 font-medium">
            Sign In
          </a>
        </p>
      </div>
    </div>
  );
}
