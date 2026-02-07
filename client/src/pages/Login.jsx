import { useNavigate, useSearchParams } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const error = searchParams.get("error");

  const handleGoogleLogin = () => {
    // Redirect to backend Google OAuth
    window.location.href = "http://localhost:5001/auth/google";
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

        {error && (
          <div className="mb-4 bg-red-50 text-red-700 px-4 py-3 rounded-lg text-sm border border-red-200">
            {error}
          </div>
        )}

        {/* Google Sign-in Button */}
        <button
          onClick={handleGoogleLogin}
          className="w-full bg-gradient-to-r from-indigo-600 to-indigo-500
             text-white py-3 rounded-xl font-semibold
             flex items-center justify-center gap-2
             shadow-md hover:from-indigo-700 hover:to-indigo-600
             transition-all"
        >
          <img
            src="https://www.svgrepo.com/show/355037/google.svg"
            alt="google"
            className="w-4 h-4 bg-white rounded-full p-0.5"
          />
          Login with Google
        </button>

      </div>
    </div>
  );
}