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
  classValue
}) => {
  const [students, setStudents] = useState([]);
  const [logoUrl, setLogoUrl] = useState('');
  const [tableKeys, setTableKeys] = useState([]);

  const date = new Date();
  const weekday = date.toLocaleString('en-US', { weekday: 'short' }); // "Wed"
  const month = date.toLocaleString('en-US', { month: 'short' });     // "Nov"
  const year = date.getFullYear();
  const currentDate = `${weekday}-${month}-${year}`; // "Wed-Nov-2025"

  useEffect(() => {
    const fetchLogo = async () => {
      if (!schoolName) return;
      const { data, error } = await supabase
        .from('schooldata')
        .select('schoollogo')
        .eq('id', schoolId)
        .single();
      
      console.log("data :", data);

      if (!error && data?.schoollogo) {
        setLogoUrl(data.schoollogo);
      } else {
        console.warn("Logo not found");
        setLogoUrl('');
      }
    };

    const fetchFilteredResults = async () => {
      if (!schoolId || !academicYear || !program || !examName || !examFormat || !classValue) return;

      const { data, error } = await supabase
        .from('results')
        .select('*')
        .eq('school_id', schoolId)
        .eq('academic_year', academicYear)
        .eq('program', program)
        .eq('exam_name', examName)
        .eq('exam_format', examFormat)
        .eq('class_name', classValue)
        .order('rank', { ascending: true });

      if (error) {
        console.error('Error fetching results:', error.message);
        setStudents([]);
      } else {
        setStudents(data || []);
      }
    };

    fetchLogo();
    fetchFilteredResults();
  }, [schoolId, academicYear, program, examName, examFormat, classValue, schoolName]);

  useEffect(() => {
    if (students.length === 0) return;

    const baseKeys = ["roll_no", "name", "total_marks", "rank"];
    const subjects = ["physics", "chemistry", "maths", "biology"];
    const availableSubjects = [];

    for (let subject of subjects) {
      const nullCount = students.filter(s => s[subject] === null || s[subject] === undefined).length;
      if (nullCount < students.length) {
        availableSubjects.push(subject);
      }
    }

    setTableKeys([
      baseKeys[0], // roll_no
      baseKeys[1], // name
      ...availableSubjects,
      baseKeys[2], // total_marks
      baseKeys[3], // rank
    ]);
  }, [students]);

  const handleDownloadPDF = () => {
    const element = document.getElementById('card-to-print');

    // Ensure the element is fully visible before capturing
    const customMargin = [0.4, 0.4, 0.3, 0.4]; // [top, left, bottom, right]

    const opt = {
      margin: customMargin,
      filename: `${schoolName}_results.pdf`,
      image: { type: 'jpeg', quality: 1 },
      html2canvas: {
        scale: 3,              // Higher = sharper image
        useCORS: true,
        allowTaint: true,
        scrollY: 0,
        logging: false,
        windowWidth: element.scrollWidth,
        windowHeight: element.scrollHeight
      },
      jsPDF: {
        unit: 'in',
        format: 'a4',
        orientation: 'landscape',
      },
      pagebreak: {
        mode: ['css', 'legacy'],
        avoid: ['tr', '.avoid-page-break', '.card-header', '.table thead'],
      },
    };

    html2pdf().set(opt).from(element).save();
  };


  if (!students || students.length === 0) return <p>No data available for this selection.</p>;

  console.log("Students Data :", students);

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
          <div className="d-flex border rounded mb-3 p-3 align-items-stretch" style={{
            background: 'linear-gradient(90deg, #f8f9fa, #e3f2fd)',
            border: '1px solid #ced4da',
            minHeight: '100px',
            fontFamily: 'Segoe UI, sans-serif',
          }}>
            {logoUrl && (
              <div style={{
                flex: '0 0 140px',
                marginLeft: '20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
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
                    backgroundColor: '#fff',
                  }}
                />
              </div>
            )}

            {/* Right */}
            <div className="flex-grow-1 d-flex flex-column justify-content-between">
              <div className='d-flex justify-content-around align-items-center'>
                <div className="text-center mb-2">
                  <div className="fw-bold fs-2" style={{ color: 'darkblue',textTransform: 'uppercase' }}>{schoolName}</div>
                  <div className="d-flex justify-content-center align-items-center">
                    <div style={{ flex: 1, height: '1px', backgroundColor: 'black' }}></div>
                    <div className="mx-2" style={{ fontSize: '1.7rem' }}>📖</div>
                    <div style={{ flex: 1, height: '1px', backgroundColor: 'black' }}></div>
                  </div>
                </div>
              </div>

              <div className="d-flex justify-content-around align-items-end" style={{ textTransform: 'uppercase'}}>
                <div className='text-start'>
                  <p className="mb-1"><strong>Class:</strong> {classValue}</p>
                  <p className="mb-1"><strong>Exam:</strong> {examName}</p>
                </div>
                <div className="text-start">
                  <p className="mb-1"><strong>Program:</strong> {program}</p>
                  <p className="mb-1"><strong>Date:</strong> {currentDate}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Table */}
          <div style={{ overflowX: "auto" }}>
            <table className="table table-sm table-hover text-center align-middle"
              style={{ fontSize: "0.9rem", borderCollapse: "collapse", width: "100%" }}>
              <thead className="table-primary">
                <tr>
                  {tableKeys.map((key, idx) => (
                    <th
                      key={idx}
                      className="text-nowrap text-capitalize"
                      style={{ border: '1px solid black', padding: '4px' }}
                    >
                      {key.replace(/_/g, ' ')}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {students.map((exam, index) => (
                  <tr key={index}>
                    {tableKeys.map((key, idx) => {
                      const value = exam[key];
                      return (
                        <td
                          key={idx}
                          className={key === "name" ? "text-start text-nowrap" : "text-center"}
                          style={{
                            border: '1px solid black',
                            padding: '4px',
                            maxWidth: key === "name" ? "200px" : undefined,
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            textTransform: "uppercase",
                            color: value === null || value === undefined ? "red" : undefined,
                          }}
                          title={value}
                        >
                          {value !== null && value !== undefined ? value : "AB"}
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
