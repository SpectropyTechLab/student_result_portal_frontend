import React, { useMemo } from "react";

const gradeBadgeClass = (g) => {
  if (!g) return "bg-secondary";
  const G = String(g).toUpperCase();
  if (["A+", "A"].includes(G)) return "bg-success";
  if (["B+", "B"].includes(G)) return "bg-primary";
  if (["C+", "C"].includes(G)) return "bg-warning text-dark";
  return "bg-danger";
};

const rankBadge = (r) => (r === 1 ? "🥇" : r === 2 ? "🥈" : r === 3 ? "🥉" : "🏷️");
const fmtPct = (v) => (v == null || v === "" ? "—" : `${Number(v).toFixed(2)}%`);
const cell = (v) => (v == null ? "—" : v);

const ReportCard = ({ students, schoolName, schoolArea = "", schoolLogoUrl = "" }) => {
  if (!students || students.length === 0) return <p>No data available.</p>;

  const { name, roll_no } = students[0] || {};

  const tableKeys = [
    "exam",
    "physics",
    "chemistry",
    "maths",
    "biology",
    "total_marks",
    "grade",
    "rank",
    "percentage",
  ];

  const { avgPct, bestPct, bestExam } = useMemo(() => {
    const valid = students.filter((s) => s.percentage != null);
    const avg =
      valid.reduce((a, b) => a + Number(b.percentage || 0), 0) / (valid.length || 1);
    const best = valid.reduce(
      (acc, cur) =>
        Number(cur.percentage) > acc.bestPct
          ? { bestPct: Number(cur.percentage), bestExam: cur.exam }
          : acc,
      { bestPct: -Infinity, bestExam: null }
    );
    return {
      avgPct: isFinite(avg) ? avg : 0,
      bestPct: isFinite(best.bestPct) ? best.bestPct : null,
      bestExam: best.bestExam,
    };
  }, [students]);

  return (
    <div className="container mt-4">
      <div className="card shadow-sm border-0 mb-5">
        {/* Card header — simple, App-like */}
        <div className="card-header bg-white border-bottom-0">
          <div className="d-flex align-items-center justify-content-between">
            <div className="d-flex align-items-center gap-3">
              {schoolLogoUrl ? (
                <img
                  src={schoolLogoUrl}
                  alt={`${schoolName} logo`}
                  style={{ width: 64, height: 64, objectFit: "contain", borderRadius: 8 }}
                />
              ) : (
                <div style={{ width: 64, height: 64, background: "#f3f4f6", borderRadius: 8 }} />
              )}
              <div>
                <h2 className="h5 mb-0 fw-bold">{schoolName}</h2>
                {schoolArea && <small className="text-muted">Area: {schoolArea}</small>}
              </div>
            </div>

            {/* Compact stats */}
            <div className="d-flex gap-2 flex-wrap">
              <span className="badge bg-light text-dark border">Avg: {fmtPct(avgPct)}</span>
              <span className="badge bg-light text-dark border">
                Best: {bestPct != null ? fmtPct(bestPct) : "—"}
                {bestExam ? <span className="ms-1 text-muted">({bestExam})</span> : null}
              </span>
              <span className="badge bg-light text-dark border">Records: {students.length}</span>
            </div>
          </div>
        </div>

        <div className="card-body">
          {/* Student info row */}
          <div className="row g-3 mb-3">
            <div className="col-md-4">
              <div className="p-3 rounded border bg-white">
                <div className="text-muted small">Student</div>
                <div className="fw-semibold">{name || "—"}</div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="p-3 rounded border bg-white">
                <div className="text-muted small">Roll No</div>
                <div className="fw-semibold">{roll_no ?? "—"}</div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="p-3 rounded border bg-white">
                <div className="text-muted small">Highlight</div>
                <div className="fw-semibold">
                  {bestPct != null ? `Top: ${fmtPct(bestPct)}` : "—"}
                </div>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="table-responsive">
            <table className="table table-striped align-middle">
              <thead className="table-light">
                <tr>
                  {tableKeys.map((key) => (
                    <th key={key} className="text-nowrap">
                      {key.replace(/_/g, " ").replace(/\b\w/g, (m) => m.toUpperCase())}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {students.map((row, idx) => (
                  <tr key={idx}>
                    {tableKeys.map((key) => {
                      const v = row[key];

                      if (key === "percentage") {
                        return <td key={key}>{fmtPct(v)}</td>;
                      }

                      if (key === "grade") {
                        return v ? (
                          <td key={key}>
                            <span className={`badge rounded-pill ${gradeBadgeClass(v)}`}>
                              {String(v).toUpperCase()}
                            </span>
                          </td>
                        ) : (
                          <td key={key} className="text-muted">—</td>
                        );
                      }

                      if (key === "rank") {
                        return (
                          <td key={key}>
                            {v ? (
                              <span className="fw-semibold">
                                {rankBadge(Number(v))} {v}
                              </span>
                            ) : (
                              <span className="text-muted">—</span>
                            )}
                          </td>
                        );
                      }

                      return <td key={key}>{cell(v)}</td>;
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Footer note */}
          <div className="d-flex justify-content-between align-items-center mt-2">
            <span className="text-muted small">Latest first</span>
            <span className="text-muted small">More actions coming soon</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportCard;
