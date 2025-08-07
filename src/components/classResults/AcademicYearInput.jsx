import React from 'react';
import TextField from '@mui/material/TextField';

function AcademicYearInput({ academicYear, setAcademicYear }) {
    return (
        <TextField
            label="Academic Year"
            value={academicYear}
            onChange={(e) => setAcademicYear(e.target.value)}
            fullWidth
            required
            placeholder="e.g. 2025-2026"
            sx={{ mb: 2 }}
        />
    );
}

export default AcademicYearInput;
