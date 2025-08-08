import { useEffect, useState } from 'react';
import html2pdf from 'html2pdf.js';
import { supabase } from '../../supabaseClient';

const ClassCard = ({
  schoolName,
  schoolId,
  academicYear,
  program,
  examName,
  examFormat,
  classValue,
  key // optional: pass a changing value to force refetch without remount
}) => {
  const [students, setStudents] = useState([]);
  const [logoUrl, setLogoUrl] = useState('');
  const [tableKeys, setTableKeys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);

  const date = new Date();
  const weekday = date.toLocaleString('en-US', { weekday: 'short' });
  const month = date.toLocaleString('en-US', { month: 'short' });
  const year = date.getFullYear();
  const currentDate = `${weekday}-${month}-${year}`;

  // Fetch school logo
  useEffect(() => {
    const fetchLogo = async () => {
      if (!schoolId) return;
      const { data, error } = await supabase
        .from('schooldata')
        .select('schoollogo')
        .eq('id', schoolId)
        .single();

      if (!error && data?.schoollogo) setLogoUrl(data.schoollogo);
      else setLogoUrl('');
    };
    fetchLogo();
  }, [schoolId]);

  // Fetch results
  useEffect(() => {
    const fetchFilteredResults = async () => {
      if (!schoolId || !academicYear || !program || !examName || !examFormat || !classValue) return;
      setLoading(true);
      setErr(null);

      const { data, error } = await supabase
        .from('results')
        .select('*')
        .eq('school_id', schoolId)
        .eq('academic_year', academicYear)
        .eq('program', program)
        .eq('exam_name', examName)
        .eq('exam_format', examFormat)
        .eq('class_name', classValue)
        .order('rank', { ascending: true, nullsFirst: true });

      if (error) {
        setErr(error.message || 'Error fetching results');
        setStudents([]);
      } else {
        setStudents(data || []);
      }
      setLoading(false);
    };

    fetchFilteredResults();
  }, [schoolId, academicYear, program, examName, examFormat, classValue, key]);

  // Build table columns dynamically (includes percentage)
  useEffect(() => {
    if (students.length === 0) return;

    const baseKeys = ['roll_no', 'name'];
    const subjects = ['physics', 'chemistry', 'maths', 'biology'];

    const availableSubjects = subjects.filter((subj) =>
      students.some((s) => s[subj] !== null && s[subj] !== undefined)
    );

    const tailKeys = ['total_marks', 'rank', 'percentage'];

    setTableKeys([...baseKeys, ...availableSubjects, ...tailKeys]);
  }, [students]);

  const handleDownloadPDF = () => {
    const element = document.getElementById('card-to-print');
    const opt = {
      margin: [0.4, 0.4, 0.3, 0.4],
      filename: `${schoolName || 'School'}_results.pdf`,
      image: { type: 'jpeg', quality: 1 },
      html2canvas: {
        scale: 3,
        useCORS: true,
        allowTaint: true,
        scrollY: 0,
        logging: false,
        windowWidth: element?.scrollWidth || undefined,
        windowHeight: element?.scrollHeight || undefined
      },
      jsPDF: { unit: 'in', format: 'a4', orientation: 'landscape' },
      pagebreak: { mode: ['css', 'legacy'], avoid: ['tr', '.avoid-page-break', '.card-header', '.table thead'] }
    };
    html2pdf().set(opt).from(element).save();
  };

  if (loading) return <p>Loading results…</p>;
  if (err) return <p className="text-danger">Error: {err}</p>;
  if (!students || students.length === 0) return <p>No data available for this selection.</p>;

  return (
    <div className="container mt-4">
      <div className="text-end mb-3">
        <button className="btn btn-outline-primary" onClick={handleDownloadPDF}>
          Download PDF
        </button>
      </div>

      <div className="card shadow border-0 mb-5" id="card-to-print">
        <div className="card-body">
          {/* Header */}
          <div
            className="d-flex border rounded mb-3 p-3 align-items-stretch"
            style={{
              background: 'linear-gradient(90deg, #f8f9fa, #e3f2fd)',
              border: '1px solid #ced4da',
              minHeight: '100px',
              fontFamily: 'Segoe UI, sans-serif'
            }}
          >
            {logoUrl && (
              <div
                style={{
                  flex: '0 0 140px',
                  marginLeft: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <img
                  src={logoUrl}
                  alt="School Logo"
                  style={{
                    maxHeight: '190px',
                    maxWidth: '100%',
                    objectFit: 'contain',
                    borderRadius: '8px',
                    border: '1px solid #ccc',
                    padding: '3px',
                    backgroundColor: '#fff'
                  }}
                />
              </div>
            )}

            {/* Right */}
            <div className="flex-grow-1 d-flex flex-column justify-content-between">
              <div className="d-flex justify-content-around align-items-center">
                <div className="text-center mb-2">
                  <div className="fw-bold fs-2" style={{ color: 'darkblue', textTransform: 'uppercase' }}>
                    {schoolName}
                  </div>
                  <div className="d-flex justify-content-center align-items-center">
                    <div style={{ flex: 1, height: '1px', backgroundColor: 'black' }} />
                    <div className="mx-2" style={{ fontSize: '1.7rem' }}>
                      📖
                    </div>
                    <div style={{ flex: 1, height: '1px', backgroundColor: 'black' }} />
                  </div>
                </div>
              </div>

              <div className="d-flex justify-content-around align-items-end" style={{ textTransform: 'uppercase' }}>
                <div className="text-start">
                  <p className="mb-1">
                    <strong>Class:</strong> {classValue}
                  </p>
                  <p className="mb-1">
                    <strong>Exam:</strong> {examName}
                  </p>
                </div>
                <div className="text-start">
                  <p className="mb-1">
                    <strong>Program:</strong> {program}
                  </p>
                  <p className="mb-1">
                    <strong>Date:</strong> {currentDate}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Table */}
          <div style={{ overflowX: 'auto' }}>
            <table
              className="table table-sm table-hover text-center align-middle"
              style={{ fontSize: '0.9rem', borderCollapse: 'collapse', width: '100%' }}
            >
              <thead className="table-primary">
                <tr>
                  {tableKeys.map((key) => (
                    <th
                      key={key}
                      className="text-nowrap text-capitalize"
                      style={{ border: '1px solid black', padding: '4px' }}
                    >
                      {key.replace(/_/g, ' ')}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {students.map((row, idx) => (
                  <tr key={idx}>
                    {tableKeys.map((key) => {
                      const raw = row[key];

                      // Null/undefined -> AB
                      if (raw === null || raw === undefined) {
                        return (
                          <td
                            key={key}
                            className={key === 'name' ? 'text-start text-nowrap' : 'text-center'}
                            style={{ border: '1px solid black', padding: '4px', color: 'red', textTransform: 'uppercase' }}
                            title="Absent / Not available"
                          >
                            AB
                          </td>
                        );
                      }

                      // Format percentage nicely
                      const display =
                        key === 'percentage' ? `${Number(raw).toFixed(0)}%` : raw;

                      return (
                        <td
                          key={key}
                          className={key === 'name' ? 'text-start text-nowrap' : 'text-center'}
                          style={{
                            border: '1px solid black',
                            padding: '4px',
                            maxWidth: key === 'name' ? '200px' : undefined,
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            textTransform: key === 'name' ? 'none' : 'uppercase'
                          }}
                          title={String(display)}
                        >
                          {display}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="mt-3 text-muted text-end">
            Showing {students.length} result{students.length > 1 ? 's' : ''}.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ClassCard;
