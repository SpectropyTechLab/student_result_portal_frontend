import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { supabase } from '../supabaseClient.js';
import ReportCard from './ReportCard';

function ReportPage() {
  const [rollNo, setRollNo] = useState('');
  const [records, setRecords] = useState([]);
  const [school, setSchool] = useState(null); // { id, name, area, schoollogo }
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const isRollValid = useMemo(() => /^\d+$/.test(rollNo.trim()), [rollNo]);

  const [searchParams] = useSearchParams();

  // Optional: support /report?roll=12345 deep link
  useEffect(() => {
    const qp = searchParams.get('roll');
    if (qp && /^\d+$/.test(qp)) {
      setRollNo(qp);
      // Auto fetch on landing via query param
      fetchStudent(qp);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function fetchStudent(roll = rollNo) {
    setError(null);
    setRecords([]);
    setSchool(null);

    const trimmed = String(roll).trim();
    if (!/^\d+$/.test(trimmed)) {
      setError('Please enter digits only.');
      return;
    }

    setLoading(true);
    try {
      const parsedRollNo = Number(trimmed);

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
        setError('No results found for this roll number.');
        return;
      }

      setRecords(results);

      const joinedSchool = results[0]?.schooldata;
      if (joinedSchool) {
        setSchool(joinedSchool);
      } else {
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
  }

  const onSubmit = (e) => {
    e.preventDefault();
    fetchStudent();
  };

  const clearForm = () => {
    setRollNo('');
    setError(null);
    setRecords([]);
    setSchool(null);
  };

  return (
    <div className="bg-light min-vh-100 d-flex flex-column">
      {/* Page header — matches App Navbar look (white + border-bottom) */}
      <header className="bg-white border-bottom">
        <div className="container py-3 d-flex justify-content-between align-items-center">
          <div>
            <h1 className="h4 mb-0 fw-bold">Student Report</h1>
            <small className="text-muted">Check your latest scores and rank</small>
          </div>
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb mb-0">
              <li className="breadcrumb-item"><a href="/">Home</a></li>
              <li className="breadcrumb-item active" aria-current="page">Report</li>
            </ol>
          </nav>
        </div>
      </header>

      {/* Search card */}
      <main className="container my-4" style={{ maxWidth: 800 }}>
        <div className="card shadow-sm border-0">
          <div className="card-body">
            <form onSubmit={onSubmit}>
              <div className="mb-3">
                <label htmlFor="rollInput" className="form-label">Roll Number</label>
                <input
                  id="rollInput"
                  type="text"
                  inputMode="numeric"
                  pattern="\d*"
                  value={rollNo}
                  onChange={(e) => setRollNo(e.target.value)}
                  placeholder="e.g., 12045"
                  className={`form-control ${rollNo && !isRollValid ? 'is-invalid' : ''}`}
                />
                <div className="form-text">
                  Digits only. If your roll has leading zeros, include them.
                </div>
              </div>

              <div className="d-flex gap-2">
                <button
                  type="submit"
                  className="btn btn-primary flex-grow-1"
                  disabled={loading || !rollNo}
                >
                  {loading ? 'Fetching…' : 'Get Report'}
                </button>
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={clearForm}
                  disabled={loading}
                >
                  Clear
                </button>
              </div>
            </form>



            {/* Alerts */}
            {error && (
              <div className="alert alert-danger mt-3 mb-0" role="alert">
                {error}
              </div>
            )}
            {!error && records.length === 0 && !loading && (
              <div className="alert alert-info mt-3 mb-0" role="alert">
                Enter your roll number and click <strong>Get Report</strong>.
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Results */}
      <section className="container mb-5" style={{ maxWidth: 1100 }}>
        {records.length > 0 && (
          <ReportCard
            students={records}
            schoolName={school?.name || 'Unknown School'}
            schoolArea={school?.area || ''}
            schoolLogoUrl={school?.schoollogo || ''}
          />
        )}
      </section>
    </div>
  );
}

export default ReportPage;
