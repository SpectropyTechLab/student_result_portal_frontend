import TextField from '@mui/material/TextField';
import { useState } from 'react';

function AcademicYearInput({ academicYear, setAcademicYear, required = true }) {
    const [helper, setHelper] = useState('Format: YYYY-YYYY');
    const [error, setError] = useState(false);

    const format = (v) => {
        const d = v.replace(/[^\d]/g, '').slice(0, 8);
        return d.length <= 4 ? d : `${d.slice(0, 4)}-${d.slice(4)}`;
    };

    const validate = (v) => {
        if (!v) return required ? 'Academic year is required.' : '';
        if (!/^\d{4}-\d{4}$/.test(v)) return 'Use format YYYY-YYYY.';
        const a = +v.slice(0, 4), b = +v.slice(5, 9);
        if (b !== a + 1) return 'End year must be start year + 1.';
        return '';
    };

    const onChange = (e) => {
        const v = format(e.target.value);
        setAcademicYear(v);
        const msg = validate(v);
        setError(!!msg);
        setHelper(msg || 'Format: YYYY-YYYY');
    };

    return (
        <TextField
            label="Academic Year"
            value={academicYear}
            onChange={onChange}
            fullWidth
            required={required}
            placeholder="2025-2026"
            error={error}
            helperText={helper}
            size="medium"
            variant="outlined"
            sx={{
                mb: 2,
                '& .MuiInputBase-root': { borderRadius: '0.5rem' },
            }}
        />
    );
}

export default AcademicYearInput;
