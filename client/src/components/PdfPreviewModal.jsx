import React, { useRef, useState, useEffect } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { XMarkIcon, AcademicCapIcon, ChartBarIcon, UsersIcon } from "@heroicons/react/24/solid";

const foreselogo = "/forese-logo.png";
const svcelogo = "/svce-logo.png";

export default function PdfPreviewModal({ isOpen, onClose, user }) {
    const pdfRef = useRef(null);
    const [isGenerating, setIsGenerating] = useState(false);
    const [foreseBase64, setForeseBase64] = useState("");
    const [svceBase64, setSvceBase64] = useState("");

    /* ---------- LOGOS ---------- */
    useEffect(() => {
        if (!isOpen) return;

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
    }, [isOpen]);

    if (!isOpen || !user) return null;

    /* ---------- DATA ---------- */
    const aptitudeScores = {
        aptitude: user.aptitude || 0,
        core: user.core || 0,
        verbal: user.verbal || 0,
        programming: user.programming || 0,
        comprehension: user.comprehension || 0,
    };

    const gdScores = {
        subject_knowledge: user.gd_subject_knowledge || 0,
        communication_skills: user.gd_communication_skills || 0,
        body_language: user.gd_body_language || 0,
        listening_skills: user.gd_listening_skills || 0,
        active_participation: user.gd_active_participation || 0,
    };

    const totalApt = Object.values(aptitudeScores).reduce((a, b) => a + b, 0);
    const totalGD = Object.values(gdScores).reduce((a, b) => a + b, 0);
    const overall = totalApt + totalGD;

    const aptLabels = ["Apt", "Core", "Ver", "Prog", "Comp"];
    const aptColors = ["#6366f1", "#3b82f6", "#14b8a6", "#f59e0b", "#ec4899"];
    const gdColors = ["#34d399", "#818cf8", "#fcd34d", "#f87171", "#0ea5e9"];

    /* ---------- DOWNLOAD ---------- */
    const handleDownload = async () => {
        setIsGenerating(true);
        try {
            const canvas = await html2canvas(pdfRef.current, {
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
            console.error(err);
            alert("Failed to generate PDF");
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl w-full max-w-5xl shadow-xl flex flex-col h-[90vh]">

                {/* HEADER */}
                <div className="flex justify-between items-center p-4 border-b">
                    <h2 className="font-semibold text-lg">Report Preview</h2>
                    <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-lg transition-colors">
                        <XMarkIcon className="w-6 h-6 text-gray-500" />
                    </button>
                </div>

                {/* CONTENT AREA */}
                <div className="bg-gray-100 p-6 overflow-auto flex-1 flex justify-center">
                    <div
                        ref={pdfRef}
                        style={{
                            width: 794,
                            minHeight: 1123,
                            backgroundColor: "#ffffff",
                            padding: "30px 50px",
                            margin: "0 auto",
                            position: "relative"
                        }}
                    >
                        {/* TOP LOGOS */}
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10, alignItems: "center" }}>
                            <img src={foreseBase64 || foreselogo} alt="Forese" style={{ height: 80 }} />
                            <img src={svceBase64 || svcelogo} alt="SVCE" style={{ height: 40 }} />
                        </div>

                        {/* TITLE SECTION */}
                        <div style={{ textAlign: "center", marginBottom: 10 }}>
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
                                padding: "16px 24px",
                                marginBottom: 20,
                                backgroundColor: "#ffffff",
                                lineHeight: "1.2"
                            }}
                        >
                            <div style={{ fontSize: 12, fontWeight: 800, color: "#6366f1", marginBottom: 12, letterSpacing: "0.05em" }}>
                                STUDENT INFORMATION
                            </div>
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", rowGap: 14, fontSize: 14 }}>
                                <div style={{ display: "flex", gap: 6 }}>
                                    <span style={{ color: "#64748b" }}>Name:</span>
                                    <b style={{ color: "#111827" }}>{user.username}</b>
                                </div>
                                <div style={{ textAlign: "right", display: "flex", justifyContent: "flex-end", gap: 6 }}>
                                    <span style={{ color: "#64748b" }}>Reg No:</span>
                                    <b style={{ color: "#111827" }}>{user.regno}</b>
                                </div>
                                <div style={{ display: "flex", gap: 6 }}>
                                    <span style={{ color: "#64748b" }}>Department:</span>
                                    <b style={{ color: "#111827" }}>{user.dept}</b>
                                </div>
                                <div style={{ textAlign: "right", display: "flex", justifyContent: "flex-end", gap: 6 }}>
                                    <span style={{ color: "#64748b" }}>Email:</span>
                                    <b style={{ color: "#111827" }}>{user.email}</b>
                                </div>
                            </div>
                        </div>

                        {/* CHARTS GRID */}
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, alignItems: "stretch" }}>

                            {/* LEFT: APTITUDE */}
                            <div style={{ display: "flex", flexDirection: "column" }}>
                                <h3 style={{ fontSize: 20, fontWeight: 800, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 10, color: "#111827" }}>
                                    <ChartBarIcon style={{ width: 20, height: 20, color: "#6366f1" }} /> Aptitude Scores
                                </h3>
                                <AptitudeCard
                                    scores={aptitudeScores}
                                    labels={aptLabels}
                                    colors={aptColors}
                                    total={totalApt}
                                />
                            </div>

                            {/* RIGHT: GD */}
                            <div style={{ display: "flex", flexDirection: "column" }}>
                                <h3 style={{ fontSize: 20, fontWeight: 800, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 10, color: "#111827" }}>
                                    <UsersIcon style={{ width: 20, height: 20, color: "#6366f1" }} /> Group Discussion
                                </h3>
                                <GDCard
                                    scores={gdScores}
                                    colors={gdColors}
                                    total={totalGD}
                                />
                            </div>
                        </div>

                        {/* OVERALL SCORE FOOTER */}
                        <div
                            style={{
                                marginTop: 16,
                                backgroundColor: "#4f46e5",
                                color: "#ffffff",
                                padding: "24px",
                                borderRadius: 16,
                                textAlign: "center",
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                justifyContent: "center",
                                boxShadow: "0 4px 12px rgba(79, 70, 229, 0.2)"
                            }}
                        >
                            <div style={{ fontSize: 14, fontWeight: 600, opacity: 0.9, letterSpacing: "0.1em", marginBottom: 6 }}>OVERALL PERFORMANCE</div>
                            <div style={{ fontSize: 48, fontWeight: 800, lineHeight: 1 }}>
                                {overall} <span style={{ fontSize: 24, opacity: 0.7 }}>/ 100</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* MODAL FOOTER */}
                <div className="p-4 border-t flex justify-end gap-3 bg-white rounded-b-xl">
                    <button onClick={onClose} className="px-6 py-2.5 text-gray-700 font-medium hover:bg-gray-100 rounded-lg transition-colors">
                        Cancel
                    </button>
                    <button
                        onClick={handleDownload}
                        disabled={isGenerating}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-2.5 rounded-lg font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
                    >
                        {isGenerating ? "Generating..." : "Download PDF"}
                    </button>
                </div>
            </div>
        </div>
    );
}

/* ---------- INTERNAL COMPONENTS ---------- */

function AptitudeCard({ scores, labels, colors, total }) {
    const dataValues = Object.values(scores);

    return (
        <div style={{ border: "1px solid #e5e7eb", borderRadius: 16, padding: 24, backgroundColor: "white", display: "flex", flexDirection: "column", flex: 1 }}>
            {/* BAR CHART */}
            <div style={{ marginBottom: 24 }}>
                <div style={{ height: 170, position: "relative" }}>
                    {/* Y-AXIS LINE */}
                    <div style={{ position: "absolute", left: 22, top: 0, bottom: 0, width: 1, backgroundColor: "#d1d5db", zIndex: 2 }}></div>

                    {/* GRID LINES */}
                    <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", justifyContent: "space-between", zIndex: 0 }}>
                        {[10, 8, 6, 4, 2, 0].map((val) => (
                            <div key={val} style={{ display: "flex", alignItems: "center", width: "100%" }}>
                                <span style={{ width: 14, fontSize: 10, color: "#9ca3af", textAlign: "right", marginRight: 8 }}>{val}</span>
                                <div style={{ flex: 1, borderTop: val === 0 ? "1.5px solid #d1d5db" : "1px dashed #f1f5f9" }}></div>
                            </div>
                        ))}
                    </div>
                    {/* BARS */}
                    <div style={{ position: "absolute", left: 23, right: 0, bottom: 0, top: 0, display: "flex", alignItems: "flex-end", justifyContent: "space-around", zIndex: 1 }}>
                        {dataValues.map((val, i) => (
                            <div
                                key={i}
                                style={{
                                    width: "14%",
                                    height: `${(val / 10) * 100}%`,
                                    backgroundColor: colors[i],
                                    borderRadius: "6px 6px 0 0"
                                }}
                            />
                        ))}
                    </div>
                </div>
                {/* LABELS ROW */}
                <div style={{ display: "flex", paddingLeft: 22, justifyContent: "space-around", marginTop: 8 }}>
                    {labels.map((label, i) => (
                        <div key={i} style={{ width: "14%", textAlign: "center" }}>
                            <span style={{ fontSize: 10, fontWeight: 700, color: "#64748b" }}>{label}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* LIST */}
            <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 20, flex: 1 }}>
                {Object.entries(scores).map(([key, val]) => (
                    <div key={key} style={{ display: "flex", justifyContent: "space-between", fontSize: 13, borderBottom: "1px solid #f8fafc", paddingBottom: 6 }}>
                        <span style={{ color: "#64748b", textTransform: "capitalize", fontWeight: 500 }}>{key}</span>
                        <span style={{ fontWeight: 700, color: "#1e293b" }}>{val}/10</span>
                    </div>
                ))}
            </div>

            {/* TOTAL PILL */}
            <div style={{ backgroundColor: "#6366f1", color: "white", padding: "12px", borderRadius: 12, textAlign: "center", fontWeight: 700, fontSize: 16 }}>
                Total: {total} / 50
            </div>
        </div>
    );
}

function GDCard({ scores, colors, total }) {
    const percentage = Math.round((total / 50) * 100);
    const dataValues = Object.values(scores);
    const totalVal = dataValues.reduce((a, b) => a + b, 0) || 1;

    // SVG Constants for perfect PDF rendering
    const size = 170;
    const center = size / 2;
    const radius = 62;
    const strokeWidth = 24;
    const circumference = 2 * Math.PI * radius;

    // Small equal gaps for a professional look
    const gapDeg = 3;
    const gapLength = (gapDeg / 360) * circumference;
    const availableLength = circumference - (dataValues.length * gapLength);

    let currentOffset = 0;

    return (
        <div style={{ border: "1px solid #e5e7eb", borderRadius: 16, padding: 24, backgroundColor: "white", display: "flex", flexDirection: "column", flex: 1 }}>

            {/* DONUT CHART (SVG) */}
            <div style={{ display: "flex", justifyContent: "center", marginBottom: 32, marginTop: 8 }}>
                <div style={{ position: "relative", width: size, height: size }}>
                    <svg
                        width={size}
                        height={size}
                        viewBox={`0 0 ${size} ${size}`}
                        style={{ transform: "rotate(-90deg)" }}
                    >
                        {dataValues.map((val, i) => {
                            const segmentLength = (val / totalVal) * availableLength;
                            const dashArray = `${segmentLength} ${circumference - segmentLength}`;
                            const dashOffset = -currentOffset;

                            // Advance for next segment
                            currentOffset += segmentLength + gapLength;

                            return (
                                <circle
                                    key={i}
                                    cx={center}
                                    cy={center}
                                    r={radius}
                                    fill="transparent"
                                    stroke={colors[i]}
                                    strokeWidth={strokeWidth}
                                    strokeDasharray={dashArray}
                                    strokeDashoffset={dashOffset}
                                    strokeLinecap="butt" // Straight edges as requested
                                />
                            );
                        })}
                    </svg>
                    {/* CENTER TEXT */}
                    <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                        <div style={{ fontSize: 25, fontWeight: 800, color: "#1e293b" }}>{percentage}%</div>
                        <div style={{ fontSize: 10, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.05em" }}>GD Score</div>
                    </div>
                </div>
            </div>

            {/* LIST */}
            <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 20, flex: 1 }}>
                {Object.entries(scores).map(([key, val], i) => (
                    <div key={key} style={{ display: "flex", justifyContent: "space-between", fontSize: 13, borderBottom: "1px solid #f8fafc", paddingBottom: 6 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            <div style={{ width: 8, height: 8, borderRadius: "50%", backgroundColor: colors[i] }}></div>
                            <span style={{ color: "#64748b", textTransform: "capitalize", fontWeight: 500 }}>{key.replace(/_/g, " ")}</span>
                        </div>
                        <span style={{ fontWeight: 700, color: "#1e293b" }}>{val}/10</span>
                    </div>
                ))}
            </div>

            {/* TOTAL PILL */}
            <div style={{ backgroundColor: "#6366f1", color: "white", padding: "12px", borderRadius: 12, textAlign: "center", fontWeight: 700, fontSize: 16 }}>
                Total: {total} / 50
            </div>
        </div>
    );
}