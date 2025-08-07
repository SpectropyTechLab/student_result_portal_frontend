import React, { useEffect, useState } from 'react';
import { supabase } from '../../supabaseClient';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import Alert from '@mui/material/Alert';

function SchoolArea({ selectedSchool, schoolArea, setSchoolArea }) {
  const [areas, setAreas] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    if (selectedSchool) {
      fetchAreasForSchool(selectedSchool);
    } else {
      setAreas([]);
      setSchoolArea('');
    }
  }, [selectedSchool]);

  const fetchAreasForSchool = async (schoolName) => {
    setError('');
    setSchoolArea('');

    // 2. Fetch areas using the school ID
    const { data: areaData, error: areaError } = await supabase
      .from('schooldata')
      .select('area')
      .eq('name', selectedSchool)

    if (areaError) {
      console.error('Error fetching areas:', areaError.message);
      setError('Failed to fetch school areas.');
      setAreas([]);
      return;
    }

    const uniqueAreas = Array.from(new Set(areaData.map(d => d.area))).filter(Boolean);

    if (uniqueAreas.length === 0) {
      setError(`No school areas found for "${schoolName}"`);
    }

    setAreas(uniqueAreas);
  };

  return (
    <>
      {error && (
        <Alert severity="warning" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Autocomplete
        options={areas}
        value={schoolArea}
        onChange={(event, value) => setSchoolArea(value || '')}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Select School Area"
            fullWidth
            required
          />
        )}
        disabled={areas.length === 0}
      />
    </>
  );
}

export default SchoolArea;
