import { Link } from "react-router-dom";

const LinkTable = ({ links, onDelete }) => {
  const formatDate = (value) => (value ? new Date(value).toLocaleString() : "-");

  return (
    <div className="overflow-x-auto rounded-lg bg-white shadow dark:bg-slate-900">
      <table className="min-w-full text-sm">
        <thead className="bg-slate-100 dark:bg-slate-800">
          <tr>
            <th className="px-4 py-3 text-left">Short Code</th>
            <th className="px-4 py-3 text-left">Original URL</th>
            <th className="px-4 py-3 text-left">Clicks</th>
            <th className="px-4 py-3 text-left">Expiry</th>
            <th className="px-4 py-3 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {links.map((item) => (
            <tr key={item._id} className="border-t border-slate-200 dark:border-slate-800">
              <td className="px-4 py-3 font-medium">{item.code}</td>
              <td className="max-w-xs truncate px-4 py-3" title={item.originalUrl}>
                {item.originalUrl}
              </td>
              <td className="px-4 py-3">{item.clicks}</td>
              <td className="px-4 py-3">{formatDate(item.expiresAt)}</td>
              <td className="px-4 py-3">
                <div className="flex gap-3">
                  <button onClick={() => navigator.clipboard.writeText(`${window.location.origin}/${item.code}`)}>
                    Copy
                  </button>
                  <Link to={`/stats/${item.code}`}>Stats</Link>
                  <button
                    className="text-red-500"
                    onClick={() => {
                      if (window.confirm("Delete this link?")) onDelete(item.code);
                    }}
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default LinkTable;
