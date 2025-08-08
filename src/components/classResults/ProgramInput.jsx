// src/components/classResults/ProgramInput.jsx
import React, { useState } from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';

const PROGRAMS = ['CATALYST', 'MAESTRO', 'SCPS', 'PIONEER', 'SR_PIONEER', 'FF', 'NGHS'];

function ProgramInput({ program, setProgram, required = true }) {
    const [helper, setHelper] = useState('Choose a program');
    const [error, setError] = useState(false);

    const normalize = (v) => (v ? String(v).toUpperCase().trim() : '');

    const validate = (v) => {
        if (!v) return required ? 'Program is required.' : '';
        if (!PROGRAMS.includes(v)) return 'Please select a valid program.';
        return '';
    };

    const handleChange = (_e, value) => {
        const v = normalize(value);
        setProgram(v);
        const msg = validate(v);
        setError(!!msg);
        setHelper(msg || 'Choose a program');
    };

    const handleBlur = () => {
        const v = normalize(program);
        setProgram(v);
        const msg = validate(v);
        setError(!!msg);
        setHelper(msg || 'Choose a program');
    };

    return (
        <Autocomplete
            options={PROGRAMS}
            value={program || null}
            onChange={handleChange}
            onBlur={handleBlur}
            isOptionEqualToValue={(opt, val) => opt === val}
            disableClearable={required}
            renderInput={(params) => (
                <TextField
                    {...params}
                    label="Program"
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

export default ProgramInput;
