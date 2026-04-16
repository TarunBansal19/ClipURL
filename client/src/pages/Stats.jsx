import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../api/axios";
import StatCharts from "../components/StatCharts";

const Stats = () => {
  const { code } = useParams();
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await api.get(`/api/links/${code}/stats`);
        setStats(data);
      } catch (err) {
        toast.error(err.response?.data?.error || "Failed to load stats");
      }
    };
    load();
  }, [code]);

  if (!stats) return <div className="p-6">Loading stats...</div>;

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <div className="mb-5 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Analytics for {code}</h1>
        <Link to="/dashboard" className="rounded bg-indigo-600 px-4 py-2 text-white">
          Back to Dashboard
        </Link>
      </div>
      <StatCharts stats={stats} />
    </div>
  );
};

export default Stats;
