// src/components/layout/Footer.jsx
import spectropyLogo from './assets/spectropy.png';

function Footer() {
    return (
        <footer className="bg-light border-top mt-auto">
            <div className="container py-3 d-flex justify-content-between align-items-center text-muted">
                <small>© {new Date().getFullYear()} SPECTROPY — Filling The Learning Gap</small>
                <img src={spectropyLogo} alt="Spectropy" style={{ height: 20, width: 'auto', opacity: 0.75 }} />
            </div>
        </footer>
    );
}

export default Footer;
