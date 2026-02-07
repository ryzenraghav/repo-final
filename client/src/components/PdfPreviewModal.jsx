import React, { useRef, useState, useEffect } from "react";
import jsPDF from "jspdf";
import {
    XMarkIcon,
    ChartBarIcon,
    UsersIcon,
    IdentificationIcon,
} from "@heroicons/react/24/solid";

const foreselogo = "/forese-logo.png";
const svcelogo = "/svce-logo.png";

export default function PdfPreviewModal({ isOpen, onClose, user }) {
    const pdfRef = useRef(null);
    const [isGenerating, setIsGenerating] = useState(false);
    const [foreseBase64, setForeseBase64] = useState("");
    const [svceBase64, setSvceBase64] = useState("");

    useEffect(() => {
        if (!isOpen) return;
        const toBase64 = async (url, setter) => {
            try {
                const res = await fetch(url);
                if (!res.ok) {
                    console.warn(`Failed to fetch image: ${url}`, res.status);
                    return;
                }
                const blob = await res.blob();
                const reader = new FileReader();
                reader.onloadend = () => setter(reader.result);
                reader.readAsDataURL(blob);
            } catch (err) {
                console.error(`Error loading image ${url}:`, err);
            }
        };
        toBase64(foreselogo, setForeseBase64);
        toBase64(svcelogo, setSvceBase64);
    }, [isOpen]);

    if (!isOpen || !user) return null;

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

    const handleDownload = async () => {
        setIsGenerating(true);
        try {
            const pdf = new jsPDF("p", "mm", "a4");
            const pageWidth = pdf.internal.pageSize.getWidth();
            const margin = 20;
            let currentY = 20;

            // 1. HEADER (LOGOS)
            if (foreseBase64) {
                pdf.addImage(foreseBase64, "PNG", margin, currentY, 25, 25);
            }
            if (svceBase64) {
                pdf.addImage(svceBase64, "PNG", pageWidth - margin - 40, currentY + 5, 40, 18);
            }
            currentY += 30;

            // 2. TITLE
            pdf.setFont("helvetica", "bold");
            pdf.setFontSize(22);
            pdf.setTextColor(0, 0, 0);
            pdf.text("Mocks '26", pageWidth / 2, currentY + 4, { align: "center" });
            currentY += 12;
            pdf.setFont("helvetica", "normal");
            pdf.setFontSize(14);
            pdf.setTextColor(71, 85, 105); // #475569 (Dark gray)
            pdf.text("Performance Overview", pageWidth / 2, currentY, { align: "center" });
            currentY += 12;

            // 3. STUDENT INFORMATION CARD
            pdf.setDrawColor(226, 232, 240); // #e2e8f0
            pdf.setFillColor(255, 255, 255);
            pdf.roundedRect(margin, currentY, pageWidth - (margin * 2), 35, 3, 3, "FD");

            pdf.setFont("helvetica", "bold");
            pdf.setFontSize(9);
            pdf.setTextColor(30, 41, 59); // #1e293b (Now black/dark)
            pdf.text("STUDENT INFORMATION", margin + 6, currentY + 8);

            pdf.setFontSize(10);
            pdf.setTextColor(100, 116, 139);
            const midPoint = pageWidth / 2;

            // Info Row 1
            pdf.setFont("helvetica", "normal");
            pdf.text("Name:", margin + 6, currentY + 18);
            pdf.setFont("helvetica", "bold");
            pdf.setTextColor(30, 41, 59);
            pdf.text(String(user.name || "-"), margin + 45, currentY + 18);

            pdf.setFont("helvetica", "normal");
            pdf.setTextColor(100, 116, 139);
            pdf.text("Reg No:", midPoint + 10, currentY + 18);
            pdf.setFont("helvetica", "bold");
            pdf.setTextColor(30, 41, 59);
            pdf.text(String(user.regno || "-"), pageWidth - margin - 6, currentY + 18, { align: "right" });

            // Info Row 2
            pdf.setFont("helvetica", "normal");
            pdf.setTextColor(100, 116, 139);
            pdf.text("Email:", margin + 6, currentY + 28);
            pdf.setFont("helvetica", "bold");
            pdf.setTextColor(30, 41, 59);
            pdf.text(String(user.email || "-"), margin + 45, currentY + 28);

            pdf.setFont("helvetica", "normal");
            pdf.setTextColor(100, 116, 139);
            pdf.text("Dept:", midPoint + 10, currentY + 28);
            pdf.setFont("helvetica", "bold");
            pdf.setTextColor(30, 41, 59);
            pdf.text(String(user.dept || "-"), pageWidth - margin - 6, currentY + 28, { align: "right" });

            currentY += 40;

            // 4. APTITUDE TABLE
            pdf.setFont("helvetica", "bold");
            pdf.setFontSize(13);
            pdf.setTextColor(30, 41, 59);
            pdf.text("Aptitude Scores", margin + 5, currentY);
            currentY += 5;

            const drawTable = (title, rows, total, y) => {
                const tableW = pageWidth - (margin * 2);
                pdf.setDrawColor(229, 231, 235);
                pdf.setFillColor(248, 250, 252);
                pdf.rect(margin, y, tableW, 8, "FD");

                pdf.setFontSize(8);
                pdf.setTextColor(100, 116, 139);
                pdf.text("ASSESSMENT CATEGORY", margin + 4, y + 5.5);
                pdf.text("SCORE", pageWidth - margin - 4, y + 5.5, { align: "right" });

                let rowY = y + 8;
                pdf.setFont("helvetica", "normal");
                pdf.setFontSize(9);
                pdf.setTextColor(30, 41, 59);

                rows.forEach(([label, score]) => {
                    pdf.setDrawColor(241, 245, 249);
                    pdf.line(margin, rowY, pageWidth - margin, rowY);
                    pdf.text(String(label || ""), margin + 4, rowY + 6);
                    pdf.setFont("helvetica", "bold");
                    pdf.text(`${Number(score || 0)} / 10`, pageWidth - margin - 4, rowY + 6, { align: "right" });
                    pdf.setFont("helvetica", "normal");
                    rowY += 8;
                });

                pdf.setFillColor(241, 245, 249);
                pdf.rect(margin, rowY, tableW, 9, "F");
                pdf.setFont("helvetica", "bold");
                pdf.text("Section Total", margin + 4, rowY + 6);
                pdf.text(`${Number(total || 0)} / 50`, pageWidth - margin - 4, rowY + 6, { align: "right" });

                return rowY + 9;
            };

            const aptRows = [
                ["Aptitude", aptitudeScores.aptitude],
                ["Core Knowledge", aptitudeScores.core],
                ["Verbal Ability", aptitudeScores.verbal],
                ["Programming Skills", aptitudeScores.programming],
                ["Comprehension", aptitudeScores.comprehension]
            ];
            currentY = drawTable("Aptitude Scores", aptRows, totalApt, currentY);
            currentY += 10;

            // 5. GD TABLE
            pdf.setFont("helvetica", "bold");
            pdf.setFontSize(13);
            pdf.setTextColor(30, 41, 59);
            pdf.text("Group Discussion", margin + 5, currentY);
            currentY += 5;

            const gdRows = [
                ["Subject Knowledge", gdScores.subject_knowledge],
                ["Communication Skills", gdScores.communication_skills],
                ["Body Language", gdScores.body_language],
                ["Listening Skills", gdScores.listening_skills],
                ["Active Participation", gdScores.active_participation]
            ];
            currentY = drawTable("Group Discussion", gdRows, totalGD, currentY);
            currentY += 2;

            // 6. OVERALL SCORE CARD
            pdf.setDrawColor(0, 0,0);
            pdf.setLineWidth(0.8);
            pdf.roundedRect(margin, currentY, pageWidth - (margin * 2), 22, 2, 2, "S");

            pdf.setTextColor(0, 0, 0);
            pdf.setFont("helvetica", "bold");
            pdf.setFontSize(8);
            pdf.text("OVERALL PERFORMANCE", pageWidth / 2, currentY + 7, { align: "center" });

            pdf.setFontSize(22);
            pdf.text(`${overall}`, pageWidth / 2 - 4, currentY + 16, { align: "center" });
            pdf.setFontSize(10);
            pdf.text("/ 100", pageWidth / 2 + 10, currentY + 16);
            // 7. FOOTER
            pdf.setTextColor(148, 163, 184); // #94a3b8
            pdf.setFontSize(7);
            //pdf.text(`© 2026 SVCE • Mock Examination Report • Generated on ${new Date().toLocaleDateString()}`, pageWidth / 2, 282, { align: "center" });

            pdf.save(`Mock_Report_${user.regno}.pdf`);
        } catch (err) {
            console.error("PDF generation failed:", err);
            console.error("Error details:", {
                message: err.message,
                stack: err.stack,
                user: user ? { name: user.name, regno: user.regno } : null,
                foreseLoaded: !!foreseBase64,
                svceLoaded: !!svceBase64
            });
            alert("Failed to generate PDF. Please try again.");
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
                    <button onClick={onClose}>
                        <XMarkIcon className="w-6 h-6 text-gray-500" />
                    </button>
                </div>

                {/* CONTENT */}
                <div className="bg-gray-100 p-4 overflow-auto flex-1 flex justify-center">
                    <div
                        ref={pdfRef}
                        style={{
                            width: "210mm",
                            height: "297mm",
                            backgroundColor: "#ffffff",
                            padding: "20mm",
                            boxSizing: "border-box",
                        }}
                    >
                        {/* LOGOS (LIFTED UP) */}
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                            <img src={foreseBase64 || foreselogo} alt="Forese" style={{ height: 70 }} />
                            <img src={svceBase64 || svcelogo} alt="SVCE" style={{ height: 36 }} />
                        </div>

                        {/* TITLE (TIGHTER) */}
                        <div style={{ textAlign: "center", marginBottom: 20 }}>
                            <h1 style={{ fontSize: 32, fontWeight: 800, margin: 0, color: "#000000" }}>Mocks ’26</h1>
                            <p style={{ color: "#475569", marginTop: 4, fontSize: 16 }}>Performance Overview</p>
                        </div>

                        {/* STUDENT INFORMATION */}
                        <div style={{
                            border: "1px solid #e2e8f0",
                            borderRadius: 14,
                            padding: "16px 24px",
                            marginBottom: 20,
                            backgroundColor: "#ffffff",
                            boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)"
                        }}>
                            <div style={{
                                display: "flex",
                                alignItems: "center",
                                gap: 8,
                                marginBottom: 16,
                                color: "#000000",
                                fontSize: 13,
                                fontWeight: 700,
                                textTransform: "uppercase",
                                letterSpacing: "0.05em"
                            }}>
                                <IdentificationIcon style={{ width: 18, height: 18, marginTop: "1px", color: "#64748b" }} />
                                <span>Student Information</span>
                            </div>
                            <div style={{
                                display: "grid",
                                gridTemplateColumns: "1.2fr 0.8fr",
                                gap: "10px 40px",
                                fontSize: 13,
                                color: "#1e293b"
                            }}>
                                <div style={{ display: "flex", justifyContent: "space-between" }}>
                                    <span style={{ color: "#64748b" }}>Name:</span>
                                    <span style={{ fontWeight: 700, color: "#1e293b" }}>{user.name}</span>
                                </div>
                                <div style={{ display: "flex", justifyContent: "space-between" }}>
                                    <span style={{ color: "#64748b" }}>Reg No:</span>
                                    <span style={{ fontWeight: 700, color: "#1e293b" }}>{user.regno}</span>
                                </div>
                                <div style={{ display: "flex", justifyContent: "space-between" }}>
                                    <span style={{ color: "#64748b" }}>Email:</span>
                                    <span style={{ fontWeight: 700, color: "#1e293b" }}>{user.email}</span>
                                </div>
                                <div style={{ display: "flex", justifyContent: "space-between" }}>
                                    <span style={{ color: "#64748b" }}>Dept:</span>
                                    <span style={{ fontWeight: 700, color: "#1e293b" }}>{user.dept}</span>
                                </div>
                            </div>
                        </div>

                        {/* TABLES */}
                        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                            <Section
                                icon={<ChartBarIcon style={{ width: 18, height: 18, color: "#64748b" }} />}
                                title="Aptitude Scores"
                            >
                                <AptitudeCard scores={aptitudeScores} total={totalApt} />
                            </Section>

                            <Section
                                icon={<UsersIcon style={{ width: 18, height: 18, color: "#64748b" }} />}
                                title="Group Discussion"
                            >
                                <GDCard scores={gdScores} total={totalGD} />
                            </Section>
                        </div>

                        {/* OVERALL (PULLED UP) */}
                        <div
                            style={{
                                marginTop: 24,
                                border: "2px solid #000000",
                                color: "black",
                                padding: 20,
                                borderRadius: 8,
                                textAlign: "center",
                            }}
                        >
                            <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: "0.05em" }}>OVERALL PERFORMANCE</div>
                            <div style={{ fontSize: 42, fontWeight: 800, marginTop: 4 }}>
                                {overall} <span style={{ fontSize: 20, color: "#64748b" }}>/ 100</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* FOOTER */}
                <div className="p-4 border-t flex justify-end gap-3 bg-white rounded-b-xl">
                    <button
                        onClick={onClose}
                        className="px-6 py-2.5 text-gray-700 font-medium hover:bg-gray-100 rounded-lg"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleDownload}
                        disabled={isGenerating}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-2.5 rounded-lg font-semibold shadow-md"
                    >
                        {isGenerating ? "Generating..." : "Download PDF"}
                    </button>
                </div>
            </div>
        </div>
    );
}

/* ---------- HELPERS ---------- */

function Section({ icon, title, children }) {
    return (
        <div>
            <h3 style={{ fontSize: 18, fontWeight: 800, marginBottom: 10, display: "flex", alignItems: "center", gap: 8, color: "#1e293b" }}>
                <span style={{ display: "flex", alignItems: "center", marginTop: "2px" }}>{icon}</span>
                <span>{title}</span>
            </h3>
            {children}
        </div>
    );
}

function AptitudeCard({ scores, total }) {
    const rows = [
        ["Aptitude", scores.aptitude],
        ["Core Knowledge", scores.core],
        ["Verbal Ability", scores.verbal],
        ["Programming Skills", scores.programming],
        ["Comprehension", scores.comprehension],
    ];
    return <ScoreTable header="ASSESSMENT CATEGORY" rows={rows} total={total} />;
}

function GDCard({ scores, total }) {
    const rows = [
        ["Subject Knowledge", scores.subject_knowledge],
        ["Communication Skills", scores.communication_skills],
        ["Body Language", scores.body_language],
        ["Listening Skills", scores.listening_skills],
        ["Active Participation", scores.active_participation],
    ];
    return <ScoreTable header="EVALUATION CRITERIA" rows={rows} total={total} />;
}

function ScoreTable({ header, rows, total }) {
    return (
        <div style={{ border: "1px solid #e5e7eb", borderRadius: 14, overflow: "hidden" }}>
            <div style={{ display: "flex", justifyContent: "space-between", padding: 12, background: "#f8fafc", fontSize: 12, fontWeight: 700 }}>
                <span>{header}</span>
                <span>SCORE</span>
            </div>
            {rows.map(([label, val], i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: 12, borderTop: "1px solid #f1f5f9", fontSize: 13 }}>
                    <span>{label}</span>
                    <span style={{ fontWeight: 700 }}>{val} / 10</span>
                </div>
            ))}
            <div style={{ display: "flex", justifyContent: "space-between", padding: 14, background: "#f1f5f9", fontWeight: 800 }}>
                <span>Section Total</span>
                <span>{total} / 50</span>
            </div>
        </div>
    );
}