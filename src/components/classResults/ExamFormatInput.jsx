// src/components/classResults/ExamFormatInput.jsx
import React, { useState } from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';

const FORMATS = ['JEE MAIN', 'JEE ADVANCED', 'BOARD'];

function ExamFormatInput({ examFormat, setExamFormat, required = true }) {
    const [helper, setHelper] = useState('Choose an exam format');
    const [error, setError] = useState(false);

    const normalize = (v) => (v ? String(v).toUpperCase().trim() : '');

    const validate = (v) => {
        if (!v) return required ? 'Exam format is required.' : '';
        if (!FORMATS.includes(v)) return 'Please select a valid exam format.';
        return '';
    };

    const handleChange = (_e, value) => {
        const v = normalize(value);
        setExamFormat(v);
        const msg = validate(v);
        setError(!!msg);
        setHelper(msg || 'Choose an exam format');
    };

    const handleBlur = () => {
        const v = normalize(examFormat);
        setExamFormat(v);
        const msg = validate(v);
        setError(!!msg);
        setHelper(msg || 'Choose an exam format');
    };

    return (
        <Autocomplete
            options={FORMATS}
            value={examFormat || null}
            onChange={handleChange}
            onBlur={handleBlur}
            isOptionEqualToValue={(opt, val) => opt === val}
            disableClearable={required}
            renderInput={(params) => (
                <TextField
                    {...params}
                    label="Exam Format"
                    required={required}
                    error={error}
                    helperText={helper}
                    fullWidth
                    size="medium"
                    variant="outlined"
                    sx={{
                        mb: 2,
                        '& .MuiInputBase-root': { borderRadius: '0.5rem' },
                    }}
                />
            )}
        />
    );
}

export default ExamFormatInput;
