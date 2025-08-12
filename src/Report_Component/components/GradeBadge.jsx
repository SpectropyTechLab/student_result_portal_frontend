import React from 'react';

const gradeBadgeClass = (g) => {
  if (!g) return "bg-secondary";
  const G = String(g).toUpperCase();
  if (["A+", "A"].includes(G)) return "bg-success";
  if (["B+", "B"].includes(G)) return "bg-primary";
  if (["C", "D"].includes(G)) return "bg-warning text-dark";
  return "bg-danger";
};

const GradeBadge = ({ grade }) => {
  if (!grade) return <span className="text-muted">—</span>;
  
  return (
    <span className={`badge rounded-pill ${gradeBadgeClass(grade)}`}>
      {String(grade).toUpperCase()}
    </span>
  );
};

export default GradeBadge;
