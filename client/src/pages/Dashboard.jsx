
import { useEffect, useRef, useState } from "react";
import { useLocation, Navigate, useNavigate } from "react-router-dom";
import { LogOut, BarChart2, Download, User } from "lucide-react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import ReportTemplate from "../components/ReportTemplate";

export default function Dashboard() {
  const navigate = useNavigate();


  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);



  const [user, setUser] = useState(null);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const reportRef = useRef(null);

  //fetch
  useEffect(() => {
    const token = sessionStorage.getItem("token");
    if (!token) {
      navigate("/");
      return;
    }

    import("axios").then(axios => {
      axios.default.get("http://localhost:5000/api/auth/dashboard", {
        headers: { Authorization: `Bearer ${token} ` }
      })
        .then(res => {
          setData(res.data);
          setUser({ ...res.data.user, ...res.data.results });
          setLoading(false);
        })
        .catch(err => {
          console.error(err);
          navigate("/");
        });
    });
  }, [navigate]);

  const handleLogout = () => {
    sessionStorage.removeItem("token");
    navigate("/", { replace: true });
  };

  const handleDownloadPdf = async () => {
    if (!reportRef.current) return;
    setIsGeneratingPdf(true);
    try {

      await new Promise(resolve => setTimeout(resolve, 100));

      const canvas = await html2canvas(reportRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff",
        windowWidth: 794,
        windowHeight: 1123,
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();

      const imgProps = pdf.getImageProperties(imgData);
      const ratio = Math.min(pdfWidth / imgProps.width, pdfHeight / imgProps.height);
      const w = imgProps.width * ratio;
      const h = imgProps.height * ratio;
      const x = (pdfWidth - w) / 2;

      pdf.addImage(imgData, "PNG", x, 0, w, h);
      pdf.save(`Mock_Report_${user.regno}.pdf`);
    } catch (err) {
      console.error("PDF generation failed", err);
      alert("Failed to generate PDF: " + (err.message || err));
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-50 text-indigo-600">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 md:px-10 py-6 font-sans text-gray-900">

      {/* Hidden Report Template for generation */}
      <div style={{ position: "absolute", top: 0, left: 0, zIndex: -50, visibility: "visible", opacity: 0.1 }}>
        <ReportTemplate ref={reportRef} user={user} />
      </div>

      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <img src="/forese-logo.png" alt="Forese Logo" className="h-24 w-auto object-contain" />
        <img src="/svce-logo.png" alt="SVCE Logo" className="h-14 w-auto object-contain" />
      </div>

      {/* Profile */}
      <div className="flex flex-col items-center mt-4">
        <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center text-3xl mb-3 shadow-sm text-indigo-600">
          {user.name ? user.name.charAt(0) : "U"}
        </div>
        <h2 className="mt-2 text-3xl font-bold tracking-tight text-gray-900">{user.name}</h2>

        <p className="text-gray-500 text-sm mt-1 font-medium">
          Engineering Student • {user.dept}
        </p>

        <div className="flex justify-center mt-4 text-xs font-semibold tracking-wide">
          <span className="px-4 py-1.5 rounded-full bg-purple-50 text-purple-700 border border-purple-100 uppercase">
            Reg No: {user.regno}
          </span>
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="mt-4 flex items-center gap-2 text-gray-400 hover:text-red-500 transition-colors text-sm font-medium px-4 py-2 hover:bg-red-50 rounded-lg"
          title="Logout"
        >
          <LogOut className="w-4 h-4" />
          <span>Logout</span>
        </button>
      </div>

      {/* Greeting Card */}
      <div className="mt-10 relative bg-white rounded-[2rem] p-8 overflow-hidden border border-indigo-50 shadow-sm mb-10 max-w-2xl mx-auto">
        <div className="absolute top-0 right-0 w-40 h-40 bg-indigo-50/40 rounded-bl-full" />
        <div className="relative z-10 flex flex-col items-center text-center gap-2">
          <h3 className="text-2xl font-bold text-gray-900 flex items-center justify-center gap-2">
            Hello, {user.name?.split(" ")[0] || "User"}! <span className="animate-bounce inline-block origin-bottom-right">👋</span>
          </h3>
          <p className="text-gray-500 text-sm md:text-base leading-relaxed">
            Here is your detailed performance breakdown.
          </p>
        </div>
      </div>

      {/* Scores Tables */}
      <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">

        {/* Aptitude Table */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-50 bg-gray-50/50">
            <h3 className="font-bold text-lg text-gray-900 flex items-center gap-2">
              <BarChart2 className="w-5 h-5 text-indigo-500" />
              Aptitude Scores
            </h3>
          </div>
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-gray-500 uppercase bg-gray-50">
              <tr>
                <th className="px-6 py-3 font-medium">Domain</th>
                <th className="px-6 py-3 font-medium text-right">Score</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {[
                { label: "Aptitude", value: user.aptitude },
                { label: "Core", value: user.core },
                { label: "Verbal", value: user.verbal },
                { label: "Programming", value: user.programming },
                { label: "Comprehension", value: user.comprehension },
              ].map((item, idx) => (
                <tr key={idx} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4 font-medium text-gray-700">{item.label}</td>
                  <td className="px-6 py-4 text-right font-bold text-indigo-600">{item.value}/10</td>
                </tr>
              ))}
              <tr className="bg-indigo-50/30">
                <td className="px-6 py-4 font-bold text-indigo-900">Total</td>
                <td className="px-6 py-4 text-right font-bold text-indigo-900">
                  {(user.aptitude || 0) + (user.core || 0) + (user.verbal || 0) + (user.programming || 0) + (user.comprehension || 0)} / 50
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Group Discussion Table */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-50 bg-gray-50/50">
            <h3 className="font-bold text-lg text-gray-900 flex items-center gap-2">
              <User className="w-5 h-5 text-indigo-500" />
              Group Discussion
            </h3>
          </div>
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-gray-500 uppercase bg-gray-50">
              <tr>
                <th className="px-6 py-3 font-medium">Criteria</th>
                <th className="px-6 py-3 font-medium text-right">Score</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {[
                { label: "Subject Knowledge", value: user.subject_knowledge },
                { label: "Communication Skills", value: user.communication_skills },
                { label: "Body Language", value: user.body_language },
                { label: "Listening Skills", value: user.listening_skills },
                { label: "Active Participation", value: user.active_participation },
              ].map((item, idx) => (
                <tr key={idx} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4 font-medium text-gray-700">{item.label}</td>
                  <td className="px-6 py-4 text-right font-bold text-indigo-600">{item.value}/10</td>
                </tr>
              ))}
              <tr className="bg-indigo-50/30">
                <td className="px-6 py-4 font-bold text-indigo-900">Total</td>
                <td className="px-6 py-4 text-right font-bold text-indigo-900">
                  {(user.subject_knowledge || 0) + (user.communication_skills || 0) + (user.body_language || 0) + (user.listening_skills || 0) + (user.active_participation || 0)} / 50
                </td>
              </tr>
            </tbody>
          </table>
        </div>

      </div>

      {/* Download Action */}
      <div className="flex justify-center mt-12 mb-6">
        <button
          onClick={handleDownloadPdf}
          disabled={isGeneratingPdf}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3.5 rounded-xl font-bold shadow-lg shadow-indigo-200 transition-all flex items-center gap-3 hover:-translate-y-1 hover:shadow-indigo-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Download className="w-5 h-5" />
          {isGeneratingPdf ? "Generating Report..." : "Download Report PDF"}
        </button>
      </div>
    </div>
  );
}

