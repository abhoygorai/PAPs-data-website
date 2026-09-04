import { useDeferredValue, useMemo, useState } from "react";
import type { EmploymentRecord } from "../services/googleSheet";

type EmploymentListProps = {
  title: string;
  subtitle: string;
  records: EmploymentRecord[];
  loading: boolean;
  error: string;
  onRefresh: () => void;
};

export function EmploymentList({
  title,
  subtitle,
  records,
  loading,
  error,
  onRefresh,
}: EmploymentListProps) {
  const [query, setQuery] = useState("");
  const deferredQuery = useDeferredValue(query);

  const filtered = useMemo(() => {
    const q = deferredQuery.trim().toLowerCase();
    if (!q) return records;

    return records.filter((r) =>
      [r.candidateName, r.fatherName, r.projectName, r.status, r.updatedOn]
        .join(" ")
        .toLowerCase()
        .includes(q),
    );
  }, [records, deferredQuery]);

  return (
    <section className="page-panel">
      <header className="page-header">
        <div>
          <h2 className="eyebrow">Employment records</h2>
          <h1>{title}</h1>
          <p className="page-subtitle">{subtitle}</p>
        </div>

        <button
          type="button"
          className="btn btn-secondary"
          onClick={onRefresh}
          disabled={loading}
        >
          {loading ? "Refreshing…" : "Refresh"}
        </button>
      </header>

      <div className="toolbar">
        <label className="search-field">
          <span className="sr-only">Search records</span>
          <svg
            className="search-icon"
            viewBox="0 0 24 24"
            aria-hidden="true"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-3.5-3.5" strokeLinecap="round" />
          </svg>
          <input
            type="search"
            placeholder="Search by name, project, or file status…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </label>

        <p className="result-count" aria-live="polite">
          {loading
            ? "Loading…"
            : `${filtered.length} of ${records.length} record${records.length === 1 ? "" : "s"}`}
        </p>
      </div>

      {error && (
        <div className="state-banner state-error" role="alert">
          <p>{error}</p>
          <button type="button" className="btn btn-secondary" onClick={onRefresh}>
            Try again
          </button>
        </div>
      )}

      {loading && !error && (
        <div className="state-banner state-loading" aria-busy="true">
          <div className="spinner" />
          <p>Fetching latest sheet data…</p>
        </div>
      )}

      {!loading && !error && filtered.length === 0 && (
        <div className="state-banner">
          <p>
            {records.length === 0
              ? "No records found in this sheet."
              : "No records match your search."}
          </p>
        </div>
      )}

      {!loading && !error && filtered.length > 0 && (
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Name of the candidate</th>
                <th>Name of father</th>
                <th>Project name</th>
                <th>Present status of the file</th>
                <th>Updated on date</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((record, index) => (
                <tr key={`${record.candidateName}-${index}`}>
                  <td>
                    <span className="cell-primary">{record.candidateName}</span>
                  </td>
                  <td>{record.fatherName}</td>
                  <td>{record.projectName}</td>
                  <td>{record.status}</td>
                  <td className="cell-muted">{record.updatedOn}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
