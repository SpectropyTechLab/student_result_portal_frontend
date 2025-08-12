import { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
// import Upload_Page from './Report_Component/Upload_Page';
import ReportPage from './Report_Component/ReportPage';
import ExcelUpload from './components/classResults/excelUpload';
import ClassCard from './components/classResults/ClassCard';

import Header from './Header';
import Footer from './Footer';
import HomeLanding from './HomeLanding';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const toggleLogin = () => setIsLoggedIn(v => !v);

  return (
    <div className="bg-light min-vh-100 d-flex flex-column">
      <Header isLoggedIn={isLoggedIn} onLoginToggle={toggleLogin} />

      <Routes>
        <Route path="/" element={<HomeLanding />} />
        <Route path="/report" element={<ReportPage />} />
        <Route path="/class-upload" element={<ExcelUpload />} />
        <Route path="/class-report" element={<ClassCard />} />
        {/* <Route path="/upload" element={<Upload_Page />} /> */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      <Footer />
    </div>
  );
}

export default App;
