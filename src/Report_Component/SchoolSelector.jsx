import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';

function SchoolSelector({ selectedSchool, setSelectedSchool }) {
  const [schools, setSchools] = useState([]);
  const [newSchoolName, setNewSchoolName] = useState('');
  const [showAddSchool, setShowAddSchool] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchSchools();
  }, []);

  const fetchSchools = async () => {
    const { data, error } = await supabase
      .from('schools')
      .select('*')
      .order('name', { ascending: true });

    if (!error) {
      setSchools(data || []);
    }
  };

  const handleAddNewSchool = async () => {
    const name = newSchoolName.trim();
    if (!name) return;

    setLoading(true);

    const { data: existing } = await supabase
      .from('schools')
      .select('*')
      .ilike('name', name)
      .single();

    if (existing) {
      setSelectedSchool(existing.name);
      setShowAddSchool(false);
      setNewSchoolName('');
      setLoading(false);
      return;
    }

    const { data, error: insertError } = await supabase
      .from('schools')
      .insert([{ name }])
      .select()
      .single();

    setLoading(false);

    if (insertError) {
      console.error('Error adding school:', insertError.message);
      return;
    }

    setSelectedSchool(data.name);
    setNewSchoolName('');
    setShowAddSchool(false);
    fetchSchools();
  };

  return (
    <>
      <div style={{ marginBottom: 16 }}>
        <Autocomplete
          freeSolo
          options={schools.map(s => s.name).concat('+ Add New School')}
          value={selectedSchool}
          onChange={(event, value) => {
            if (value === '+ Add New School') {
              setShowAddSchool(true);
              setSelectedSchool('');
            } else {
              setSelectedSchool(value || '');
              setShowAddSchool(false);
            }
          }}
          renderInput={(params) => (
            <TextField {...params} label="Select School" fullWidth />
          )}
          sx={{ width: '100%' }}
        />
      </div>

      {showAddSchool && (
        <div style={{ marginBottom: 16 }}>
          <TextField
            label="New School Name"
            value={newSchoolName}
            onChange={(e) => setNewSchoolName(e.target.value)}
            sx={{ width: '100%', marginBottom: 1 }}
          />
          <div style={{ display: 'flex', gap: '8px' }}>
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

export default SchoolSelector;
