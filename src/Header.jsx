// src/components/layout/Header.jsx
import { Link } from 'react-router-dom';
import spectropyLogo from './assets/spectropy.png'; // Adjusted path to assets

function Header({ isLoggedIn, onLoginToggle }) {
    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-white border-bottom shadow-sm sticky-top">
            <div className="container">
                {/* Brand Logo & Name */}
                <Link className="navbar-brand d-flex align-items-center fw-bold" to="/">
                    <img
                        src={spectropyLogo}
                        alt="Spectropy"
                        style={{
                            height: 40,
                            width: 'auto',
                            objectFit: 'contain',
                        }}
                        className="me-2"
                    />
                    <span style={{ fontSize: '1.4rem', letterSpacing: '0.5px', color: '#0d6efd' }}>
                        SPECTROPY
                    </span>
                </Link>

                {/* Mobile menu button */}
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

                {/* Navigation Links */}
                <div className="collapse navbar-collapse" id="navMenu">
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                        <li className="nav-item">
                            <Link className="nav-link" to="/">Home</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/class-upload">Upload Results</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/report">Student Report</Link>
                        </li>
                    </ul>

                    {/* Login / Logout Button */}
                    <div className="d-flex">
                        <button className="btn btn-outline-primary" onClick={onLoginToggle}>
                            {isLoggedIn ? 'Logout' : 'Login'}
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
}

export default Header;
