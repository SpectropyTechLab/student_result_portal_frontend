import React from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';

const formats = ['JEE MAIN', 'JEE ADVANCED', 'BOARD'];

function ExamFormatInput({ examFormat, setExamFormat }) {
    return (
        <Autocomplete
            options={formats}
            value={examFormat}
            onChange={(event, value) => setExamFormat(value || '')}
            renderInput={(params) => (
                <TextField
                    {...params}
                    label="Exam Format"
                    fullWidth
                    required
                    sx={{ mb: 2 }}
                />
            )}
        />
    );
}

export default ExamFormatInput;
