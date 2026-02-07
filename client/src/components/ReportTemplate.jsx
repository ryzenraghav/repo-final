import React, { forwardRef } from "react";
import { IdentificationIcon, ChartBarIcon, UsersIcon } from "@heroicons/react/24/solid";

// Images are in `client/public`, so reference them from the public root
const foreseLogo = "/forese-logo.png";
const svceLogo = "/svce-logo.png";

const ReportTemplate = forwardRef(({ user }, ref) => {
  return (
    <div
      ref={ref}
      className="bg-white text-gray-900"
      style={{
        width: "210mm",        /* A4 width */
        height: "297mm",      /* A4 height */
        padding: "20mm",
        boxSizing: "border-box",
        fontFamily: "Arial, sans-serif",
      }}
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <img
          src={foreseLogo}
          alt="Forese"
          className="w-[80px] h-[80px] object-contain"
        />
        <div className="text-center">
          <h1 className="text-xl font-bold">Mock Examination Report</h1>
          <p className="text-sm">Academic Performance Summary</p>
        </div>
        <img
          src={svceLogo}
          alt="SVCE"
          className="w-[80px] h-[80px] object-contain"
        />
      </div>

      <hr className="mb-4" />

      {/* Student Info */}
      <div style={{
        border: "1px solid #e2e8f0",
        borderRadius: "12px",
        padding: "16px 20px",
        marginBottom: "20px",
        backgroundColor: "#ffffff",
      }}>
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          marginBottom: "12px",
          color: "#000000",
          fontSize: "12px",
          fontWeight: "700",
          textTransform: "uppercase",
          letterSpacing: "0.05em"
        }}>
          <IdentificationIcon style={{ width: "16px", height: "16px", marginTop: "1px" }} />
          <span>Student Information</span>
        </div>
        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "10px 40px",
          fontSize: "13px",
          color: "#1e293b"
        }}>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span style={{ color: "#64748b" }}>Name:</span>
            <span style={{ fontWeight: "700" }}>{user?.name}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span style={{ color: "#64748b" }}>Reg No:</span>
            <span style={{ fontWeight: "700" }}>{user?.regno}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span style={{ color: "#64748b" }}>Email:</span>
            <span style={{ fontWeight: "700" }}>{user?.email}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span style={{ color: "#64748b" }}>Dept:</span>
            <span style={{ fontWeight: "700" }}>{user?.dept}</span>
          </div>
        </div>
      </div>

      {/* Body content */}
      <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
        <Section
          icon={<ChartBarIcon style={{ width: "18px", height: "18px", color: "#64748b" }} />}
          title="Aptitude Scores"
        >
          <AptitudeCard user={user} />
        </Section>

        <Section
          icon={<UsersIcon style={{ width: "18px", height: "18px", color: "#64748b" }} />}
          title="Group Discussion"
        >
          <GDCard user={user} />
        </Section>
      </div>

      <div
        style={{
          marginTop: "24px",
          border: "2px solid #000000",
          color: "black",
          padding: "16px",
          borderRadius: "8px",
          textAlign: "center",
        }}
      >
        <div style={{ fontSize: "12px", opacity: 0.85, fontWeight: "600", letterSpacing: "0.05em" }}>OVERALL PERFORMANCE</div>
        <div style={{ fontSize: "36px", fontWeight: "800" }}>
          {((user.aptitude || 0) + (user.core || 0) + (user.verbal || 0) + (user.programming || 0) + (user.comprehension || 0) +
            (user.subject_knowledge || 0) + (user.communication_skills || 0) + (user.body_language || 0) + (user.listening_skills || 0) + (user.active_participation || 0))}
          <span style={{ fontSize: "18px", color: "#64748b" }}> / 100</span>
        </div>
      </div>

      {/* Footer */}
      <div style={{ marginTop: "auto", paddingTop: "24px", textAlign: "center", fontSize: "10px", color: "#94a3b8" }}>
        <div style={{ borderTop: "1px solid #f1f5f9", paddingTop: "12px" }}>
          <p>© 2026 SVCE • Mock Examination Report • Generated on {new Date().toLocaleDateString()}</p>
        </div>
      </div>
    </div >
  );
});

/* ---------- HELPERS ---------- */

function Section({ icon, title, children }) {
  return (
    <div>
      <h3 style={{ fontSize: "16px", fontWeight: "800", marginBottom: "10px", display: "flex", alignItems: "center", gap: "8px", color: "#1e293b" }}>
        <span style={{ display: "flex", alignItems: "center", marginTop: "2px" }}>{icon}</span>
        <span>{title}</span>
      </h3>
      {children}
    </div>
  );
}

function AptitudeCard({ user }) {
  const total = (user.aptitude || 0) + (user.core || 0) + (user.verbal || 0) + (user.programming || 0) + (user.comprehension || 0);
  const rows = [
    ["Aptitude", user.aptitude],
    ["Core Knowledge", user.core],
    ["Verbal Ability", user.verbal],
    ["Programming Skills", user.programming],
    ["Comprehension", user.comprehension],
  ];
  return <ScoreTable header="ASSESSMENT CATEGORY" rows={rows} total={total} />;
}

function GDCard({ user }) {
  const total = (user.subject_knowledge || 0) + (user.communication_skills || 0) + (user.body_language || 0) + (user.listening_skills || 0) + (user.active_participation || 0);
  const rows = [
    ["Subject Knowledge", user.subject_knowledge],
    ["Communication Skills", user.communication_skills],
    ["Body Language", user.body_language],
    ["Listening Skills", user.listening_skills],
    ["Active Participation", user.active_participation],
  ];
  return <ScoreTable header="EVALUATION CRITERIA" rows={rows} total={total} />;
}

function ScoreTable({ header, rows, total }) {
  return (
    <div style={{ border: "1px solid #e5e7eb", borderRadius: "12px", overflow: "hidden" }}>
      <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 16px", background: "#f8fafc", fontSize: "11px", fontWeight: "700", color: "#64748b" }}>
        <span>{header}</span>
        <span>SCORE</span>
      </div>
      {rows.map(([label, val], i) => (
        <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "10px 16px", borderTop: "1px solid #f1f5f9", fontSize: "12px", color: "#1e293b" }}>
          <span>{label}</span>
          <span style={{ fontWeight: "700" }}>{val || 0} / 10</span>
        </div>
      ))}
      <div style={{ display: "flex", justifyContent: "space-between", padding: "12px 16px", background: "#f1f5f9", fontWeight: "800", fontSize: "13px", color: "#1e293b" }}>
        <span>Section Total</span>
        <span>{total || 0} / 50</span>
      </div>
    </div>
  );
}

export default ReportTemplate;