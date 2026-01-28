import { Chart as ChartJS, registerables } from "chart.js";
import { Doughnut } from "react-chartjs-2";

ChartJS.register(...registerables);
export default function Group({ data: gdData }) {
  if (!gdData) return null;

  const chartData = {
    labels: ["Subject Knowledge", "Communication Skills", "Body Language", "Listening Skills", "Active Participation"],
    datasets: [
      {
        data: [
          gdData.subject_knowledge,
          gdData.communication_skills,
          gdData.body_language,
          gdData.listening_skills,
          gdData.active_participation
        ],
        backgroundColor: ["#34d399", "#818cf8", "#fcd34d", "#f87171", "#0ea5e9"],
        borderWidth: 0,
        spacing: 6,
        borderRadius: 3,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: "71%",
    plugins: { legend: { display: false } }
  };

  const total = gdData.total || 0;
  const percentage = total > 0 ? Math.round((total / 50) * 100) : 0;

  return (
    <div className="bg-white rounded-2xl shadow-sm p-4 lg:p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="material-icons text-indigo-500">groups</span>
          <h3 className="font-semibold text-sm lg:text-base">
            Group Discussion (GD)
          </h3>
        </div>

        <span className="hidden lg:inline-block text-xs font-semibold bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full">
          Total: {gdData.total} / 50
        </span>
      </div>

      <div className="flex flex-col lg:grid lg:grid-cols-2 lg:gap-8 lg:items-center">
        <div className="relative h-56 flex items-center justify-center">
          <Doughnut data={chartData} options={options} />
          <div className="absolute text-center">
            <p className="text-3xl font-bold">{percentage}%</p>
            <p className="text-xs text-gray-500">GD Score</p>
          </div>
        </div>

        <div className="mt-6 lg:mt-0 space-y-4">
          <ScoreRow label="Subject Knowledge" value={`${gdData.subject_knowledge || 0}/10`} />
          <ScoreRow label="Communication Skills" value={`${gdData.communication_skills || 0}/10`} />
          <ScoreRow label="Body Language" value={`${gdData.body_language || 0}/10`} />
          <ScoreRow label="Listening Skills" value={`${gdData.listening_skills || 0}/10`} />
          <ScoreRow label="Active Participation" value={`${gdData.active_participation || 0}/10`} />

          <div className="lg:hidden mt-4 text-center pt-4 font-semibold text-sm border-t border-gray-200">
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
