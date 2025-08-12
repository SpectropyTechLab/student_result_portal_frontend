import React from 'react';

const fmtPct = (v) => (v == null || v === "" ? "—" : `${Number(v).toFixed(2)}%`);

const StudentInfo = ({ name, rollNo, avgPct }) => {
  return (
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
          <div className="fw-semibold">{rollNo ?? "—"}</div>
        </div>
      </div>
      <div className="col-md-4">
        <div className="p-3 rounded border bg-white">
          <div className="text-muted small">Overall Avg</div>
          <div className="fw-semibold">{fmtPct(avgPct)}</div>
        </div>
      </div>
    </div>
  );
};

export default StudentInfo;
