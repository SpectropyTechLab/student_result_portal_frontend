// src/components/classResults/SchoolName.jsx
import React, { useEffect, useMemo, useState } from 'react';
import { supabase } from '../../supabaseClient';
import {
  TextField,
  Autocomplete,
  Button,
  CircularProgress,
  Grid,
  Alert,
} from '@mui/material';

function School({ selectedSchool, setSelectedSchool, setSchoolId, required = true }) {
  const [schools, setSchools] = useState([]);
  const [loadingList, setLoadingList] = useState(false);
  const [listError, setListError] = useState('');

  const [showAddSchool, setShowAddSchool] = useState(false);
  const [newSchoolName, setNewSchoolName] = useState('');
  const [newSchoolArea, setNewSchoolArea] = useState('');
  const [adding, setAdding] = useState(false);
  const [fieldError, setFieldError] = useState('');

  useEffect(() => {
    const fetchSchools = async () => {
      setLoadingList(true);
      setListError('');
      const { data, error } = await supabase
        .from('schooldata')
        .select('id, name, area')
        .order('name', { ascending: true });

      if (error) {
        setListError(error.message || 'Failed to load schools');
        setSchools([]);
      } else {
        setSchools(data || []);
      }
      setLoadingList(false);
    };
    fetchSchools();
  }, []);

  const displayLabel = (s) =>
    s?.name ? `${s.name}${s.area ? ` (${s.area})` : ''}` : '';

  // Build options list with an action row at the end
  const options = useMemo(() => {
    const base = schools.map((s) => ({ ...s, __type: 'school' }));
    return [
      ...base,
      { __type: 'action', label: '+ Add New School' },
    ];
  }, [schools]);

  // Resolve current value (object) from selectedSchool label
  const currentValue = useMemo(() => {
    const match = schools.find((s) => displayLabel(s) === selectedSchool);
    return match ? { ...match, __type: 'school' } : null;
  }, [schools, selectedSchool]);

  const validateChoice = (label) => {
    if (!required) return '';
    if (!label) return 'School is required.';
    return '';
  };

  const handleSelect = (_e, value) => {
    if (value?.__type === 'action') {
      // Open add form
      setShowAddSchool(true);
      setSelectedSchool('');
      setSchoolId(null);
      setFieldError('');
      return;
    }

    if (value?.__type === 'school') {
      const label = displayLabel(value);
      setSelectedSchool(label);
      setSchoolId(value.id);
      setShowAddSchool(false);
      setFieldError(validateChoice(label));
      return;
    }

    // Cleared
    setSelectedSchool('');
    setSchoolId(null);
    setFieldError(validateChoice(''));
  };

  const handleBlur = () => {
    setFieldError(validateChoice(selectedSchool));
  };

  const handleAddNewSchool = async () => {
    const name = newSchoolName.trim();
    const area = newSchoolArea.trim();
    if (!name || !area) {
      return alert('Please enter both school name and area.');
    }

    setAdding(true);

    // Check duplicate
    const { data: existing, error: existErr } = await supabase
      .from('schooldata')
      .select('id, name, area')
      .eq('name', name)
      .eq('area', area)
      .maybeSingle();

    if (!existErr && existing) {
      const label = `${existing.name} (${existing.area})`;
      setSelectedSchool(label);
      setSchoolId(existing.id);
      setShowAddSchool(false);
      setNewSchoolName('');
      setNewSchoolArea('');
      setAdding(false);
      setFieldError('');
      return;
    }

    // Insert
    const { data, error: insertError } = await supabase
      .from('schooldata')
      .insert([{ name, area }])
      .select()
      .single();

    setAdding(false);

    if (insertError) {
      console.error('Error adding school:', insertError.message);
      alert('Failed to add new school.');
      return;
    }

    // Update local list so it appears immediately
    setSchools((prev) => {
      const found = prev.find((s) => s.id === data.id);
      return found ? prev : [...prev, data].sort((a, b) => a.name.localeCompare(b.name));
    });

    const label = `${data.name} (${data.area})`;
    setSelectedSchool(label);
    setSchoolId(data.id);
    setShowAddSchool(false);
    setNewSchoolName('');
    setNewSchoolArea('');
    setFieldError('');
  };

  return (
    <>
      {/* Selector */}
      <Autocomplete
        options={options}
        value={currentValue}
        onChange={handleSelect}
        loading={loadingList}
        getOptionLabel={(opt) => {
          if (!opt) return '';
          if (opt.__type === 'action') return opt.label;
          return displayLabel(opt);
        }}
        isOptionEqualToValue={(opt, val) =>
          opt?.__type === 'school' &&
          val?.__type === 'school' &&
          opt.id === val.id
        }
        renderInput={(params) => (
          <TextField
            {...params}
            label="Select School"
            fullWidth
            required={required}
            error={!!fieldError}
            helperText={fieldError || 'Pick an existing school or add a new one.'}
            sx={{
              mb: 2,
              '& .MuiInputBase-root': { borderRadius: '0.5rem' },
            }}
            InputProps={{
              ...params.InputProps,
              endAdornment: (
                <>
                  {loadingList ? <CircularProgress size={20} sx={{ mr: 1 }} /> : null}
                  {params.InputProps.endAdornment}
                </>
              ),
            }}
          />
        )}
      />

      {listError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {listError}
        </Alert>
      )}

      {/* Add new school */}
      {showAddSchool && (
        <div className="mb-3">
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="New School Name"
                value={newSchoolName}
                onChange={(e) => setNewSchoolName(e.target.value)}
                fullWidth
                required
                sx={{ '& .MuiInputBase-root': { borderRadius: '0.5rem' } }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Area"
                value={newSchoolArea}
                onChange={(e) => setNewSchoolArea(e.target.value)}
                fullWidth
                required
                sx={{ '& .MuiInputBase-root': { borderRadius: '0.5rem' } }}
              />
            </Grid>
          </Grid>

          <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
            <Button
              variant="contained"
              onClick={handleAddNewSchool}
              disabled={adding}
            >
              {adding ? <CircularProgress size={22} /> : 'Add'}
            </Button>
            <Button
              variant="text"
              onClick={() => {
                setShowAddSchool(false);
                setNewSchoolName('');
                setNewSchoolArea('');
              }}
            >
              Cancel
            </Button>
          </div>
        </div>
      )}
    </>
  );
}

export default School;
