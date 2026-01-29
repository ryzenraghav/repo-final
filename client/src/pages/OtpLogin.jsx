import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { RefreshCw } from "lucide-react";

export default function OtpLogin() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    let interval;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const requestOtp = async (isResend = false) => {
    if (!email) return alert("Please enter your email");
    setLoading(true);
    try {
      await axios.post("http://localhost:5000/api/auth/request-otp", { email });
      setOtpSent(true);
      if (isResend) {
        setTimer(30); //30 sec cooldown
        alert("OTP resent successfully!");
      }
    } catch (err) {
      alert(err.response?.data?.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = () => {
    if (timer === 0) {
      requestOtp(true);
    }
  };

  const verifyOtp = async (e) => {
    e.preventDefault();
    if (!otp) return alert("Please enter the OTP");
    setLoading(true);
    try {
      const res = await axios.post("http://localhost:5000/api/auth/verify-otp", { email, otp });
      const token = res.data.token;
      sessionStorage.setItem("token", token);
      navigate("/dashboard");
    } catch (err) {
      alert(err.response?.data?.message || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4 font-sans text-gray-900">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 border border-gray-100">

        {/* Logos */}
        <div className="flex justify-between items-center mb-8">
          <img src="/forese-logo.png" alt="Forese Logo" className="h-24 w-auto object-contain" />
          <img src="/svce-logo.png" alt="SVCE Logo" className="h-14 w-auto object-contain" />
        </div>

        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 rounded-full bg-indigo-50 flex items-center justify-center text-3xl shadow-sm">
            🎓
          </div>
        </div>

        {/* Title */}
        <h2 className="text-2xl font-bold text-center text-gray-900 tracking-tight">
          Mocks ’26
        </h2>
        <p className="text-center text-gray-500 mb-8 text-sm font-medium">
          {otpSent ? "Verify your identity" : "Performance Overview"}
        </p>

        <form onSubmit={otpSent ? verifyOtp : (e) => { e.preventDefault(); requestOtp(false); }} className="space-y-5">

          {!otpSent ? (

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5 ml-1">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all outline-hidden text-gray-700 placeholder-gray-400"
                placeholder="student@college.edu"
                required
              />
            </div>
          ) : (

            <div>
              <div className="flex items-center justify-between mb-1.5 ml-1">
                <label className="block text-sm font-semibold text-gray-700">
                  One-Time Password
                </label>
                <button
                  type="button"
                  onClick={() => setOtpSent(false)}
                  className="text-xs text-indigo-600 hover:text-indigo-800 font-medium cursor-pointer"
                >
                  Change Email
                </button>
              </div>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all outline-hidden text-center text-lg tracking-widest font-mono text-gray-800 placeholder-gray-300"
                placeholder="• • • • • •"
                maxLength={6}
                autoFocus
              />
            </div>
          )}

          {/* Action Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white py-3 rounded-xl font-semibold transition-all shadow-lg shadow-indigo-600/20 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                {otpSent ? "Verify & Login" : "Get OTP"} <span>→</span>
              </>
            )}
          </button>
        </form>

        {/* resend otp*/}
        {otpSent && (
          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={handleResend}
              disabled={timer > 0 || loading}
              className={`inline-flex items-center gap-1.5 text-sm font-medium transition-colors ${timer > 0 ? "text-gray-400 cursor-not-allowed" : "text-gray-600 hover:text-gray-900 cursor-pointer"
                }`}
            >
              <RefreshCw className={`w-3.5 h-3.5 ${timer > 0 ? "animate-spin" : ""}`} />
              {timer > 0 ? `Resend code in ${timer}s` : "Resend code"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
