import { useState } from "react";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Tooltip,
    Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const CRITERIA = [
    { key: "appearance_attitude", label: "Appearance & Attitude", max: 10 },
    { key: "managerial_aptitude", label: "Managerial Aptitude", max: 10 },
    { key: "general_awareness", label: "General Awareness", max: 10 },
    { key: "technical_knowledge", label: "Technical Knowledge", max: 10 },
    { key: "communication_skills", label: "Communication Skills", max: 10 },
    { key: "ambition", label: "Ambition", max: 10 },
    { key: "self_confidence", label: "Self Confidence", max: 10 },
];

const BAR_COLORS = [
    "#6366f1",
    "#3b82f6",
    "#14b8a6",
    "#f59e0b",
    "#ec4899",
    "#8b5cf6",
    "#10b981",
];

function NotEvaluated() {
    return (
        <div className="bg-white rounded-2xl shadow-sm p-8 flex flex-col items-center justify-center gap-4 text-center min-h-[260px]">
            <span className="material-icons text-5xl text-gray-300">
                pending_actions
            </span>
            <div>
                <h3 className="font-semibold text-gray-600 text-lg">
                    Interview Not Yet Completed
                </h3>
                <p className="text-sm text-gray-400 mt-1 max-w-xs">
                    Your HR interview evaluation will appear here once it has been
                    submitted by your interviewer.
                </p>
            </div>
        </div>
    );
}

function ScoreRow({ label, value, max }) {
    const pct = Math.round((value / max) * 100);
    return (
        <div className="flex flex-col gap-1 text-sm border-b border-gray-100 last:border-none pb-3 last:pb-0">
            <div className="flex justify-between items-center">
                <span className="text-gray-500">{label}</span>
                <span className="font-semibold">
                    {value}/{max}
                </span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-1.5">
                <div
                    className="h-1.5 rounded-full bg-indigo-500 transition-all"
                    style={{ width: `${pct}%` }}
                />
            </div>
        </div>
    );
}

function EvaluationCard({ evalData }) {
    const chartData = {
        labels: CRITERIA.map((c) =>
            c.label
                .split(" ")
                .map((w) => w.slice(0, 4) + ".")
                .join(" ")
        ),
        datasets: [
            {
                data: CRITERIA.map((c) => evalData[c.key] ?? 0),
                backgroundColor: BAR_COLORS,
                borderRadius: 6,
                barThickness: 28,
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
            y: {
                beginAtZero: true,
                max: 10,
                ticks: { stepSize: 2 },
                grid: { color: "rgba(0,0,0,0.05)" },
            },
            x: { grid: { display: false } },
        },
    };

    const date = evalData.evaluation_date
        ? new Date(evalData.evaluation_date).toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric",
        })
        : null;

    return (
        <div className="space-y-4">
            {/* Header card */}
            <div className="bg-white rounded-2xl shadow-sm p-4 lg:p-6">
                <div className="flex items-start justify-between mb-4 flex-wrap gap-2">
                    <div>
                        <h3 className="font-semibold text-sm lg:text-base flex items-center gap-2">
                            <span className="material-icons text-indigo-500">
                                record_voice_over
                            </span>
                            HR Interview Evaluation
                        </h3>
                        {/* HR name + company */}
                        <div className="mt-1 flex items-center gap-1.5 text-xs text-gray-500">
                            <span className="material-icons text-sm text-gray-400">person</span>
                            <span className="font-medium text-gray-700">{evalData.hr_name}</span>
                            {evalData.company_name && (
                                <>
                                    <span className="text-gray-300">·</span>
                                    <span className="material-icons text-sm text-gray-400">business</span>
                                    <span>{evalData.company_name}</span>
                                </>
                            )}
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        {date && (
                            <span className="hidden lg:inline text-xs text-gray-400">
                                {date}
                            </span>
                        )}
                        <span className="text-xs font-semibold bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full">
                            Overall: {Number(evalData.overall_score).toFixed(2)} / 10
                        </span>
                    </div>
                </div>

                {/* Chart + score rows */}
                <div className="flex flex-col lg:grid lg:grid-cols-2 lg:gap-8 lg:items-center">
                    <div className="h-48 lg:h-56">
                        <Bar data={chartData} options={options} />
                    </div>
                    <div className="mt-4 lg:mt-0 space-y-3">
                        {CRITERIA.map((c) => (
                            <ScoreRow
                                key={c.key}
                                label={c.label}
                                value={evalData[c.key] ?? 0}
                                max={c.max}
                            />
                        ))}
                    </div>
                </div>
            </div>

            {/* Feedback card */}
            {(evalData.strengths || evalData.improvements || evalData.comments) && (
                <div className="bg-white rounded-2xl shadow-sm p-4 lg:p-6 space-y-4">
                    <h4 className="font-semibold text-sm lg:text-base flex items-center gap-2">
                        <span className="material-icons text-indigo-500 text-base">
                            comment
                        </span>
                        Interviewer Feedback
                    </h4>
                    {evalData.strengths && (
                        <div>
                            <p className="text-xs font-semibold text-green-600 uppercase tracking-wide mb-1">
                                Strengths
                            </p>
                            <p className="text-sm text-gray-600 leading-relaxed">
                                {evalData.strengths}
                            </p>
                        </div>
                    )}
                    {evalData.improvements && (
                        <div>
                            <p className="text-xs font-semibold text-amber-500 uppercase tracking-wide mb-1">
                                Areas to Improve
                            </p>
                            <p className="text-sm text-gray-600 leading-relaxed">
                                {evalData.improvements}
                            </p>
                        </div>
                    )}
                    {evalData.comments && (
                        <div>
                            <p className="text-xs font-semibold text-indigo-500 uppercase tracking-wide mb-1">
                                Additional Comments
                            </p>
                            <p className="text-sm text-gray-600 leading-relaxed">
                                {evalData.comments}
                            </p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

export default function Evaluation({ data, loading }) {
    const [activeIdx, setActiveIdx] = useState(0);

    if (loading) {
        return (
            <div className="bg-white rounded-2xl shadow-sm p-8 flex items-center justify-center min-h-[200px]">
                <span className="text-indigo-500 text-sm font-medium animate-pulse">
                    Loading evaluation…
                </span>
            </div>
        );
    }

    if (!data || !data.evaluated) {
        return <NotEvaluated />;
    }

    const { evaluations } = data;

    // Single evaluation — render directly without tabs
    if (evaluations.length === 1) {
        return <EvaluationCard evalData={evaluations[0]} />;
    }

    // Multiple evaluations — show interview selector tabs
    return (
        <div className="space-y-4">
            {/* Interview selector */}
            <div className="bg-white rounded-2xl shadow-sm p-3">
                <p className="text-xs text-gray-400 font-medium mb-2 px-1">
                    {evaluations.length} interviews completed
                </p>
                <div className="flex flex-wrap gap-2">
                    {evaluations.map((ev, idx) => (
                        <button
                            key={ev.id}
                            onClick={() => setActiveIdx(idx)}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border ${activeIdx === idx
                                ? "bg-indigo-600 text-white border-indigo-600 shadow"
                                : "bg-white text-gray-600 border-gray-200 hover:border-indigo-300 hover:text-indigo-600"
                                }`}
                        >
                            <span className="material-icons text-sm">person</span>
                            <span>{ev.hr_name}</span>
                            {ev.company_name && (
                                <span className={`hidden sm:inline ${activeIdx === idx ? "text-indigo-200" : "text-gray-400"}`}>
                                    · {ev.company_name}
                                </span>
                            )}
                            <span className={`ml-1 px-1.5 py-0.5 rounded-full text-[10px] font-bold ${activeIdx === idx ? "bg-indigo-500 text-white" : "bg-gray-100 text-gray-500"}`}>
                                {Number(ev.overall_score).toFixed(1)}
                            </span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Active evaluation card */}
            <EvaluationCard evalData={evaluations[activeIdx]} />
        </div>
    );
}
