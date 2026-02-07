import { useNavigate } from "react-router-dom";

export default function Actionbutton({ onDownload }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate('/');
  };

  return (
    <div className="w-full">
      {/* ================= MOBILE ACTION BUTTONS ================= */}
      <div className="sm:hidden flex justify-center">
        <div className="relative bg-white rounded-2xl p-5 overflow-hidden border border-indigo-50 shadow-md w-full max-w-sm">
          {/* Soft corner decoration */}
          <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-50/50 rounded-bl-full" />

          <div className="flex items-center gap-4 mb-3">
            <div className="w-12 h-12 rounded-xl bg-indigo-100 flex items-center justify-center shrink-0">
              <span className="material-icons text-indigo-600 text-2xl">picture_as_pdf</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Download Report</h3>
          </div>

          <p className="text-sm text-gray-500 mb-4">
            Printable A4 report for mock interviews
          </p>

          <button
            onClick={onDownload}
            className="w-full bg-indigo-500 hover:bg-indigo-600 text-white font-medium py-3 rounded-lg flex items-center justify-center gap-2 transition">
            <span className="material-icons text-lg">download</span>
            Download PDF
          </button>
        </div>
      </div>

      {/* ================= DESKTOP + TABLET ACTION BUTTONS ================= */}
      <div className="hidden sm:block">
        <div className="relative bg-white rounded-2xl shadow-md border-2 border-indigo-50 px-5 py-4 overflow-hidden w-[90%] max-w-full lg:mr-auto lg:ml-4 mx-auto">
          {/* Soft corner decoration */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50/50 rounded-bl-full" />

          <div className="relative z-10">
            <div className="flex items-center gap-4 mb-2">
              <div className="w-14 h-14 rounded-xl bg-indigo-100 flex items-center justify-center shrink-0">
                <span className="material-icons text-indigo-600 text-2xl">picture_as_pdf</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 text-center">Download Report</h3>
            </div>

            <p className="text-sm text-gray-500 mb-4 leading-relaxed">
              Download your complete aptitude and group discussion report as a printable PDF for your records.
            </p>

            <button
              onClick={onDownload}
              className="w-full bg-indigo-500 hover:bg-indigo-600 text-white font-semibold py-3 rounded-xl flex items-center justify-center gap-2 transition shadow-md hover:shadow-lg">
              <span className="material-icons text-xl">download</span>
              Download PDF
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

