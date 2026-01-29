import React, { useEffect, useState, forwardRef } from "react";
import { AcademicCapIcon, ChartBarIcon, UsersIcon } from "@heroicons/react/24/solid";

const foreselogo = "/forese-logo.png";
const svcelogo = "/svce-logo.png";

const ReportTemplate = forwardRef(({ user }, ref) => {
    const [foreseBase64, setForeseBase64] = useState("");
    const [svceBase64, setSvceBase64] = useState("");

    useEffect(() => {
        const toBase64 = async (url, setter) => {
            try {
                const res = await fetch(url);
                const blob = await res.blob();
                const reader = new FileReader();
                reader.onloadend = () => setter(reader.result);
                reader.readAsDataURL(blob);
            } catch (err) {
                console.error("Logo load failed", err);
            }
        };

        toBase64(foreselogo, setForeseBase64);
        toBase64(svcelogo, setSvceBase64);
    }, []);

    if (!user) return null;

    //data
    const aptitudeScores = {
        aptitude: user.aptitude || 0,
        core: user.core || 0,
        verbal: user.verbal || 0,
        programming: user.programming || 0,
        comprehension: user.comprehension || 0,
    };

    const gdScores = {
        subject_knowledge: user.subject_knowledge || 0,
        communication_skills: user.communication_skills || 0,
        body_language: user.body_language || 0,
        listening_skills: user.listening_skills || 0,
        active_participation: user.active_participation || 0,
    };

    const totalApt = Object.values(aptitudeScores).reduce((a, b) => a + b, 0);
    const totalGD = Object.values(gdScores).reduce((a, b) => a + b, 0);
    const overall = totalApt + totalGD;

    const aptLabels = ["Apt", "Core", "Ver", "Prog", "Comp"];
    const aptColors = ["#6366f1", "#3b82f6", "#14b8a6", "#f59e0b", "#ec4899"];
    const gdColors = ["#34d399", "#818cf8", "#fcd34d", "#f87171", "#0ea5e9"];

    return (
        <div
            ref={ref}
            style={{
                width: 794,
                minHeight: 1123,
                backgroundColor: "#ffffff",
                color: "#111827",
                fontFamily: "ui-sans-serif, system-ui, sans-serif",
                padding: "40px 60px",
                margin: "0 auto",
                position: "relative",
            }}
        >
            {/* TOP LOGOS */}
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10, alignItems: "center" }}>
                <img src={foreseBase64 || foreselogo} alt="Forese" style={{ height: 80 }} />
                <img src={svceBase64 || svcelogo} alt="SVCE" style={{ height: 40 }} />
            </div>

            {/* TITLE SECTION */}
            <div style={{ textAlign: "center", marginBottom: 30 }}>
                <div
                    style={{
                        width: 50,
                        height: 50,
                        borderRadius: "50%",
                        backgroundColor: "#eef2ff",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        margin: "0 auto 10px",
                    }}
                >
                    <AcademicCapIcon style={{ width: 26, color: "#4f46e5" }} />
                </div>
                <h1 style={{ fontSize: 30, margin: 0, fontWeight: 800, color: "#111827" }}>Mocks ’26</h1>
                <p style={{ color: "#64748b", fontSize: 15, marginTop: 4 }}>Performance Overview</p>
            </div>

            {/* STUDENT INFO TABLE */}
            <div
                style={{
                    border: "1px solid #e5e7eb",
                    borderRadius: 16,
                    padding: "20px 24px",
                    marginBottom: 30,
                    backgroundColor: "#ffffff",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
                }}
            >
                <div style={{ fontSize: 12, fontWeight: 800, color: "#6366f1", marginBottom: 16, letterSpacing: "0.05em" }}>
                    STUDENT INFORMATION
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", rowGap: 16, fontSize: 14 }}>
                    <div style={{ display: "flex", gap: 6 }}>
                        <span style={{ color: "#64748b", width: 80 }}>Name:</span>
                        <b style={{ color: "#111827" }}>{user.name}</b>
                    </div>
                    <div style={{ textAlign: "right", display: "flex", justifyContent: "flex-end", gap: 6 }}>
                        <span style={{ color: "#64748b" }}>Reg No:</span>
                        <b style={{ color: "#111827" }}>{user.regno}</b>
                    </div>
                    <div style={{ display: "flex", gap: 6 }}>
                        <span style={{ color: "#64748b", width: 80 }}>Dept:</span>
                        <b style={{ color: "#111827" }}>{user.dept}</b>
                    </div>
                    <div style={{ textAlign: "right", display: "flex", justifyContent: "flex-end", gap: 6 }}>
                        <span style={{ color: "#64748b" }}>Email:</span>
                        <b style={{ color: "#111827" }}>{user.email}</b>
                    </div>
                </div>
            </div>

            {/* TABLES GRID */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 30, alignItems: "start" }}>

                {/* LEFT: APTITUDE */}
                <div style={{ display: "flex", flexDirection: "column" }}>
                    <h3 style={{ fontSize: 18, fontWeight: 800, marginBottom: 16, display: "flex", alignItems: "center", gap: 10, color: "#111827" }}>
                        <ChartBarIcon style={{ width: 20, height: 20, color: "#6366f1" }} /> Aptitude Scores
                    </h3>
                    <ScoreTable scores={aptitudeScores} total={totalApt} />
                </div>

                {/* RIGHT: GD */}
                <div style={{ display: "flex", flexDirection: "column" }}>
                    <h3 style={{ fontSize: 18, fontWeight: 800, marginBottom: 16, display: "flex", alignItems: "center", gap: 10, color: "#111827" }}>
                        <UsersIcon style={{ width: 20, height: 20, color: "#6366f1" }} /> Group Discussion
                    </h3>
                    {/* Using same table structure for GD */}
                    <ScoreTable scores={gdScores} total={totalGD} />
                </div>
            </div>

            {/* OVERALL SCORE FOOTER */}
            <div
                style={{
                    marginTop: 40,
                    backgroundColor: "#4f46e5",
                    color: "#ffffff",
                    padding: "30px",
                    borderRadius: 16,
                    textAlign: "center",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: "0 10px 25px -5px rgba(79, 70, 229, 0.4)",
                }}
            >
                <div style={{ fontSize: 14, fontWeight: 600, opacity: 0.9, letterSpacing: "0.1em", marginBottom: 6 }}>
                    OVERALL PERFORMANCE
                </div>
                <div style={{ fontSize: 56, fontWeight: 800, lineHeight: 1 }}>
                    {overall} <span style={{ fontSize: 24, opacity: 0.7 }}>/ 100</span>
                </div>
            </div>
        </div>
    );
});

function ScoreTable({ scores, total }) {
    return (
        <div style={{
            border: "1px solid #e5e7eb",
            borderRadius: 12,
            overflow: "hidden",
            backgroundColor: "white",
            boxShadow: "0 1px 2px rgba(0,0,0,0.05)"
        }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
                <thead>
                    <tr style={{ backgroundColor: "#f9fafb", borderBottom: "1px solid #e5e7eb" }}>
                        <th style={{ textAlign: "left", padding: "12px 16px", fontWeight: 600, color: "#64748b" }}>Criteria</th>
                        <th style={{ textAlign: "right", padding: "12px 16px", fontWeight: 600, color: "#64748b" }}>Score</th>
                    </tr>
                </thead>
                <tbody>
                    {Object.entries(scores).map(([key, val]) => (
                        <tr key={key} style={{ borderBottom: "1px solid #f3f4f6" }}>
                            <td style={{ padding: "12px 16px", color: "#334155", textTransform: "capitalize", fontWeight: 500 }}>
                                {key.replace(/_/g, " ")}
                            </td>
                            <td style={{ padding: "12px 16px", textAlign: "right", color: "#0f172a", fontWeight: 600 }}>
                                {val} / 10
                            </td>
                        </tr>
                    ))}
                    <tr style={{ backgroundColor: "#f0fdf4" }}>
                        <td style={{ padding: "12px 16px", color: "#166534", fontWeight: 700 }}>Total</td>
                        <td style={{ padding: "12px 16px", textAlign: "right", color: "#166534", fontWeight: 700 }}>
                            {total} / 50
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
}

export default ReportTemplate;
