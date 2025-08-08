// src/components/classResults/ClassInput.jsx
import React, { useState } from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';

const classOptions = ['6', '7', '8', '9', '10'];

function ClassInput({ classValue, setClassValue, required = true }) {
    const [helper, setHelper] = useState('Choose a class');
    const [error, setError] = useState(false);

    const validate = (v) => {
        if (!v || v === '') return required ? 'Class is required.' : '';
        if (!classOptions.includes(String(v))) return 'Please choose a valid class.';
        return '';
    };

    const handleChange = (_e, value) => {
        // value is the option or null
        const v = value || '';
        setClassValue(v);
        const msg = validate(v);
        setError(!!msg);
        setHelper(msg || 'Choose a class');
    };

    const handleBlur = () => {
        const msg = validate(classValue);
        setError(!!msg);
        setHelper(msg || 'Choose a class');
    };

    return (
        <Autocomplete
            options={classOptions}
            value={classValue || null}                          // keep controlled, null when empty
            onChange={handleChange}
            onBlur={handleBlur}
            isOptionEqualToValue={(option, value) => option === value}
            disableClearable={!required}                        // if required, don’t allow clear
            renderInput={(params) => (
                <TextField
                    {...params}
                    label="Class"
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

export default ClassInput;
