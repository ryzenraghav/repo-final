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

export default function Aptitude({ data: aptData }) {
  if (!aptData) return null;

  const chartData = {
    labels: ["Aptitude", "Core", "Verbal", "Prog.", "Comp."],
    datasets: [
      {
        data: [
          aptData.aptitude,
          aptData.core,
          aptData.verbal,
          aptData.programming,
          aptData.comprehension
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

  return (
    <div className="bg-white rounded-2xl shadow-sm p-4 lg:p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-sm lg:text-base flex items-center gap-2">
          <span className="material-icons text-indigo-500 text-lg">
            bar_chart
          </span>
          Aptitude Scores
        </h3>

        {/* Desktop total */}
        <span className="hidden lg:inline-block text-xs font-semibold bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full">
          Total: {aptData.total} / 50
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
          <ScoreRow label="Aptitude" value={`${aptData.aptitude}/10`} />
          <ScoreRow label="Core" value={`${aptData.core}/10`} />
          <ScoreRow label="Verbal" value={`${aptData.verbal}/10`} />
          <ScoreRow label="Programming" value={`${aptData.programming}/10`} />
          <ScoreRow label="Comprehension" value={`${aptData.comprehension}/10`} />

          {/* Mobile total */}
          <div className="lg:hidden text-center pt-3 font-semibold text-sm border-t border-gray-200">
            Total: {aptData.total} / 50
          </div>
        </div>
      </div>
    </div>
  );
}

function ScoreRow({ label, value }) {
  return (
    <div className="flex justify-between items-center text-sm">
      <span className="text-gray-500">{label}</span>
      <span className="font-semibold">{value}</span>
    </div>
  );
}
