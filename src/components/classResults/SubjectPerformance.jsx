import { useEffect, useState } from "react";
import { supabase } from "../../supabaseClient"; // adjust path

export default function SubjectBucketsCard({ schoolId, classValue, examName }) {
    const [rows, setRows] = useState([]);
    const [loading, setLoading] = useState(true);

    const rangesOrder = [
        "91-100%",
        "81-90%",
        "71-80%",
        "61-70%",
        "51-60%",
        "41-50%",
        "0-40%",
        "Absent",
    ];
    const subjectsOrder = ["Physics", "Chemistry", "Biology", "Maths"];

    useEffect(() => {
        async function fetchBuckets() {
            setLoading(true);
            const params = {
                input_school_id: schoolId ?? null,
                input_class_name: classValue ?? null,
                input_exam_name: examName ?? null,
            };

            const { data, error } = await supabase.rpc("subject_percentage_buckets", params);
            if (error) {
                console.error("Error fetching subject buckets:", error);
                setRows([]);
            } else {
                setRows(Array.isArray(data) ? data : []);
            }
            setLoading(false);
        }

        if (schoolId && classValue && examName) {
            fetchBuckets();
        } else {
            setRows([]);
            setLoading(false);
        }
    }, [schoolId, classValue, examName]);

    if (loading) return <div>Loading subject performance...</div>;
    if (!rows || rows.length === 0) {
        return <div>No subject performance data available for this selection.</div>;
    }

    // Build a { [marks_range]: { [subject]: count } } map
    const countMap = {};
    for (const { subject, marks_range, student_count } of rows) {
        if (!countMap[marks_range]) countMap[marks_range] = {};
        countMap[marks_range][subject] = Number(student_count) || 0;
    }

    // Ensure all cells exist (default 0)
    for (const r of rangesOrder) {
        if (!countMap[r]) countMap[r] = {};
        for (const s of subjectsOrder) {
            if (countMap[r][s] == null) countMap[r][s] = 0;
        }
    }

    // (Optional) Precompute column totals if you want a footer later
    const columnTotals = subjectsOrder.reduce((acc, s) => {
        acc[s] = rangesOrder.reduce((sum, r) => sum + countMap[r][s], 0);
        return acc;
    }, {});
    const grandTotal = Object.values(columnTotals).reduce((a, b) => a + b, 0);

    return (
        <div className="subject-buckets-container">
            <h2 className="mb-4">Subject Performance Analysis</h2>
            <div className="table-responsive">
                <table className="table table-sm table-bordered">
                    <thead>
                        <tr>
                            <th>Marks Range</th>
                            {subjectsOrder.map((subj) => (
                                <th key={subj}>{subj}</th>
                            ))}
                            {/* NEW: Total column */}
                            <th>Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        {rangesOrder.map((range) => {
                            const rowTotal = subjectsOrder.reduce(
                                (sum, subj) => sum + countMap[range][subj],
                                0
                            ); // ← compute row total
                            return (
                                <tr key={range}>
                                    <td>{range}</td>
                                    {subjectsOrder.map((subj) => (
                                        <td key={`${range}-${subj}`}>{countMap[range][subj]}</td>
                                    ))}
                                    {/* NEW: render row total */}
                                    <td><strong>{rowTotal}</strong></td>
                                </tr>
                            );
                        })}
                    </tbody>

                    {/* (Optional) Totals row across all ranges */}
                    {/* Uncomment if you want a footer row with per-subject totals + grand total
          <tfoot>
            <tr>
              <th>Total</th>
              {subjectsOrder.map((subj) => (
                <th key={`coltotal-${subj}`}>{columnTotals[subj]}</th>
              ))}
              <th>{grandTotal}</th>
            </tr>
          </tfoot>
          */}
                </table>
            </div>
        </div>
    );
}
