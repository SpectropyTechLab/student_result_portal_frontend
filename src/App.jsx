import { useState } from 'react';
import { Routes, Route, Link, Navigate } from 'react-router-dom';
import Upload_Page from './Report_Component/Upload_Page'; // if you really don't need it, you can remove later
import ReportPage from './Report_Component/ReportPage';
import ExcelUpload from './components/classResults/excelUpload';
import ClassCard from './components/classResults/ClassCard';

// --- Simple Landing Page component ---
function HomeLanding() {
  return (
    <div className="container py-5">
      <div className="text-center mb-5">
        <h1 className="display-5 fw-bold">SPECTROPY Results Portal</h1>
        <p className="lead text-muted">
          Upload class results and let students instantly view their report cards.
        </p>
      </div>

      <div className="row g-4 justify-content-center">
        <div className="col-md-5">
          <div className="card h-100 shadow-sm">
            <div className="card-body d-flex flex-column">
              <h3 className="card-title">For Teachers</h3>
              <p className="card-text text-muted">
                Upload Excel files of results, auto-validate, and publish to the portal.
              </p>
              <Link to="/class-upload" className="btn btn-primary mt-auto">
                Upload Results
              </Link>
            </div>
          </div>
        </div>

        <div className="col-md-5">
          <div className="card h-100 shadow-sm">
            <div className="card-body d-flex flex-column">
              <h3 className="card-title">For Students</h3>
              <p className="card-text text-muted">
                Enter your roll number to view your latest scores and rank.
              </p>
              <Link to="/report" className="btn btn-success mt-auto">
                Check Report
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Optional highlights */}
      <div className="mt-5 text-center text-muted">
        <small>Fast • Secure • Mobile-friendly</small>
      </div>
    </div>
  );
}

// --- Simple Navbar ---
function Navbar({ isLoggedIn, onLoginToggle }) {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white border-bottom sticky-top">
      <div className="container">
        <Link className="navbar-brand fw-bold" to="/">
          SPECTROPY
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navMenu"
          aria-controls="navMenu"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon" />
        </button>

        <div className="collapse navbar-collapse" id="navMenu">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link className="nav-link" to="/">Home</Link>
            </li>
            {/* Keep this if Upload_Page is still used somewhere, else remove route + link */}
            {/* <li className="nav-item">
              <Link className="nav-link" to="/upload">Upload (Old)</Link>
            </li> */}
            <li className="nav-item">
              <Link className="nav-link" to="/class-upload">Upload Results</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/report">Student Report</Link>
            </li>
          </ul>

          <div className="d-flex">
            <button className="btn btn-outline-secondary" onClick={onLoginToggle}>
              {isLoggedIn ? 'Logout' : 'Login'}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

function Footer() {
  return (
    <footer className="bg-light border-top mt-auto">
      <div className="container py-3 text-center text-muted">
        <small>© {new Date().getFullYear()} SPECTROPY — Filling The Learning Gap</small>
      </div>
    </footer>
  );
}

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const toggleLogin = () => setIsLoggedIn(v => !v);

  return (
    <div className="bg-light min-vh-100 d-flex flex-column">
      <Navbar isLoggedIn={isLoggedIn} onLoginToggle={toggleLogin} />

      <Routes>
        {/* Home / Landing */}
        <Route path="/" element={<HomeLanding />} />

        {/* Student Report */}
        <Route path="/report" element={<ReportPage />} />

        {/* Teachers: Upload Results */}
        <Route path="/class-upload" element={<ExcelUpload />} />

        {/* Optional: if you ever want to deep-link a class report page */}
        <Route path="/class-report" element={<ClassCard />} />

        {/* Legacy page (remove later if not needed) */}
        <Route path="/upload" element={<Upload_Page />} />

        {/* 404 -> Home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      <Footer />
    </div>
  );
}

export default App;
