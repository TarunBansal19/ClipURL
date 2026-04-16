import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";

const StatCharts = ({ stats }) => (
  <div className="grid gap-6 md:grid-cols-2">
    <div className="rounded bg-white p-4 shadow dark:bg-slate-900">
      <h3 className="mb-3 font-semibold">Clicks Last 7 Days</h3>
      <ResponsiveContainer width="100%" height={260}>
        <LineChart data={stats.clicksPerDay}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="_id" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="count" stroke="#4f46e5" />
        </LineChart>
      </ResponsiveContainer>
    </div>
    <div className="rounded bg-white p-4 shadow dark:bg-slate-900">
      <h3 className="mb-3 font-semibold">Device Breakdown</h3>
      <ResponsiveContainer width="100%" height={260}>
        <PieChart>
          <Pie data={stats.deviceBreakdown} dataKey="count" nameKey="_id" outerRadius={90} fill="#22c55e" label />
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
    <div className="rounded bg-white p-4 shadow dark:bg-slate-900 md:col-span-2">
      <h3 className="mb-3 font-semibold">Top Countries</h3>
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={stats.topCountries}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="_id" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="count" fill="#f97316" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  </div>
);

export default StatCharts;
