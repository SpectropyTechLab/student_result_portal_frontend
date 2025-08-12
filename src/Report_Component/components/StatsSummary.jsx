import React from 'react';

const fmtPct = (v) => (v == null || v === "" ? "—" : `${Number(v).toFixed(2)}%`);

const StatsSummary = ({ avgPct, bestPct, bestExam, recordCount }) => {
  return (
    <div className="d-flex gap-2 flex-wrap">
      <span className="badge bg-light text-dark border">Avg: {fmtPct(avgPct)}</span>
      <span className="badge bg-light text-dark border">
        Best: {bestPct != null ? fmtPct(bestPct) : "—"}
        {bestExam ? <span className="ms-1 text-muted">({bestExam})</span> : null}
      </span>
      <span className="badge bg-light text-dark border">Records: {recordCount}</span>
    </div>
  );
};

export default StatsSummary;
