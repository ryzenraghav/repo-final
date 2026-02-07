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
            const margin = 15; 
            let currentY = 12; 

            
            const logoY = 7;
            if (foreseBase64) {
                pdf.addImage(foreseBase64, "PNG", margin, logoY, 26, 26);
            }
            if (svceBase64) {
                pdf.addImage(svceBase64, "PNG", pageWidth - margin - 50, logoY + 6, 50, 14);
            }
            currentY = logoY + 28;


            pdf.setFont("helvetica", "bold");
            pdf.setFontSize(26); // Increased size
            pdf.setTextColor(0, 0, 0);
            pdf.text("Mocks '26", pageWidth / 2, currentY + 4, { align: "center" });
            currentY += 10;
            pdf.setFont("helvetica", "normal");
            pdf.setFontSize(15); // Increased size
            pdf.setTextColor(71, 85, 105);
            pdf.text("Performance Overview", pageWidth / 2, currentY, { align: "center" });
            currentY += 8;

            pdf.setDrawColor(226, 232, 240);
            pdf.setFillColor(255, 255, 255);
            pdf.roundedRect(margin, currentY, pageWidth - (margin * 2), 42, 4, 4, "FD"); // Taller card

            pdf.setFont("helvetica", "bold");
            pdf.setFontSize(10); // Slightly larger
            pdf.setTextColor(30, 41, 59);
            pdf.text("STUDENT INFORMATION", margin + 6, currentY + 11);

            pdf.setFontSize(11); // Larger text
            pdf.setTextColor(100, 116, 139);
            const midPoint = pageWidth / 2;

            // Info Row 1
            pdf.setFont("helvetica", "normal");
            pdf.text("Name:", margin + 8, currentY + 22);
            let labelWidth = pdf.getTextWidth("Name: ");
            pdf.setFont("helvetica", "bold");
            pdf.setTextColor(30, 41, 59);
            pdf.text(String(user.name || "-"), margin + 8 + labelWidth, currentY + 22);

            pdf.setFont("helvetica", "normal");
            pdf.setTextColor(100, 116, 139);
            pdf.text("Reg No:", midPoint + 10, currentY + 22);
            labelWidth = pdf.getTextWidth("Reg No: ");
            pdf.setFont("helvetica", "bold");
            pdf.setTextColor(30, 41, 59);
            pdf.text(String(user.regno || "-"), midPoint + 10 + labelWidth, currentY + 22);

            // Info Row 2
            pdf.setFont("helvetica", "normal");
            pdf.setTextColor(100, 116, 139);
            pdf.text("Email:", margin + 8, currentY + 34);
            labelWidth = pdf.getTextWidth("Email: ");
            pdf.setFont("helvetica", "bold");
            pdf.setTextColor(30, 41, 59);
            pdf.text(String(user.email || "-"), margin + 8 + labelWidth, currentY + 34);

            pdf.setFont("helvetica", "normal");
            pdf.setTextColor(100, 116, 139);
            pdf.text("Dept:", midPoint + 10, currentY + 34);
            labelWidth = pdf.getTextWidth("Dept: ");
            pdf.setFont("helvetica", "bold");
            pdf.setTextColor(30, 41, 59);
            pdf.text(String(user.dept || "-"), midPoint + 10 + labelWidth, currentY + 34);

            currentY += 52; 

            pdf.setFont("helvetica", "bold");
            pdf.setFontSize(15); // Larger size
            pdf.setTextColor(30, 41, 59);
            pdf.text("General Aptitude", margin + 1, currentY);
            currentY += 6;

            const drawTable = (title, rows, total, y) => {
                const tableW = pageWidth - (margin * 2);
                const headerH = 9;
                const rowH = 9.5;    
                const footerH = 10;
                const tableH = headerH + (rows.length * rowH) + footerH;

                // Outer Boarder (Rounded)
                pdf.setDrawColor(229, 231, 235);
                pdf.setLineWidth(0.2);
                pdf.roundedRect(margin, y, tableW, tableH, 3, 3, "S");

                pdf.setFillColor(248, 250, 252);
                pdf.roundedRect(margin, y, tableW, headerH, 3, 3, "F");
                pdf.rect(margin, y + 5, tableW, 5, "F");

                pdf.setFontSize(10);
                pdf.setTextColor(100, 116, 139);
                pdf.text("ASSESSMENT CATEGORY", margin + 6, y + 6.5);
                pdf.text("SCORE", pageWidth - margin - 6, y + 6.5, { align: "right" });

                let rowY = y + headerH;
                pdf.setFont("helvetica", "normal");
                pdf.setFontSize(11.5); // Slightly larger
                pdf.setTextColor(47, 85, 105);

                rows.forEach(([label, score, max]) => {
                    pdf.setDrawColor(241, 245, 249);
                    pdf.line(margin, rowY, pageWidth - margin, rowY);

                    pdf.setTextColor(71, 85, 105);
                    pdf.text(String(label || ""), margin + 6, rowY + 7);
                    pdf.setFont("helvetica", "bold");
                    pdf.setTextColor(30, 41, 59);
                    pdf.text(`${Number(score || 0)} / ${max || 10}`, pageWidth - margin - 6, rowY + 7, { align: "right" });
                    pdf.setFont("helvetica", "normal");
                    rowY += rowH;
                });

                pdf.setFillColor(241, 245, 249);
                pdf.roundedRect(margin, rowY, tableW, footerH, 3, 3, "F");
                pdf.rect(margin, rowY, tableW, 5, "F");

                pdf.setFont("helvetica", "bold");
                pdf.setTextColor(30, 41, 59);
                pdf.setFontSize(11.5);
                pdf.text("Section Total", margin + 6, rowY + 5.5);
                pdf.text(`${Number(total || 0)} / 50`, pageWidth - margin - 6, rowY + 5.5, { align: "right" });

                return rowY + footerH;
            };

            const aptRows = [
                ["Aptitude", aptitudeScores.aptitude, 10],
                ["Core", aptitudeScores.core, 20],
                ["Verbal", aptitudeScores.verbal, 5],
                ["Programming", aptitudeScores.programming, 10],
                ["Comprehension", aptitudeScores.comprehension, 5]
            ];
            currentY = drawTable("Aptitude Scores", aptRows, totalApt, currentY);
            currentY += 10; 

            pdf.setFont("helvetica", "bold");
            pdf.setFontSize(15);
            pdf.setTextColor(30, 41, 59);
            pdf.text("Group Discussion", margin + 1, currentY);
            currentY += 6;

            const gdRows = [
                ["Subject Knowledge", gdScores.subject_knowledge, 10],
                ["Communication Skills", gdScores.communication_skills, 10],
                ["Body Language", gdScores.body_language, 10],
                ["Listening Skills", gdScores.listening_skills, 10],
                ["Active Participation", gdScores.active_participation, 10]
            ];
            currentY = drawTable("Group Discussion", gdRows, totalGD, currentY);
            currentY += 4;

            const scoreCardH = 28; 
            const scoreCardW = pageWidth - (margin * 2);


            pdf.setFillColor(248, 250, 252);
            pdf.roundedRect(margin, currentY, scoreCardW, scoreCardH, 4, 4, "F");

            pdf.setDrawColor(226, 232, 240);
            pdf.setLineWidth(0.4);
            pdf.roundedRect(margin, currentY, scoreCardW, scoreCardH, 4, 4, "S");

            pdf.setTextColor(100, 116, 139);
            pdf.setFont("helvetica", "bold");
            pdf.setFontSize(10);
            pdf.text("OVERALL PERFORMANCE", pageWidth / 2, currentY + 8, { align: "center" });

            pdf.setTextColor(15, 23, 42);
            pdf.setFontSize(28);
            pdf.text(`${overall} / 100`, pageWidth / 2, currentY + 20, { align: "center" });
            pdf.setTextColor(148, 163, 184); 
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
                <div className="flex justify-between items-center p-4">
                    <h2 className="font-semibold text-lg">Report Preview</h2>
                    <button onClick={onClose}>
                        <XMarkIcon className="w-6 h-6 text-gray-500" />
                    </button>
                </div>

                {/* CONTENT */}
                <div className="bg-gray-200/50 p-8 overflow-auto flex-1 flex justify-center">
                    <div
                        ref={pdfRef}
                        style={{
                            width: "210mm",
                            minHeight: "297mm",
                            backgroundColor: "#ffffff",
                            padding: "8mm 20mm 20mm 20mm", 
                            boxSizing: "border-box",
                            boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
                            display: "flex",
                            flexDirection: "column",
                        }}
                    >
                        {/* LOGOS (Aligned and balanced) */}
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "5mm" }}>
                            <img src={foreseBase64 || foreselogo} alt="Forese" style={{ height: "16mm", width: "auto", objectFit: "contain" }} />
                            <img src={svceBase64 || svcelogo} alt="SVCE" style={{ height: "10mm", width: "auto", objectFit: "contain" }} />
                        </div>

                        {/* TITLE (TIGHTER) */}
                        <div style={{ textAlign: "center", marginBottom: 12 }}>
                            <h1 style={{ fontSize: 26, fontWeight: 800, margin: 0, color: "#000000" }}>Mocks ’26</h1>
                            <p style={{ color: "#475569", marginTop: 2, fontSize: 13 }}>Performance Overview</p>
                        </div>

                        {/* STUDENT INFORMATION */}
                        <div style={{
                            border: "1px solid #e2e8f0",
                            borderRadius: 12,
                            padding: "12px 20px",
                            marginBottom: 16,
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
                                <div style={{ display: "flex", gap: 6 }}>
                                    <span style={{ color: "#64748b" }}>Name:</span>
                                    <span style={{ fontWeight: 700, color: "#1e293b" }}>{user.name}</span>
                                </div>
                                <div style={{ display: "flex", gap: 6 }}>
                                    <span style={{ color: "#64748b" }}>Reg No:</span>
                                    <span style={{ fontWeight: 700, color: "#1e293b" }}>{user.regno}</span>
                                </div>
                                <div style={{ display: "flex", gap: 6 }}>
                                    <span style={{ color: "#64748b" }}>Email:</span>
                                    <span style={{ fontWeight: 700, color: "#1e293b" }}>{user.email}</span>
                                </div>
                                <div style={{ display: "flex", gap: 6 }}>
                                    <span style={{ color: "#64748b" }}>Dept:</span>
                                    <span style={{ fontWeight: 700, color: "#1e293b" }}>{user.dept}</span>
                                </div>
                            </div>
                        </div>

                        {/* TABLES */}
                        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
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

                        {/* OVERALL PERFORMANCE */}
                        <div
                            style={{
                                marginTop: 16,
                                border: "1px solid #e2e8f0",
                                background: "#f8fafc",
                                color: "#1e293b",
                                padding: "14px",
                                borderRadius: 12,
                                textAlign: "center",
                            }}
                        >
                            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.05em", color: "#64748b", marginBottom: 4 }}>OVERALL PERFORMANCE</div>
                            <div style={{ fontSize: 32, fontWeight: 800 }}>
                                {overall} / 100
                            </div>
                        </div>
                    </div>
                </div>

                {/* FOOTER */}
                <div className="p-4 flex justify-end gap-3 bg-white rounded-b-xl">
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
        ["General Aptitude", scores.aptitude, 10],
        ["Core", scores.core, 20],
        ["Verbal", scores.verbal, 5],
        ["Programming", scores.programming, 10],
        ["Comprehension", scores.comprehension, 5],
    ];
    return <ScoreTable header="ASSESSMENT CATEGORY" rows={rows} total={total} />;
}

function GDCard({ scores, total }) {
    const rows = [
        ["Subject Knowledge", scores.subject_knowledge, 10],
        ["Communication Skills", scores.communication_skills, 10],
        ["Body Language", scores.body_language, 10],
        ["Listening Skills", scores.listening_skills, 10],
        ["Active Participation", scores.active_participation, 10],
    ];
    return <ScoreTable header="EVALUATION CRITERIA" rows={rows} total={total} />;
}

function ScoreTable({ header, rows, total }) {
    return (
        <div style={{ border: "1px solid #e5e7eb", borderRadius: 12, overflow: "hidden" }}>
            <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 12px", background: "#f8fafc", fontSize: 11, fontWeight: 700, color: "#64748b" }}>
                <span>{header}</span>
                <span>SCORE</span>
            </div>
            {rows.map(([label, val, max], i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "7.5px 12px", borderTop: "1px solid #f1f5f9", fontSize: 13, color: "#1e293b" }}>
                    <span style={{ color: "#475569" }}>{label}</span>
                    <span style={{ fontWeight: 700 }}>{val} / {max || 10}</span>
                </div>
            ))}
            <div style={{ display: "flex", justifyContent: "space-between", padding: "9px 12px", background: "#f1f5f9", fontWeight: 800, color: "#1e293b", fontSize: 13.5 }}>
                <span>Section Total</span>
                <span>{total} / 50</span>
            </div>
        </div>
    );
}