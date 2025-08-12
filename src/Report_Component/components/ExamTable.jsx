import React from 'react';
import GradeBadge from './GradeBadge';
import RankBadge from './RankBadge';

const fmtPct = (v) => (v == null || v === "" ? "—" : `${Number(v).toFixed(2)}%`);
const cell = (v) => (v == null ? "—" : v);

const ExamTable = ({ group, rows, stats }) => {
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

  return (
    <section className="mb-4">
      <div className="d-flex align-items-center justify-content-between mb-2">
        <h5 className="mb-0">{group}</h5>
        <div className="d-flex gap-2 align-items-center">
          {/* <small className="text-muted">
            Showing {rows.length} result{rows.length > 1 ? "s" : ""}
          </small> */}
          <span className="badge bg-light text-dark border">Avg: {fmtPct(stats.avgPct)}</span>
          <span className="badge bg-light text-dark border">
            Best: {stats.bestPct != null ? fmtPct(stats.bestPct) : "—"}
            {stats.bestExam ? <span className="ms-1 text-muted">({stats.bestExam})</span> : null}
          </span>
        </div>
      </div>

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
            {rows.map((row, idx) => (
              <tr key={`${group}-${idx}`}>
                {tableKeys.map((key) => {
                  const v = row[key];

                  if (key === "percentage") return <td key={key}>{fmtPct(v)}</td>;
                  if (key === "grade") return <td key={key}><GradeBadge grade={v} /></td>;
                  if (key === "rank") return <td key={key}><RankBadge rank={v} /></td>;

                  return <td key={key}>{cell(v)}</td>;
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
        
    </section>
  )
};

export default ExamTable;
