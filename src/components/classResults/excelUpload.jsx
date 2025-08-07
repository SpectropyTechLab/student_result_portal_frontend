import { useState, useEffect } from 'react';
import axios from 'axios';
// import { supabase } from '../../supabaseClient';
import School from './SchoolName';
import ClassCard from './ClassCard';
import AcademicYearInput from './AcademicYearInput';
import ProgramInput from './ProgramInput';
import ExamNameInput from './ExamNameInput';
import ExamFormatInput from './ExamFormatInput';
import ClassInput from './classInput';

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

  // 🧠 Auto-fill default exam name when program changes
  useEffect(() => {
    const examDefaults = {
      CATALYST: 'CATALYST_WT_1',
      MAESTRO: 'MAESTRO_WT_1',
      PIONEER: 'PIONEER_WT_1',
      SR_PIONEER: 'SR_PIONEER_WT_1',
      FF: 'FF_WT_1',
      NGHS: 'NGHS_WT_1',
    };

    if (program && examDefaults[program]) {
      setExamName(examDefaults[program]);
    }
  }, [program]);

  // ✅ Form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) return alert('Please select an Excel file.');
    if (!selectedSchool) return alert('Please select or add a school.');
    if (!schoolId) return alert('School ID not found for selected school.');

    const formData = new FormData();
    formData.append('excel', file);
    formData.append('schoolId', schoolId); // ✅ Only ID used now
    formData.append('academicYear', academicYear);
    formData.append('program', program);
    formData.append('examName', examName);
    formData.append('examFormat', examFormat);
    formData.append('classValue', classValue);

    try {
      const res = await axios.post(`${backendUrl}/upload/class/excel`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      console.log('Upload response:', res.data);
      setResponse(res.data);
      setUploadSuccess(res.data.status === 'Success');
    } catch (error) {
      console.error('Upload error:', error);
      setResponse({ error: error.response?.data?.error || 'Upload failed' });
      setUploadSuccess(false);
    }
  };

  // 🔒 Form validation
  const isFormValid = file && selectedSchool && schoolId && academicYear && program && examName && examFormat && classValue;

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <h3 className="mb-4">Upload Excel File</h3>
          <form onSubmit={handleSubmit}>

            {/* 🗓 Academic Year */}
            <div className="mb-3">
              <AcademicYearInput academicYear={academicYear} setAcademicYear={setAcademicYear} />
            </div>

            {/* 🎯 Program */}
            <div className="mb-3">
              <ProgramInput program={program} setProgram={setProgram} />
            </div>

            {/* 📝 Exam Name */}
            <div className="mb-3">
              <ExamNameInput program={program} examName={examName} setExamName={setExamName} />
            </div>

            {/* 📚 Exam Format */}
            <div className="mb-3">
              <ExamFormatInput examFormat={examFormat} setExamFormat={setExamFormat} />
            </div>

            {/* 🏫 School Selector */}
            <div className="mb-3">
              <School selectedSchool={selectedSchool} setSelectedSchool={setSelectedSchool} setSchoolId={setSchoolId} />
            </div>

            {/* 📘 Class Selector */}
            <div className="mb-3">
              <ClassInput classValue={classValue} setClassValue={setClassValue} />
            </div>

            {/* 📄 File Upload */}
            <div className="mb-3">
              <label className="form-label">Excel File</label>
              <input
                type="file"
                accept=".xlsx"
                className="form-control"
                onChange={(e) => setFile(e.target.files[0])}
              />
            </div>

            <button type="submit" className="btn btn-primary w-100" disabled={!isFormValid}>
              Upload Results
            </button>
          </form>

          {/* ✅ Server Response */}
          {response && (
            <div className="alert alert-info mt-4" role="alert">
              <h5 className="alert-heading">Server Response</h5>
              <pre className="mb-0">{JSON.stringify(response, null, 2)}</pre>
            </div>
          )}
        </div>
      </div>

      {/* 📊 Class Results Viewer */}
      {/* {uploadSuccess && ( */}
        <ClassCard
          schoolName={selectedSchool}
          schoolId={schoolId}
          academicYear={academicYear}
          program={program}
          examName={examName}
          examFormat={examFormat}
          classValue={classValue}
        />
      {/* )} */}
    </div>
  );
}

export default ExcelUpload;
