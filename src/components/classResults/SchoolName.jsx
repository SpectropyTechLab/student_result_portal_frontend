import React, { useEffect, useState } from 'react';
import { supabase } from '../../supabaseClient';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Grid from '@mui/material/Grid';

function School({ selectedSchool, setSelectedSchool, setSchoolId }) {
  const [schools, setSchools] = useState([]);
  const [showAddSchool, setShowAddSchool] = useState(false);
  const [newSchoolName, setNewSchoolName] = useState('');
  const [newSchoolArea, setNewSchoolArea] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchSchools();
  }, []);

  const fetchSchools = async () => {
    const { data, error } = await supabase
      .from('schooldata')
      .select('id, name, area')
      .order('name', { ascending: true });

    if (!error) {
      setSchools(data || []);
    }
  };

  const displayLabel = (school) =>
    `${school.name}${school.area ? ` (${school.area})` : ''}`;

  const handleSchoolSelect = (value) => {
    if (value?.name === '+ Add New School') {
      setShowAddSchool(true);
      setSelectedSchool('');
      setSchoolId(null);
      return;
    }

    const label = typeof value === 'string' ? value : displayLabel(value);
    setSelectedSchool(label);
    setShowAddSchool(false);

    // Get the corresponding school ID
    const match = schools.find(s => displayLabel(s) === label);
    if (match) {
      setSchoolId(match.id);
    }
  };

  const handleAddNewSchool = async () => {
    const name = newSchoolName.trim();
    const area = newSchoolArea.trim();

    if (!name || !area) return alert('Please enter both school name and area.');

    setLoading(true);

    // Check if school already exists
    const { data: existing } = await supabase
      .from('schooldata')
      .select('id')
      .eq('name', name)
      .eq('area', area)
      .maybeSingle();

    if (existing) {
      const label = `${name} (${area})`;
      setSelectedSchool(label);
      setSchoolId(existing.id);
      setShowAddSchool(false);
      setNewSchoolName('');
      setNewSchoolArea('');
      setLoading(false);
      return;
    }

    // Insert new school
    const { data, error: insertError } = await supabase
      .from('schooldata')
      .insert([{ name, area }])
      .select()
      .single();

    setLoading(false);

    if (insertError) {
      console.error('Error adding school:', insertError.message);
      alert('Failed to add new school.');
      return;
    }

    const label = `${data.name} (${data.area})`;
    setSelectedSchool(label);
    setSchoolId(data.id);
    setShowAddSchool(false);
    setNewSchoolName('');
    setNewSchoolArea('');
    fetchSchools();
  };

  return (
    <>
      <div style={{ marginBottom: 16 }}>
        <Autocomplete
          options={[...schools, { name: '+ Add New School', area: '' }]}
          getOptionLabel={(option) =>
            typeof option === 'string' ? option : displayLabel(option)
          }
          isOptionEqualToValue={(option, value) =>
            displayLabel(option) === displayLabel(value)
          }
          value={
            schools.find(s => displayLabel(s) === selectedSchool) || selectedSchool
          }
          onChange={(event, value) => handleSchoolSelect(value)}
          renderInput={(params) => (
            <TextField {...params} label="Select School" fullWidth />
          )}
        />
      </div>

      {showAddSchool && (
        <div style={{ marginBottom: 16 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="New School Name"
                value={newSchoolName}
                onChange={(e) => setNewSchoolName(e.target.value)}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Area"
                value={newSchoolArea}
                onChange={(e) => setNewSchoolArea(e.target.value)}
                fullWidth
              />
            </Grid>
          </Grid>
          <div style={{ display: 'flex', gap: '8px', marginTop: 10 }}>
            <Button variant="contained" onClick={handleAddNewSchool} disabled={loading}>
              {loading ? <CircularProgress size={22} /> : 'Add'}
            </Button>
            <Button variant="text" onClick={() => setShowAddSchool(false)}>
              Cancel
            </Button>
          </div>
        </div>
      )}
    </>
  );
}

export default School;
