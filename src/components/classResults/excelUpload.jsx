import { useState, useEffect } from 'react';
import axios from 'axios';
import School from './SchoolName';
import ClassCard from './ClassCard';
import AcademicYearInput from './AcademicYearInput';
import ProgramInput from './ProgramInput';
import ExamNameInput from './ExamNameInput';
import ExamFormatInput from './ExamFormatInput';
import ClassInput from './classInput';

// 👇 import the org logo from assets
import spectropyLogo from '../../assets/spectropy.png';

const backendUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';

function ExcelUpload() {
  const [file, setFile] = useState(null);
  const [selectedSchool, setSelectedSchool] = useState('');
  const [schoolId, setSchoolId] = useState(null);
  const [response, setResponse] = useState(null);
  const [academicYear, setAcademicYear] = useState('');
  const [program, setProgram] = useState('');
  const [examName, setExamName] = useState('');
  const [examFormat, setExamFormat] = useState('');
  const [classValue, setClassValue] = useState('');
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [showReport, setShowReport] = useState(false);

  const [resultsKey, setResultsKey] = useState(0);

  useEffect(() => {
    const examDefaults = {
      CATALYST: 'CATALYST_WT_1',
      MAESTRO: 'MAESTRO_WT_1',
      PIONEER: 'PIONEER_WT_1',
      SR_PIONEER: 'SR_PIONEER_WT_1',
      FF: 'FF_WT_1',
      NGHS: 'NGHS_WT_1',
    };
    if (program && examDefaults[program]) setExamName(examDefaults[program]);
  }, [program]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploadSuccess(false);
    setShowReport(false);
    setResponse(null);

    if (!file) return alert('Please select an Excel file.');
    if (!selectedSchool) return alert('Please select or add a school.');
    if (!schoolId) return alert('School ID not found for selected school.');

    const formData = new FormData();
    formData.append('excel', file);
    formData.append('schoolId', schoolId);
    formData.append('academicYear', academicYear);
    formData.append('program', program);
    formData.append('examName', examName);
    formData.append('examFormat', examFormat);
    formData.append('classValue', classValue);

    setSubmitting(true);
    try {
      const res = await axios.post(`${backendUrl}/upload/class/excel`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setResponse(res.data);

      if (res.data?.status === 'Success') {
        setUploadSuccess(true);
        setResultsKey(Date.now());
      } else {
        setUploadSuccess(false);
      }
    } catch (error) {
      console.error('Upload error:', error);
      setResponse({ error: error.response?.data?.error || 'Upload failed' });
      setUploadSuccess(false);
    } finally {
      setSubmitting(false);
    }
  };

  const isFormValid =
    file && selectedSchool && schoolId && academicYear && program && examName && examFormat && classValue;

  const resetForm = () => {
    setFile(null);
    setSelectedSchool('');
    setSchoolId(null);
    setAcademicYear('');
    setProgram('');
    setExamName('');
    setExamFormat('');
    setClassValue('');
    setResponse(null);
    setUploadSuccess(false);
    setShowReport(false);
  };

  return (
    <div className="bg-light min-vh-100 d-flex flex-column">
      {/* Page header */}
      <header className="bg-white border-bottom">
        <div className="container py-3 d-flex justify-content-between align-items-center">
          <div>
            <h1 className="h4 mb-0 fw-bold">Upload Class Results</h1>
            <small className="text-muted">Teachers can upload Excel and publish results</small>
          </div>

          {/* 👇 show spectropy logo in header */}
          <div className="d-flex align-items-center gap-2">
            <img
              src={spectropyLogo}
              alt="Spectropy"
              style={{ height: 36, width: 'auto', objectFit: 'contain' }}
            />
          </div>
        </div>
      </header>

      {/* Form Card */}
      <main className="container my-4" style={{ maxWidth: 900 }}>
        <div className="card shadow-sm border-0">
          <div className="card-body">
            <form onSubmit={handleSubmit}>
              <div className="row g-3">
                <div className="col-md-6">
                  <AcademicYearInput academicYear={academicYear} setAcademicYear={setAcademicYear} />
                </div>
                <div className="col-md-6">
                  <ProgramInput program={program} setProgram={setProgram} />
                </div>
                <div className="col-md-6">
                  <ExamNameInput program={program} examName={examName} setExamName={setExamName} />
                </div>
                <div className="col-md-6">
                  <ExamFormatInput examFormat={examFormat} setExamFormat={setExamFormat} />
                </div>
                <div className="col-md-6">
                  <School
                    selectedSchool={selectedSchool}
                    setSelectedSchool={setSelectedSchool}
                    setSchoolId={setSchoolId}
                  />
                </div>
                <div className="col-md-6">
                  <ClassInput classValue={classValue} setClassValue={setClassValue} />
                </div>
                <div className="col-12">
                  <label className="form-label">Excel File</label>
                  <input
                    type="file"
                    accept=".xlsx"
                    className="form-control"
                    onChange={(e) => setFile(e.target.files[0])}
                  />
                  <div className="form-text">Accepted format: .xlsx</div>
                </div>
              </div>

              {/* Actions */}
              <div className="d-flex gap-2 mt-3">
                <button type="submit" className="btn btn-primary" disabled={!isFormValid || submitting}>
                  {submitting ? 'Uploading…' : 'Upload Results'}
                </button>
                <button type="button" className="btn btn-outline-secondary" onClick={resetForm} disabled={submitting}>
                  Reset
                </button>
                {uploadSuccess && (
                  <button
                    type="button"
                    className="btn btn-success ms-auto"
                    onClick={() => setShowReport(true)}
                    title="Show class report below"
                  >
                    View Class Report
                  </button>
                )}
              </div>
            </form>

            {/* Server Response */}
            {response && (
              <div className={`alert mt-4 ${uploadSuccess ? 'alert-success' : 'alert-info'}`} role="alert">
                <h5 className="alert-heading mb-2">Server Response</h5>
                <pre className="mb-0" style={{ whiteSpace: 'pre-wrap' }}>{JSON.stringify(response, null, 2)}</pre>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Class report appears after success + button click */}
      {uploadSuccess && showReport && (
        <section className="container mb-5">
          <ClassCard
            key={resultsKey}
            schoolName={selectedSchool}
            schoolId={schoolId}
            academicYear={academicYear}
            program={program}
            examName={examName}
            examFormat={examFormat}
            classValue={classValue}
            // 👇 pass the spectropy logo into ClassCard so it shows in header + watermark
            orgLogoUrl={spectropyLogo}
            orgName="Spectropy"
          />
        </section>
      )}
    </div>
  );
}

export default ExcelUpload;
