import React, { useEffect, useState } from "react";
import { useLocation, Navigate, useNavigate } from "react-router-dom";
import { LogOut, BarChart2, Download, User } from "lucide-react";
import jsPDF from "jspdf";

export default function Dashboard() {
  const navigate = useNavigate();


  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);



  const [user, setUser] = useState(null);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [foreseBase64, setForeseBase64] = useState("");
  const [svceBase64, setSvceBase64] = useState("");

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

          // Pre-fetch logos for PDF
          const toBase64 = async (url, setter) => {
            try {
              const res = await fetch(url);
              const blob = await res.blob();
              const reader = new FileReader();
              reader.onloadend = () => setter(reader.result);
              reader.readAsDataURL(blob);
            } catch (e) { console.error("Logo fetch failed", e); }
          };
          toBase64("/forese-logo.png", setForeseBase64);
          toBase64("/svce-logo.png", setSvceBase64);
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
    setIsGeneratingPdf(true);
    try {
      const pdf = new jsPDF("p", "mm", "a4");
      const pageWidth = pdf.internal.pageSize.getWidth();
      const margin = 15;
      let currentY = 15;

      // Calculate totals
      const totalApt = (user.aptitude || 0) + (user.core || 0) + (user.verbal || 0) + (user.programming || 0) + (user.comprehension || 0);
      const totalGD = (user.subject_knowledge || 0) + (user.communication_skills || 0) + (user.body_language || 0) + (user.listening_skills || 0) + (user.active_participation || 0);
      const overall = totalApt + totalGD;

      // 1. HEADER
      if (foreseBase64) pdf.addImage(foreseBase64, "PNG", margin, currentY, 25, 25);
      if (svceBase64) pdf.addImage(svceBase64, "PNG", pageWidth - margin - 40, currentY + 5, 40, 18);
      currentY += 35;

      // 2. TITLE
      pdf.setFillColor(238, 242, 255); // #eef2ff circle
      pdf.circle(pageWidth / 2, currentY - 12, 10, "F");

      // Draw a solid graduation cap
      pdf.setFillColor(79, 70, 229); // #4f46e5

      // Cap Diamond (Top)
      pdf.lines(
        [
          [6, 3],   // to right-mid
          [-6, 3],  // to bottom
          [-6, -3], // to left-mid
          [6, -3]   // back to top
        ],
        pageWidth / 2, currentY - 17, [1, 1], "F"
      );

      // Cap Base
      pdf.roundedRect(pageWidth / 2 - 2.5, currentY - 14, 5, 3.5, 0.5, 0.5, "F");

      // Tassel
      pdf.setDrawColor(255, 255, 255);
      pdf.setLineWidth(0.4);
      pdf.line(pageWidth / 2 - 1, currentY - 13, pageWidth / 2 - 2, currentY - 11);

      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(22);
      pdf.setTextColor(0, 0, 0);
      pdf.text("Mocks '26", pageWidth / 2, currentY + 4, { align: "center" });
      currentY += 14;
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(14);
      pdf.setTextColor(100, 116, 139);
      pdf.text("Performance Overview", pageWidth / 2, currentY, { align: "center" });
      currentY += 15;

      // 3. STUDENT INFO CARD
      pdf.setDrawColor(226, 232, 240);
      pdf.setFillColor(255, 255, 255);
      pdf.roundedRect(margin, currentY, pageWidth - (margin * 2), 35, 3, 3, "FD");
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(9);
      pdf.setTextColor(79, 70, 229);
      pdf.text("STUDENT INFORMATION", margin + 6, currentY + 8);
      pdf.setFontSize(10);
      pdf.setTextColor(100, 116, 139);
      const midPoint = pageWidth / 2;
      pdf.setFont("helvetica", "normal");
      pdf.text("Name:", margin + 6, currentY + 18);
      pdf.text("Reg No:", midPoint + 10, currentY + 18);
      pdf.text("Mocks'26 ID:", margin + 6, currentY + 28);
      pdf.text("Dept:", midPoint + 10, currentY + 28);
      pdf.setFont("helvetica", "bold");
      pdf.setTextColor(30, 41, 59);
      pdf.text(user.name, margin + 45, currentY + 18);
      pdf.text(user.regno, pageWidth - margin - 6, currentY + 18, { align: "right" });
      pdf.text(`MOCK26${String(user.id).padStart(3, "0")}`, margin + 45, currentY + 28);
      pdf.text(user.dept, pageWidth - margin - 6, currentY + 28, { align: "right" });
      currentY += 48;

      // 4. TABLES HELPER
      const drawTable = (rows, total, y) => {
        const tableW = pageWidth - margin * 2;
        pdf.setDrawColor(229, 231, 235);
        pdf.setFillColor(248, 250, 252);
        pdf.rect(margin, y, tableW, 8, "FD");
        pdf.setFontSize(8);
        pdf.setTextColor(100, 116, 139);
        pdf.text("ASSESSMENT CATEGORY", margin + 4, y + 5.5);
        pdf.text("SCORE", pageWidth - margin - 4, y + 5.5, { align: "right" });
        let rowY = y + 8;
        pdf.setFontSize(9);
        rows.forEach(([label, score]) => {
          pdf.setFont("helvetica", "normal");
          pdf.setTextColor(30, 41, 59);
          pdf.line(margin, rowY, pageWidth - margin, rowY);
          pdf.text(label, margin + 4, rowY + 6);
          pdf.setFont("helvetica", "bold");
          pdf.text(`${score} / 10`, pageWidth - margin - 4, rowY + 6, { align: "right" });
          rowY += 9;
        });
        pdf.setFillColor(241, 245, 249);
        pdf.rect(margin, rowY, tableW, 9, "F");
        pdf.setFont("helvetica", "bold");
        pdf.text("Section Total", margin + 4, rowY + 6);
        pdf.text(`${total} / 50`, pageWidth - margin - 4, rowY + 6, { align: "right" });
        return rowY + 9;
      };

      // APT TABLE
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(13);
      pdf.setTextColor(30, 41, 59);
      pdf.text("Aptitude Scores", margin + 5, currentY);
      currentY += 5;
      currentY = drawTable([
        ["Aptitude", user.aptitude],
        ["Core Knowledge", user.core],
        ["Verbal Ability", user.verbal],
        ["Programming Skills", user.programming],
        ["Comprehension", user.comprehension]
      ], totalApt, currentY);
      currentY += 12;

      // GD TABLE
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(13);
      pdf.text("Group Discussion", margin + 5, currentY);
      currentY += 5;
      currentY = drawTable([
        ["Subject Knowledge", user.subject_knowledge],
        ["Communication Skills", user.communication_skills],
        ["Body Language", user.body_language],
        ["Listening Skills", user.listening_skills],
        ["Active Participation", user.active_participation]
      ], totalGD, currentY);
      currentY += 2;

      // 5. OVERALL SCORE
      pdf.setFillColor(79, 70, 229);
      pdf.roundedRect(margin, currentY, pageWidth - margin * 2, 22, 4, 4, "F");
      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(8);
      pdf.text("OVERALL PERFORMANCE", pageWidth / 2, currentY + 6, { align: "center" });
      pdf.setFontSize(22);
      pdf.text(`${overall}`, pageWidth / 2 - 4, currentY + 16, { align: "center" });
      pdf.setFontSize(10);
      pdf.text("/ 100", pageWidth / 2 + 10, currentY + 16);

      // FOOTER
      pdf.setTextColor(148, 163, 184);
      pdf.setFontSize(7);
      //pdf.text(`© 2026 SVCE • Mock Examination Report • Generated on ${new Date().toLocaleDateString()}`, pageWidth / 2, 282, { align: "center" });

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

        <p className="text-gray-500 text-sm mt-1 font-medium">
          Reg No: {user.regno}
        </p>

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

