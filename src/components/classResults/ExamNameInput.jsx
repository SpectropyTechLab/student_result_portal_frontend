import React from 'react';
import TextField from '@mui/material/TextField';

function ExamNameInput({ examName, setExamName }) {
    return (
        <TextField
            label="Exam Name"
            value={examName}
            onChange={(e) => setExamName(e.target.value)}
            fullWidth
            required
            placeholder="e.g. CATALYST_Weekly_1_JEE_MAIN"
            sx={{ mb: 2 }}
        />
    );
}

export default ExamNameInput;
