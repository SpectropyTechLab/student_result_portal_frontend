import React, { useMemo, useRef } from "react";
import SchoolHeader from './components/SchoolHeader';
import StudentInfo from './components/StudentInfo';
import StatsSummary from './components/StatsSummary';
import ExamTable from './components/ExamTable';
import PDFDownloader from './components/PDFDownloader';
import { detectTestType, GROUP_ORDER } from './components/TestTypeDetector';
import SignatureSection from "./components/SignatureSection";

const ReportCard = ({ students, schoolName, schoolArea = "", schoolLogoUrl = "" }) => {
  if (!students || students.length === 0) return <p>No data available.</p>;

  const cardRef = useRef(null);
  const { name, roll_no } = students[0] || {};

  const { avgPct, bestPct, bestExam } = useMemo(() => {
    const valid = students.filter((s) => s.percentage != null);
    const avg = valid.reduce((a, b) => a + Number(b.percentage || 0), 0) / (valid.length || 1);
    const best = valid.reduce(
      (acc, cur) =>
        Number(cur.percentage) > acc.bestPct
          ? { bestPct: Number(cur.percentage), bestExam: cur.exam }
          : acc,
      { bestPct: -Infinity, bestExam: null }
    );
    return {
      avgPct: isFinite(avg) ? avg : 0,
      bestPct: isFinite(best.bestPct) ? best.bestPct : null,
      bestExam: best.bestExam,
    };
  }, [students]);

  const calculateGroupStats = (rows) => {
    const valid = rows.filter((r) => r.percentage != null);
    const avg = valid.reduce((a, b) => a + Number(b.percentage || 0), 0) / (valid.length || 1);
    const best = valid.reduce(
      (acc, cur) =>
        Number(cur.percentage) > acc.bestPct
          ? { bestPct: Number(cur.percentage), bestExam: cur.exam }
          : acc,
      { bestPct: -Infinity, bestExam: null }
    );
    return {
      avgPct: isFinite(avg) ? avg : 0,
      bestPct: isFinite(best.bestPct) ? best.bestPct : null,
      bestExam: best.bestExam,
    };
  };

  const groupedData = useMemo(() => {
    const groups = {};
    students.forEach(row => {
      const group = detectTestType(row.exam);
      if (!groups[group]) groups[group] = [];
      groups[group].push(row);
    });
    return groups;
  }, [students]);

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-end mb-2">
        <PDFDownloader
          cardRef={cardRef}
          schoolName={schoolName}
          studentName={name}
        />
      </div>

      <div className="card shadow-sm border-0 mb-5" ref={cardRef}>
        <div className="d-flex justify-content-between align-items-start p-3">
          <SchoolHeader
            schoolName={schoolName}
            schoolArea={schoolArea}
            schoolLogoUrl={schoolLogoUrl}
          />
          <div className="text-end">
            <StatsSummary
              avgPct={avgPct}
              bestPct={bestPct}
              bestExam={bestExam}
              recordCount={students.length}
            />
          </div>
        </div>

        <div className="card-body">
          <StudentInfo name={name} rollNo={roll_no} avgPct={avgPct} />

          {GROUP_ORDER.map((group) => {
            const rows = groupedData[group] || [];
            if (!rows.length) return null;

            const stats = calculateGroupStats(rows);

            return (
              <ExamTable
                key={group}
                group={group}
                rows={rows}
                stats={stats}
              />
            );
          })}

          {/* <div className="d-flex justify-content-between align-items-center mt-2">
            <span className="text-muted small">Latest first</span>
            <span className="text-muted small">More actions coming soon</span>
          </div> */}
        </div>
        < SignatureSection/>
      </div>
    </div>
  );
};

export default ReportCard;
