import React from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';

const programs = ['CATALYST', 'MAESTRO', 'SCPS','PIONEER','SR_PIONEER','FF','NGHS']; // Extend as needed

function ProgramInput({ program, setProgram }) {
    return (
        <Autocomplete
            options={programs}
            value={program}
            onChange={(event, value) => setProgram(value || '')}
            renderInput={(params) => (
                <TextField
                    {...params}
                    label="Program"
                    fullWidth
                    required
                    sx={{ mb: 2 }}
                />
            )}
        />
    );
}

export default ProgramInput;
