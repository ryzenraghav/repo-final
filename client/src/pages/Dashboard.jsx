import { useState } from "react";
import { useLocation, Navigate, useNavigate } from "react-router-dom";
import PdfPreviewModal from "../components/PdfPreviewModal";

export default function Dashboard() {
  const location = useLocation();
  const navigate = useNavigate();
  const user = location.state;
  const [showPdfModal, setShowPdfModal] = useState(false);

  const handleLogout = () => {
    navigate("/", { replace: true });
  };

  if (!user) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 md:px-10 py-6">
      <PdfPreviewModal
        isOpen={showPdfModal}
        onClose={() => setShowPdfModal(false)}
        user={user}
      />

      {/* Header */}
      <div className="flex justify-between items-center">
        <img src="/forese-logo.png" alt="Forese" className="h-30" />
        <img src="/svce-logo.png" alt="SVCE" className="h-12" />
      </div>

      {/* Profile */}
      <div className="flex flex-col items-center mt-4">
        <h2 className="mt-2 text-3xl font-semibold">{user.username}</h2>

        <p className="text-gray-500 text-sm mt-1">
          Engineering Student • {user.dept}
        </p>

        <div className="flex justify-center mt-4">
          <span className="px-4 py-1 text-xs rounded-full bg-purple-100 text-purple-700">
            Reg No: {user.regno}
          </span>
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="mt-3 text-gray-400 hover:text-gray-600 transition"
          title="Logout"
        >
          <span className="material-icons text-xl">logout</span>
        </button>
      </div>

      {/* Greeting Card */}
      <div className="mt-10 relative bg-white rounded-[2rem] p-8 overflow-hidden border border-indigo-50 shadow-sm">
        {/* Soft corner decoration */}
        <div className="absolute top-0 right-0 w-40 h-40 bg-indigo-50/40 rounded-bl-full" />

        <div className="relative z-10">
          <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            Hello, {user.username?.split(" ")[0] || "User"}! <span className="animate-bounce">👋</span>
          </h3>
          <p className="text-gray-500 mt-2 text-sm md:text-base leading-relaxed">
            Ready to check your performance? Generate your latest mock placement report below.
          </p>
        </div>
      </div>

      {/* Action Section */}
      <div className="mt-8 grid gap-4 md:grid-cols-2">

        {/* Generate Report */}
        <div className="relative bg-white rounded-2xl p-5 overflow-hidden border border-indigo-50 shadow-sm flex flex-col justify-between">
          {/* Soft corner decoration */}
          <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-50/50 rounded-bl-full" />

          <div>
            <div className="flex items-center gap-4 mb-3">
              <div className="w-12 h-12 rounded-xl bg-indigo-100 flex items-center justify-center shrink-0">
                <span className="material-icons text-indigo-600 text-2xl">bar_chart</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Performance Report</h3>
            </div>
            <p className="text-sm text-gray-500 mb-6">
              View detailed mock interview analysis and score breakdowns.
            </p>
          </div>

          <button
            onClick={() => navigate('/report', { state: user })}
            className="w-full bg-indigo-500 hover:bg-indigo-600 text-white font-medium py-3 rounded-xl flex items-center justify-center gap-2 transition"
          >
            <span className="material-icons text-lg">arrow_forward</span>
            Generate Report
          </button>
        </div>

        {/* Download PDF */}
        <div className="relative bg-white rounded-2xl p-5 overflow-hidden border border-indigo-50 shadow-sm flex flex-col justify-between">
          {/* Soft corner decoration */}
          <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-50/50 rounded-bl-full" />

          <div>
            <div className="flex items-center gap-4 mb-3">
              <div className="w-12 h-12 rounded-xl bg-indigo-100 flex items-center justify-center shrink-0">
                <span className="material-icons text-indigo-600 text-2xl">picture_as_pdf</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Download PDF</h3>
            </div>
            <p className="text-sm text-gray-500 mb-6">
              Optimized for A4 printing and sharing with recruiters.
            </p>
          </div>

          <button
            onClick={() => setShowPdfModal(true)}
            className="w-full bg-indigo-500 hover:bg-indigo-600 text-white font-medium py-3 rounded-xl flex items-center justify-center gap-2 transition"
          >
            <span className="material-icons text-lg">download</span>
            Download PDF
          </button>
        </div>

      </div>
    </div>
  );
}