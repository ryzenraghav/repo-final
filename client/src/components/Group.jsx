import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend
);

export default function Group({ data: gdData }) {
  if (!gdData) return null;

  const chartData = {
    labels: ["Subj.", "Comm.", "Body", "Listn.", "Part."],
    datasets: [
      {
        data: [
          gdData.subject_knowledge || 0,
          gdData.communication_skills || 0,
          gdData.body_language || 0,
          gdData.listening_skills || 0,
          gdData.active_participation || 0
        ],
        backgroundColor: [
          "#6366f1",
          "#3b82f6",
          "#14b8a6",
          "#f59e0b",
          "#ec4899",
        ],
        borderRadius: 6,
        barThickness: 30,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 10,
        ticks: { stepSize: 2 },
        grid: { color: "rgba(0,0,0,0.05)" },
      },
      x: {
        grid: { display: false },
      },
    },
  };

  const total = gdData.total || 0;

  return (
    <div className="bg-white rounded-2xl shadow-sm p-4 lg:p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-sm lg:text-base flex items-center gap-2">
          <span className="material-icons text-indigo-500">groups</span>
          Group Discussion
        </h3>

        {/* Desktop total */}
        <span className="hidden lg:inline-block text-xs font-semibold bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full">
          Total: {total} / 50
        </span>
      </div>

      {/* Content */}
      <div className="flex flex-col lg:grid lg:grid-cols-2 lg:gap-8 lg:items-center">
        {/* Chart */}
        <div className="h-48 lg:h-56">
          <Bar data={chartData} options={options} />
        </div>

        {/* Score list */}
        <div className="mt-4 lg:mt-0 space-y-4">
          <ScoreRow label="Subject Knowledge" value={`${gdData.subject_knowledge || 0}/10`} />
          <ScoreRow label="Communication Skills" value={`${gdData.communication_skills || 0}/10`} />
          <ScoreRow label="Body Language" value={`${gdData.body_language || 0}/10`} />
          <ScoreRow label="Listening Skills" value={`${gdData.listening_skills || 0}/10`} />
          <ScoreRow label="Active Participation" value={`${gdData.active_participation || 0}/10`} />

          {/* Mobile total */}
          <div className="lg:hidden text-center pt-3 font-semibold text-sm border-t border-gray-200">
            Total: {total} / 50
          </div>
        </div>
      </div>
    </div>
  );
}

function ScoreRow({ label, value }) {
  return (
    <div className="flex justify-between items-center text-sm border-b border-gray-100 last:border-none pb-3 last:pb-0">
      <span className="text-gray-500">{label}</span>
      <span className="font-semibold">{value}</span>
    </div>
  );
}
