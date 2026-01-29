import React, { useRef, useState } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { XMarkIcon } from "@heroicons/react/24/solid";
import ReportTemplate from "./ReportTemplate";

export default function PdfPreviewModal({ isOpen, onClose, user }) {
    const pdfRef = useRef(null);
    const [isGenerating, setIsGenerating] = useState(false);

    if (!isOpen || !user) return null;

    //download
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
                    <ReportTemplate ref={pdfRef} user={user} />
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