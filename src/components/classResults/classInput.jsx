import React from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';

const classOptions = ['6', '7', '8', '9', '10'];

function ClassInput({ classInput, setClassValue }) {
    return (
        <Autocomplete
            options={classOptions}
            value={classInput}
            onChange={(e, value) => setClassValue(value || '')}
            renderInput={(params) => (
                <TextField
                    {...params}
                    label="Class"
                    required
                    fullWidth
                    sx={{ mb: 2 }}
                />
            )}
        />
    );
}

export default ClassInput;
