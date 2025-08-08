// src/components/classResults/ExamNameInput.jsx
import React, { useMemo, useState } from 'react';
import { Autocomplete, TextField } from '@mui/material';

const EXAM_NAME_OPTIONS = {
    CATALYST: ['CATALYST_WT_1', 'CATALYST_WT_2', 'CATALYST_WT_3', 'CATALYST_WT_4', 'CATALYST_WT_5', 'CATALYST_WT_6', 'CATALYST_WT_7', 'CATALYST_WT_8', 'CATALYST_UT_1', 'CATALYST_UT_2', 'CATALYST_UT_3', 'CATALYST_GT_1'],
    MAESTRO: ['MAESTRO_WT_1', 'MAESTRO_WT_2', 'MAESTRO_WT_3', 'MAESTRO_WT_4', 'MAESTRO_WT_5', 'MAESTRO_WT_6', 'MAESTRO_WT_7', 'MAESTRO_WT_8', 'MAESTRO_WT_9', 'MAESTRO_WT_10', 'MAESTRO_WT_11', 'MAESTRO_WT_12', 'MAESTRO_WT_13', 'MAESTRO_WT_14', 'MAESTRO_WT_15', 'MAESTRO_WT_16', 'MAESTRO_WT_17', 'MAESTRO_WT_18', 'MAESTRO_UT_1', 'MAESTRO_UT_2', 'MAESTRO_UT_3', 'MAESTRO_UT_4', 'MAESTRO_UT_5', 'MAESTRO_GT_1', 'MAESTRO_GT_2'],
    PIONEER: ['PIONEER_WT_1', 'PIONEER_WT_2', 'PIONEER_WT_3', 'PIONEER_WT_4', 'PIONEER_WT_5', 'PIONEER_WT_6', 'PIONEER_WT_7', 'PIONEER_WT_8', 'PIONEER_WT_9', 'PIONEER_WT_10', 'PIONEER_WT_11', 'PIONEER_WT_12', 'PIONEER_WT_13', 'PIONEER_WT_14', 'PIONEER_WT_15', 'PIONEER_WT_16', 'PIONEER_WT_17', 'PIONEER_WT_18', 'PIONEER_UT_1', 'PIONEER_UT_2', 'PIONEER_UT_3', 'PIONEER_UT_4', 'PIONEER_UT_5', 'PIONEER_GT_1', 'PIONEER_GT_2'],
    SCPS: ['SCPS_WT_1', 'SCPS_WT_2', 'SCPS_WT_3', 'SCPS_WT_4', 'SCPS_WT_5'],
    SR_PIONEER: ['SR_PIONEER_WT_1', 'SR_PIONEER_WT_2', 'SR_PIONEER_WT_3', 'SR_PIONEER_WT_4', 'SR_PIONEER_WT_5', 'SR_PIONEER_WT_6', 'SR_PIONEER_WT_7', 'SR_PIONEER_WT_8', 'SR_PIONEER_WT_9', 'SR_PIONEER_WT_10', 'SR_PIONEER_WT_11', 'SR_PIONEER_WT_12', 'SR_PIONEER_WT_13', 'SR_PIONEER_WT_14', 'SR_PIONEER_WT_15', 'SR_PIONEER_WT_16', 'SR_PIONEER_WT_17', 'SR_PIONEER_WT_18', 'SR_PIONEER_UT_1', 'SR_PIONEER_UT_2', 'SR_PIONEER_UT_3', 'SR_PIONEER_UT_4', 'SR_PIONEER_UT_5', 'SR_PIONEER_GT_1', 'SR_PIONEER_GT_2'],
    FF: ['FF_WT_1', 'FF_WT_2', 'FF_WT_3', 'FF_WT_4', 'FF_WT_5', 'FF_WT_6', 'FF_WT_7', 'FF_WT_8', 'FF_WT_9', 'FF_WT_10', 'FF_WT_11', 'FF_WT_12', 'FF_WT_13', 'FF_WT_14', 'FF_WT_15', 'FF_WT_16', 'FF_WT_17', 'FF_WT_18', 'FF_UT_1', 'FF_UT_2', 'FF_UT_3', 'FF_UT_4', 'FF_UT_5', 'FF_GT_1', 'FF_GT_2'],
    NGHS: ['NGHS_WT_1', 'NGHS_WT_2', 'NGHS_WT_3', 'NGHS_WT_4', 'NGHS_WT_5', 'NGHS_WT_6', 'NGHS_WT_7', 'NGHS_WT_8', 'NGHS_WT_9', 'NGHS_WT_10', 'NGHS_WT_11', 'NGHS_WT_12', 'NGHS_WT_13', 'NGHS_WT_14', 'NGHS_WT_15', 'NGHS_WT_16', 'NGHS_WT_17', 'NGHS_WT_18'],
};

function ExamNameInput({ program, examName, setExamName, required = true }) {
    const [helper, setHelper] = useState('Pick or type an exam name');
    const [error, setError] = useState(false);

    const normalizedProgram = (program || '').toUpperCase();
    const options = useMemo(() => EXAM_NAME_OPTIONS[normalizedProgram] || [], [normalizedProgram]);

    const normalizeValue = (v) => (v ? String(v).toUpperCase().trim() : '');

    // optional pattern: PROGRAM_(WT|UT|GT)_N
    const pattern = new RegExp(`^${normalizedProgram || '[A-Z_]+'}_(WT|UT|GT)_[1-9][0-9]*$`);
    const validate = (v) => {
        if (!v) return required ? 'Exam name is required.' : '';
        // If no program selected, skip strict pattern (still guide the user)
        if (!normalizedProgram) return '';
        if (!pattern.test(v)) return 'Expected format: PROGRAM_WT|UT|GT_<number> (e.g., CATALYST_WT_1)';
        return '';
    };

    const onChange = (_e, newValue) => {
        const v = normalizeValue(newValue);
        setExamName(v);
        const msg = validate(v);
        setError(!!msg);
        setHelper(msg || 'Pick or type an exam name');
    };

    const onInputChange = (_e, newInputValue) => {
        const v = normalizeValue(newInputValue);
        setExamName(v);
        if (error) {
            const msg = validate(v);
            setError(!!msg);
            setHelper(msg || 'Pick or type an exam name');
        }
    };

    const onBlur = () => {
        const v = normalizeValue(examName);
        setExamName(v);
        const msg = validate(v);
        setError(!!msg);
        setHelper(msg || 'Pick or type an exam name');
    };

    return (
        <Autocomplete
            freeSolo
            options={options}
            value={examName || null}
            onChange={onChange}
            onInputChange={onInputChange}
            onBlur={onBlur}
            isOptionEqualToValue={(opt, val) => opt === val}
            // keep clear allowed; required is enforced on submit + validation
            renderInput={(params) => (
                <TextField
                    {...params}
                    label="Exam Name"
                    placeholder={normalizedProgram ? `${normalizedProgram}_WT_1` : 'e.g. CATALYST_WT_1'}
                    fullWidth
                    required={required}
                    error={error}
                    helperText={helper}
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

export default ExamNameInput;
