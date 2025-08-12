import React from 'react';

const SchoolHeader = ({ schoolName, schoolArea, schoolLogoUrl }) => {
  return (
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

        {/* Compact stats will be handled by StatsSummary component */}
      </div>
    </div>
  );
};

export default SchoolHeader;
