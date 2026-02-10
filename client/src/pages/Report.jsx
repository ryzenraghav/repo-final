import { useState, useEffect } from "react";
import { useLocation, Navigate, useNavigate } from "react-router-dom";
import TopSection from "../components/TopSection";
import TotalScore from "../components/Totalscore";
import Aptitude from "../components/Aptitude";
import Group from "../components/Group";
import Actionbutton from "../components/Actionbutton";
import PdfPreviewModal from "../components/PdfPreviewModal";
import { jwtDecode } from "jwt-decode";


export default function Report() {
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);


  const [showPdfModal, setShowPdfModal] = useState(false);

  useEffect(() => {
    if (!user) {
      const token = sessionStorage.getItem("token");
      if (!token) {
        navigate("/");
        return;
      }

      try {
        const decoded = jwtDecode(token);
        setUser(decoded);
        setLoading(false);
      } catch (err) {
        console.error("Invalid token", err);
        navigate("/");
      }
    }

  }, [user, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 text-indigo-600">
        Loading...
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  // Transform database flat columns into structured data for components
  const data = {
    profile: {
      username: user.name,
      email: user.email,
      regNo: user.regno,
      dept: user.dept,
    },
    aptitude: {
      total: (user.aptitude || 0) + (user.core || 0) + (user.verbal || 0) + (user.programming || 0) + (user.comprehension || 0),
      aptitude: user.aptitude,
      core: user.core,
      verbal: user.verbal,
      programming: user.programming,
      comprehension: user.comprehension,
    },
    gd: {
      total: user.gd_total || ((user.subject_knowledge || 0) + (user.communication_skills || 0) + (user.body_language || 0) + (user.listening_skills || 0) + (user.active_participation || 0)),
      subject_knowledge: user.subject_knowledge,
      communication_skills: user.communication_skills,
      body_language: user.body_language,
      listening_skills: user.listening_skills,
      active_participation: user.active_participation,
    },
    overallTotal: user.overall_total || ((user.aptitude || 0) + (user.core || 0) + (user.verbal || 0) + (user.programming || 0) + (user.comprehension || 0) + (user.subject_knowledge || 0) + (user.communication_skills || 0) + (user.body_language || 0) + (user.listening_skills || 0) + (user.active_participation || 0)),
  };

  return (
    <div className="bg-[#f5f6f8] min-h-screen">
      <TopSection profile={data.profile} user={user} />

      <PdfPreviewModal
        isOpen={showPdfModal}
        onClose={() => setShowPdfModal(false)}
        user={user}
        report={{
          ...user,
          points: data.aptitude.total, // Pass calculated total
        }}
      />

      <main className="px-4 lg:px-8 mt-6 relative z-20 pb-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:px-0">
          {/* LEFT COLUMN */}
          <div className="hidden lg:block space-y-6">
            {/* desktop profile card */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 w-[90%] max-w-full mt-1 mx-auto lg:mr-auto lg:ml-4">
              <div className="flex flex-col items-center text-center">
                <div className="w-20 h-20 rounded-full bg-green-300 flex items-center justify-center text-2xl font-bold text-black mb-3 border-4 border-gray-50">
                  {data.profile.username[0]}
                </div>
                <h2 className="font-bold text-xl leading-tight text-gray-800">
                  {data.profile.username}
                </h2>
                <p className="text-sm text-gray-500 mt-1 font-medium">
                  {data.profile.dept}
                </p>
                <span className="mt-3 px-4 py-1.5 text-[11px] font-bold rounded-full text-black shadow-sm uppercase tracking-wider">
                  Reg: {data.profile.regNo}
                </span>
              </div>
            </div>

            <TotalScore
              overall={data.overallTotal}
              aptitude={data.aptitude.total}
              gd={data.gd.total}
            />
            <Actionbutton onDownload={() => setShowPdfModal(true)} />
          </div>

          {/* RIGHT COLUMN */}
          <div className="lg:col-span-2 space-y-6 lg:-ml-8">
            <div className="lg:hidden">
              <TotalScore
                overall={data.overallTotal}
                aptitude={data.aptitude.total}
                gd={data.gd.total}
              />
            </div>
            <Aptitude data={data.aptitude} />
            <Group data={data.gd} />
            <div className="lg:hidden pt-4">
              <Actionbutton onDownload={() => setShowPdfModal(true)} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}