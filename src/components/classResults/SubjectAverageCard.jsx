import { useEffect, useState } from "react";
import { supabase } from "../../supabaseClient"; // adjust path if needed

// Optional chart (requires `recharts` to be installed)
import {
    ResponsiveContainer,
    BarChart,
    Bar,
    CartesianGrid,
    XAxis,
    YAxis,
    Tooltip,
    Legend,
} from "recharts";

export default function SubjectAverageCard({
    schoolId,
    classValue,
    examName,
    title = "Subjects Average",
}) {
    const [rows, setRows] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const canQuery = Boolean(schoolId && classValue && examName);

    useEffect(() => {
        let isMounted = true;

        async function fetchAverages() {
            if (!canQuery) {
                setRows([]);
                return;
            }

            setLoading(true);
            setError(null);

            try {
                const params = {
                    input_school_id: schoolId,
                    input_class_name: classValue,
                    input_exam_name: examName,
                };

                const { data, error } = await supabase.rpc(
                    "subject_average_percentage",
                    params
                );

                if (error) throw error;

                const order = ["Physics", "Chemistry", "Maths", "Biology"];
                const sorted = (data || []).sort(
                    (a, b) => order.indexOf(a.subject) - order.indexOf(b.subject)
                );

                if (isMounted) setRows(sorted);
            } catch (e) {
                if (isMounted) setError(e.message || "Failed to load averages");
            } finally {
                if (isMounted) setLoading(false);
            }
        }

        fetchAverages();
        return () => {
            isMounted = false;
        };
    }, [schoolId, classValue, examName, canQuery]);

    return (
        <div className="w-full rounded-2xl shadow p-4 bg-white border">
            <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold">{title}</h3>
                <div className="text-xs text-gray-500">
                    {canQuery ? `${classValue} • ${examName}` : "Select filters"}
                </div>
            </div>

            {!canQuery && (
                <p className="text-sm text-gray-500">
                    Provide school, class and exam to view averages.
                </p>
            )}

            {error && <p className="text-sm text-red-600">Error: {error}</p>}

            {loading ? (
                <div className="animate-pulse h-8 bg-gray-100 rounded" />
            ) : rows.length > 0 ? (
                <>
                    <div className="overflow-x-auto">
                        <table className="min-w-full table-bordered">
                            <thead>
                                <tr className="text-left text-sm">
                                    <th className="py-2 px-3 border-b">Subject</th>
                                    <th className="py-2 px-3 border-b">Average %</th>
                                </tr>
                            </thead>
                            <tbody>
                                {rows.map((r) => (
                                    <tr key={r.subject} className="text-sm">
                                        <td className="py-2 px-3 border-b">{r.subject}</td>
                                        <td className="py-2 px-3 border-b">
                                            {Number(r.average_percentage).toFixed(2)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Optional chart (comment out if you don't use recharts) */}
                    <div className="mt-4 h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={rows} margin={{ top: 10, right: 10, left: 0, bottom: 20 }}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="subject" />
                                <YAxis domain={[0, 100]} />
                                <Tooltip formatter={(v) => Number(v).toFixed(2)} />
                                <Legend />
                                <Bar dataKey="average_percentage" name="Average %" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </>
            ) : canQuery ? (
                <p className="text-sm text-gray-500">No data found for the selected filters.</p>
            ) : null}
        </div>
    );
}
