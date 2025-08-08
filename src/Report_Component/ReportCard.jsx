const ReportCard = ({ students, schoolName, schoolArea = '', schoolLogoUrl = '' }) => {
  if (!students || students.length === 0) return <p>No data available.</p>;

  // Pull student info from the first record
  const { name, roll_no } = students[0] || {};

  // Columns to show (same as before)
  const tableKeys = [
    "exam",
    "physics",
    "chemistry",
    "maths",
    "biology",
    "total_marks",
    "grade",
    "rank",
    "percentage"
  ];

  return (
    <div className="container mt-4">
      <div className="card shadow border-0 mb-5">
        <div className="card-body">
          {/* Header with school logo + name */}
          <div className="d-flex align-items-center justify-content-between mb-4">
            <div className="d-flex align-items-center gap-3">
              {schoolLogoUrl ? (
                <img
                  src={schoolLogoUrl}
                  alt={`${schoolName} logo`}
                  style={{ width: 64, height: 64, objectFit: "contain" }}
                />
              ) : (
                <div
                  style={{
                    width: 64,
                    height: 64,
                    background: "#eef2f7",
                    borderRadius: 8
                  }}
                />
              )}
              <div>
                <h2 className="card-title text-primary mb-0">{schoolName}</h2>
                {schoolArea && (
                  <small className="text-muted">Area: {schoolArea}</small>
                )}
              </div>
            </div>
            <div className="text-end">
              <div className="fw-semibold">Report Card</div>
              <small className="text-muted">
                Showing {students.length} result{students.length > 1 ? "s" : ""}
              </small>
            </div>
          </div>

          {/* Student Info */}
          <ul className="list-group list-group-flush mb-4">
            <li className="list-group-item">
              <strong>Name:</strong> {name || "-"}
            </li>
            <li className="list-group-item">
              <strong>Roll No:</strong> {roll_no ?? "-"}
            </li>
          </ul>

          {/* Exam Table */}
          <div className="table-responsive">
            <table className="table table-bordered text-center align-middle">
              <thead className="table-primary">
                <tr>
                  {tableKeys.map((key) => (
                    <th key={key} style={{ textTransform: "capitalize" }}>
                      {key.replace(/_/g, " ")}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {students.map((row, idx) => (
                  <tr key={idx}>
                    {tableKeys.map((key) => (
                      <td key={key}>
                        {row[key] !== null && row[key] !== undefined ? row[key] : "-"}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Footer note */}
          <p className="mt-3 text-muted text-end">
            Latest first
          </p>
        </div>
      </div>
    </div>
  );
};

export default ReportCard;
