import { useState } from 'react';
import { supabase } from '../supabaseClient.js';
import ReportCard from './ReportCard';

function ReportPage() {
  const [rollNo, setRollNo] = useState('');
  const [records, setRecords] = useState([]);
  const [school, setSchool] = useState(null); // { id, name, area, schoollogo }
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchStudent = async () => {
    setError(null);
    setLoading(true);
    setRecords([]);
    setSchool(null);

    const parsedRollNo = Number(rollNo);
    if (!parsedRollNo) {
      setError('Enter a valid roll number');
      setLoading(false);
      return;
    }

    try {
      // Option A: single query with FK join (works if FK exists + RLS allows)
      const { data: results, error: resultsError } = await supabase
        .from('results')
        .select(`
          *,
          schooldata:school_id (
            id, name, area, schoollogo
          )
        `)
        .eq('roll_no', parsedRollNo)
        .order('uploaded_at', { ascending: false });

      if (resultsError) throw resultsError;
      if (!results || results.length === 0) {
        setError('No results found for this student.');
        setLoading(false);
        return;
      }

      setRecords(results);

      // Prefer school details from the first row’s joined schooldata
      const joinedSchool = results[0]?.schooldata;
      if (joinedSchool) {
        setSchool(joinedSchool);
      } else {
        // Fallback: if join didn’t return, fetch school separately
        const schoolId = results[0].school_id;
        const { data: schoolRow, error: schoolError } = await supabase
          .from('schooldata')
          .select('id, name, area, schoollogo')
          .eq('id', schoolId)
          .single();
        if (schoolError) throw schoolError;
        setSchool(schoolRow);
      }
    } catch (e) {
      console.error(e);
      setError('Something went wrong while fetching the report.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container d-flex flex-column align-items-center justify-content-center min-vh-100 py-5">
      <h1 className="mb-4 text-primary">Student Report Portal</h1>

      <div className="mb-4 d-flex gap-2">
        <input
          type="number" // if roll numbers can have leading zeros, switch to "text"
          value={rollNo}
          onChange={(e) => setRollNo(e.target.value)}
          placeholder="Enter Roll No"
          className="form-control"
          style={{ maxWidth: '200px' }}
        />
        <button onClick={fetchStudent} className="btn btn-primary" disabled={loading}>
          {loading ? 'Loading…' : 'Get Report'}
        </button>
      </div>

      {error && <p className="text-danger">{error}</p>}

      {records.length > 0 && (
        <ReportCard
          students={records}
          schoolName={school?.name || 'Unknown School'}
          schoolArea={school?.area || ''}
          schoolLogoUrl={school?.schoollogo || ''}
        // or just pass the whole school object if your component prefers:
        // school={school}
        />
      )}
    </div>
  );
}

export default ReportPage;
