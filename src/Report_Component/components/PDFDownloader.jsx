import React from 'react';
import html2pdf from 'html2pdf.js';

const PDFDownloader = ({ cardRef, schoolName, studentName }) => {
  const handleDownloadPDF = () => {
    const el = cardRef.current;
    if (!el) return;
    
    const filenameSafe = `${(schoolName || "School")
      .replace(/\s+/g, "_")}_${(studentName || "Student").replace(/\s+/g, "_")}_report.pdf`;

    const opt = {
      margin: [0.3, 0.2, 0.4, 0.2],
      filename: filenameSafe,
      image: { type: "jpeg", quality: 1 },
      html2canvas: {
        scale: 3,
        useCORS: true,
        allowTaint: true,
        scrollY: 0,
        logging: false,
        windowWidth: el.scrollWidth,
        windowHeight: el.scrollHeight,
      },
      jsPDF: { unit: "in", format: "a4", orientation: "landscape" },
      pagebreak: { mode: ["css", "legacy"], avoid: [".card-header", ".table thead", "tr"] },
    };

    html2pdf().set(opt).from(el).save();
  };

  return (
    <button className="btn btn-outline-primary btn-sm" onClick={handleDownloadPDF}>
      Download PDF
    </button>
  );
};

export default PDFDownloader;
