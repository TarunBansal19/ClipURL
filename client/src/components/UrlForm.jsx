import { useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import toast from "react-hot-toast";
import api from "../api/axios";

const UrlForm = () => {
  const [form, setForm] = useState({ url: "", alias: "", expiresAt: "" });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        url: form.url,
        ...(form.alias ? { alias: form.alias } : {}),
        ...(form.expiresAt ? { expiresAt: form.expiresAt } : {})
      };
      const { data } = await api.post("/api/shorten", payload);
      setResult(data);
      toast.success("Short link created");
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to shorten URL");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-xl bg-white p-6 shadow dark:bg-slate-900">
      <form onSubmit={submit} className="space-y-4">
        <input
          className="w-full rounded border p-3 dark:bg-slate-800"
          placeholder="https://example.com/very-long-url"
          value={form.url}
          onChange={(e) => setForm({ ...form, url: e.target.value })}
          required
        />
        <div className="grid gap-3 md:grid-cols-2">
          <input
            className="rounded border p-3 dark:bg-slate-800"
            placeholder="Custom alias (optional)"
            value={form.alias}
            onChange={(e) => setForm({ ...form, alias: e.target.value })}
          />
          <input
            type="datetime-local"
            className="rounded border p-3 dark:bg-slate-800"
            value={form.expiresAt}
            onChange={(e) => setForm({ ...form, expiresAt: e.target.value })}
          />
        </div>
        <button className="rounded bg-indigo-600 px-5 py-2 text-white" disabled={loading}>
          {loading ? "Creating..." : "Shorten URL"}
        </button>
      </form>

      {result && (
        <div className="mt-6 rounded border border-indigo-200 p-4 dark:border-indigo-800">
          <p className="mb-2 text-sm text-slate-500">Your short link</p>
          <div className="flex flex-wrap items-center gap-3">
            <a className="font-medium text-indigo-600" href={result.shortUrl} target="_blank" rel="noreferrer">
              {result.shortUrl}
            </a>
            <button
              className="rounded border px-3 py-1 text-sm"
              onClick={() => navigator.clipboard.writeText(result.shortUrl)}
            >
              Copy
            </button>
          </div>
          <div className="mt-4">
            <QRCodeSVG value={result.shortUrl} size={120} />
          </div>
        </div>
      )}
    </div>
  );
};

export default UrlForm;
