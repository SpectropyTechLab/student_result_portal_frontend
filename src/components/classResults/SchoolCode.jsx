import React, { useEffect, useState } from 'react';
import { supabase } from '../../supabaseClient';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import Alert from '@mui/material/Alert';

function SchoolCode({ selectedSchool, schoolCode, setSchoolCode }) {
  const [codes, setCodes] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    if (selectedSchool) {
      fetchCodesForSchool(selectedSchool);
    } else {
      setCodes([]);
      setSchoolCode('');
    }
  }, [selectedSchool]);

  const fetchCodesForSchool = async (schoolName) => {
    setError('');
    setSchoolCode('');

    const { data, error } = await supabase
      .from('schooldata')
      .select('schoolcode')
      .eq('name', schoolName)
      .not('schoolcode', 'is', null);

    if (error) {
      console.error('Error fetching codes:', error.message);
      setError('Failed to fetch school codes.');
      setCodes([]);
      return;
    }

    const uniqueCodes = Array.from(new Set(data.map(d => d.schoolcode))).filter(Boolean);

    if (uniqueCodes.length === 0) {
      setError(`No school code found for "${schoolName}"`);
    }

    setCodes(uniqueCodes);
  };

  return (
    <>
      {error && (
        <Alert severity="warning" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Autocomplete
        options={codes}
        value={schoolCode}
        onChange={(event, value) => setSchoolCode(value || '')}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Select School Code"
            fullWidth
            required
          />
        )}
        disabled={codes.length === 0}
      />
    </>
  );
}

export default SchoolCode;
