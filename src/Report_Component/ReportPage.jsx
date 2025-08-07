import { useState } from 'react';
import { supabase } from '../supabaseClient.js';
import ReportCard from './ReportCard';

function ReportPage() {
  const [rollNo, setRollNo] = useState('');
  const [records, setRecords] = useState([]);
  const [schoolName, setSchoolName] = useState('');
  const [error, setError] = useState(null);

  const fetchStudent = async () => {
    const parsedRollNo = Number(rollNo);
    if (!parsedRollNo || rollNo.length < 3) {
      setError("Enter a valid roll number (at least 3 digits)");
      return;
    }

    const schoolId = Number(rollNo.slice(0, 2)); // extract school_id from roll_no
    console.log("school id: ",schoolId);

    // Fetch all results of the same roll number and school
    const { data: results, error: resultsError } = await supabase
      .from('student_results')
      .select('*')
      .eq('roll_no', parsedRollNo)
      .eq('school_id', schoolId);

      console.log(results);

    if (resultsError || !results || results.length === 0) {
      setError("No results found for this student.");
      setRecords([]);
      setSchoolName('');
      return;
    }

    // Fetch school name
    const { data: schoolData, error: schoolError } = await supabase
      .from('schools')
      .select('name')
      .eq('id', schoolId)
      .single();

    setRecords(results);
    setSchoolName(schoolData?.name || 'Unknown School');
    setError(null);
  };

  console.log("Student data :", records);

  return (
    <div className="container d-flex flex-column align-items-center justify-content-center min-vh-100 py-5">
      <h1 className="mb-4 text-primary">Student Report Portal</h1>

      <div className="mb-4 d-flex gap-2">
        <input
          type="number"
          value={rollNo}
          onChange={(e) => setRollNo(e.target.value)}
          placeholder="Enter Roll No"
          className="form-control"
          style={{ maxWidth: '200px' }}
        />
        <button onClick={fetchStudent} className="btn btn-primary">
          Get Report
        </button>
      </div>

      {error && <p className="text-danger">{error}</p>}
      {records.length > 0 && (
        <ReportCard students={records} schoolName={schoolName} />
      )}
    </div>
  );
}

export default ReportPage;
