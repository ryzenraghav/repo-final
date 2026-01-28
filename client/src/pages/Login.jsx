import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [screen, setScreen] = useState("default");
  const navigate = useNavigate();
  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        "http://localhost:5001/api/login",
        {
          email,
          password,
        }
      );

      navigate("/dashboard", { state: res.data });
    } catch (err) {
      console.error(err);
      alert("Invalid credentials");
    }
  };
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-6">

        {/* Logos */}
        <div className="flex justify-between items-center mb-6">
          <img src="/forese-logo.png" alt="Forese" className="h-18" />
          <img src="/svce-logo.png" alt="SVCE" className="h-6" />
        </div>

        {/* Icon */}
        <div className="flex justify-center mb-4">
          <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center text-xl">
            🎓
          </div>
        </div>

        {/* Title */}
        <h2 className="text-xl font-bold text-center text-gray-900">
          Mocks ’26
        </h2>
        <p className="text-center text-gray-500 mb-6 text-sm">
          Performance Overview
        </p>

        <form onSubmit={handleLogin} className="space-y-4">

          {/* Email */}
          <div>
            <label className="text-sm font-medium text-gray-700">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`mt-1 w-full px-4 py-2 rounded-lg border ${screen === "invalidUsername"
                ? "border-red-500"
                : "border-gray-300"
                }`}
              placeholder="student@college.edu"
            />
            {screen === "invalidUsername" && (
              <p className="text-red-500 text-sm mt-1">
                Invalid username
              </p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="text-sm font-medium text-gray-700">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`mt-1 w-full px-4 py-2 rounded-lg border ${screen === "invalidPassword"
                  ? "border-red-500"
                  : "border-gray-300"
                  }`}
                placeholder="••••••••"
              />

              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
                {showPassword ? (
                  <EyeSlashIcon className="w-5 h-5" />
                ) : (
                  <EyeIcon className="w-5 h-5" />
                )}
              </button>
            </div>

            {screen === "invalidPassword" && (
              <p className="text-red-500 text-sm mt-1">
                Incorrect password
              </p>
            )}
          </div>

          {/* Remember me */}
          <div className="flex items-center gap-2">
            <input type="checkbox" />
            <span className="text-sm text-gray-600">Remember me</span>
          </div>

          {/* Sign In */}
          <button className="w-full bg-indigo-600 text-white py-2 rounded-lg font-semibold">
            Sign In →
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center gap-3 my-4">
          <div className="flex-1 h-px bg-gray-300" />
          <span className="text-sm text-gray-500">Or continue with</span>
          <div className="flex-1 h-px bg-gray-300" />
        </div>

        {/* Google */}
        <button className="w-full border py-2 rounded-lg flex items-center justify-center gap-2 text-sm">
          <img src="https://www.svgrepo.com/show/355037/google.svg" alt="google" className="w-4 h-4" />
          Sign in with Google
        </button>
      </div>
    </div>
  );
}
