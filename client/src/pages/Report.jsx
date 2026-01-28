import { useState } from "react";
import { useLocation, Navigate } from "react-router-dom";
import TopSection from "../components/TopSection";
import TotalScore from "../components/Totalscore";
import Aptitude from "../components/Aptitude";
import Group from "../components/Group";
import Actionbutton from "../components/Actionbutton";
import PdfPreviewModal from "../components/PdfPreviewModal";

export default function Report() {
  const location = useLocation();
  const user = location.state;
  const [showPdfModal, setShowPdfModal] = useState(false);

  if (!user) {
    return <Navigate to="/" replace />;
  }

  // Transform database flat columns into structured data for components
  const data = {
    profile: {
      username: user.username,
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
      total: user.gd_total,
      subject_knowledge: user.gd_subject_knowledge,
      communication_skills: user.gd_communication_skills,
      body_language: user.gd_body_language,
      listening_skills: user.gd_listening_skills,
      active_participation: user.gd_active_participation,
      topic: user.gd_topic,
    },
    overallTotal: user.overall_total || ((user.aptitude || 0) + (user.core || 0) + (user.verbal || 0) + (user.programming || 0) + (user.comprehension || 0) + (user.gd_total || 0)),
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

      <main className="px-4 -mt-16 lg:mt-6 relative z-20 pb-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:px-8">
          {/* LEFT COLUMN */}
          <div className="hidden lg:block space-y-6 lg:-ml-8">
            <TotalScore
              overall={data.overallTotal}
              aptitude={data.aptitude.total}
              gd={data.gd.total}
            />
            <Actionbutton onDownload={() => setShowPdfModal(true)} />
          </div>

          {/* RIGHT COLUMN */}
          <div className="lg:col-span-2 space-y-6 lg:-ml-8 lg:-mt-[222px]">
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
