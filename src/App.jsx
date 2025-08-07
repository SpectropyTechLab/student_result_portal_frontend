import { Routes, Route, Navigate } from 'react-router-dom';
import Upload_Page from './Report_Component/Upload_Page';
import ReportPage from './Report_Component/ReportPage';
import ExcelUpload from './components/classResults/excelUpload'; // ✅ Add this line
import ClassCard from './components/classResults/ClassCard'; // ✅ Add this line

function App() {
  return (
    <div className="bg-light min-vh-100">
      <Routes>
        <Route path="/" element={<Upload_Page />} />
        <Route path="/report" element={<ReportPage />} />
        <Route path="/class-upload" element={<ExcelUpload />} /> {/* ✅ New route */}
        <Route path="/class-report" element={<ClassCard />} /> {/* ✅ New route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

export default App;
