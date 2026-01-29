import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useState } from "react";



export default function Login() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);

  const navigate = useNavigate();

  const sendOtp = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        "http://localhost:5000/api/auth/send-otp",
        { email }
      );

      setOtpSent(true); 
      console.log("OTP sent successfully");
    } catch (err) {
      console.error(err);
      alert("Failed to send OTP");
    }
  };

  const verifyOtp = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/verify-otp",
        { email, otp }
      );

      localStorage.setItem("token", res.data.token);
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      alert("Invalid OTP");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-6">

        {/* Logos */}
        <div className="flex justify-between items-center mb-6">
          <img src="/forese-logo.png" alt="Forese" className="h-18" />
          <img
  src="/svce-logo.png"
  alt="SVCE"
  className="h-12 max-w-[120px] object-contain"
/>


        </div>

        <div className="flex justify-center mb-4">
          <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center text-xl">
            🎓
          </div>
        </div>

        <h2 className="text-xl font-bold text-center text-gray-900">
          Mocks ’26
        </h2>
        <p className="text-center text-gray-500 mb-6 text-sm">
          Performance Overview
        </p>

        <form className="space-y-4">
          {/* Email */}
          <div>
            <label className="text-sm font-medium text-gray-700">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full px-4 py-2 rounded-lg border border-gray-300"
              placeholder="student@college.edu"
              required
            />
          </div>

          {/* OTP Input */}
          {otpSent && (
            <div>
              <label className="text-sm font-medium text-gray-700">
                Enter OTP
              </label>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="mt-1 w-full px-4 py-2 rounded-lg border border-gray-300"
                placeholder="6-digit OTP"
                required
              />
            </div>
          )}

          {!otpSent ? (
            <button
              onClick={sendOtp}
              className="w-full bg-indigo-600 text-white py-2 rounded-lg font-semibold"
            >
              Send OTP →
            </button>
          ) : (
            <button
              onClick={verifyOtp}
              className="w-full bg-green-600 text-white py-2 rounded-lg font-semibold"
            >
              Verify OTP →
            </button>
          )}
        </form>
      </div>
    </div>
  );
}
