// src/pages/HomeLanding.jsx
import { Link } from 'react-router-dom';

function HomeLanding() {
    return (
        <div className="container py-5">
            {/* Title & Subtitle */}
            <div className="text-center mb-5">
                <h1 className="display-6 fw-bold mb-2">SPECTROPY Results Portal</h1>
                <p className="lead text-muted">
                    Upload class results and let students instantly view their report cards.
                </p>
            </div>

            {/* Two Cards: Teachers & Students */}
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

            {/* Footer text */}
            <div className="mt-5 text-center text-muted">
                <small>Fast • Secure • Mobile-friendly</small>
            </div>
        </div>
    );
}

export default HomeLanding;
