import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import api from "../api/axios";
import LinkTable from "../components/LinkTable";

const Dashboard = () => {
  const [links, setLinks] = useState([]);

  const loadLinks = async () => {
    try {
      const { data } = await api.get("/api/links");
      setLinks(data);
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to load links");
    }
  };

  useEffect(() => {
    loadLinks();
  }, []);

  const totals = useMemo(
    () => ({
      links: links.length,
      clicks: links.reduce((acc, curr) => acc + (curr.clicks || 0), 0)
    }),
    [links]
  );

  const handleDelete = async (code) => {
    try {
      await api.delete(`/api/links/${code}`);
      toast.success("Link deleted");
      setLinks((prev) => prev.filter((item) => item.code !== code));
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to delete link");
    }
  };

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <h1 className="mb-6 text-3xl font-bold">Dashboard</h1>
      <div className="mb-6 grid gap-4 md:grid-cols-2">
        <div className="rounded bg-white p-5 shadow dark:bg-slate-900">
          <p className="text-sm text-slate-500">Total Links</p>
          <p className="mt-2 text-2xl font-semibold">{totals.links}</p>
        </div>
        <div className="rounded bg-white p-5 shadow dark:bg-slate-900">
          <p className="text-sm text-slate-500">Total Clicks</p>
          <p className="mt-2 text-2xl font-semibold">{totals.clicks}</p>
        </div>
      </div>
      <LinkTable links={links} onDelete={handleDelete} />
    </div>
  );
};

export default Dashboard;
