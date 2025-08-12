import React from 'react';

const rankBadge = (r) => (r === 1 ? "🥇" : r === 2 ? "🥈" : r === 3 ? "🥉" : "🏷️");

const RankBadge = ({ rank }) => {
  if (!rank) return <span className="text-muted">—</span>;
  
  return (
    <span className="fw-semibold">
      {rankBadge(Number(rank))} {rank}
    </span>
  );
};

export default RankBadge;
