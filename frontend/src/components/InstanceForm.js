import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Autocomplete,
  MenuItem,
  Snackbar,
  Alert,
} from '@mui/material';
import { instanceApi, courseApi } from '../services/api';

const SEMESTERS = ['SPRING', 'SUMMER', 'FALL', 'WINTER'];
const STATUS_OPTIONS = ['SCHEDULED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'];

function InstanceForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [courses, setCourses] = useState([]);
  const [formData, setFormData] = useState({
    course: null,
    semester: '',
    year: new Date().getFullYear(),
    instructor: '',
    status: 'SCHEDULED',
    maxCapacity: '',
    description: '',
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch available courses
        const coursesResponse = await courseApi.getAllCourses();
        setCourses(coursesResponse.data);

        // If editing, fetch instance details
        if (id) {
          const instanceResponse = await instanceApi.getInstance(id);
          const instance = instanceResponse.data;
          setFormData({
            course: instance.course,
            semester: instance.semester,
            year: instance.year,
            instructor: instance.instructor,
            status: instance.status,
            maxCapacity: instance.maxCapacity?.toString() || '',
            description: instance.description || '',
          });
        }
      } catch (err) {
        setError('Failed to fetch data');
        console.error('Error fetching data:', err);
      }
    };

    fetchData();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const instanceData = {
        ...formData,
        year: parseInt(formData.year, 10),
        maxCapacity: formData.maxCapacity ? parseInt(formData.maxCapacity, 10) : null,
      };

      if (id) {
        await instanceApi.updateInstance(id, instanceData);
      } else {
        await instanceApi.createInstance(instanceData);
      }
      navigate('/instances');
    } catch (err) {
      setError('Failed to save course instance');
      console.error('Error saving course instance:', err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <Box component={Paper} p={3}>
      <Typography variant="h5" mb={3}>
        {id ? 'Edit Course Instance' : 'Add New Course Instance'}
      </Typography>

      <Box component="form" onSubmit={handleSubmit}>
        <Autocomplete
          options={courses}
          getOptionLabel={(option) => `${option.courseCode} - ${option.name}`}
          value={formData.course}
          onChange={(_, newValue) => {
            setFormData(prev => ({
              ...prev,
              course: newValue,
            }));
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              margin="normal"
              label="Course"
              required
            />
          )}
        />

        <TextField
          select
          fullWidth
          margin="normal"
          label="Semester"
          name="semester"
          value={formData.semester}
          onChange={handleChange}
          required
        >
          {SEMESTERS.map(semester => (
            <MenuItem key={semester} value={semester}>
              {semester}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          fullWidth
          margin="normal"
          label="Year"
          name="year"
          type="number"
          value={formData.year}
          onChange={handleChange}
          required
        />

        <TextField
          fullWidth
          margin="normal"
          label="Instructor"
          name="instructor"
          value={formData.instructor}
          onChange={handleChange}
          required
        />

        <TextField
          select
          fullWidth
          margin="normal"
          label="Status"
          name="status"
          value={formData.status}
          onChange={handleChange}
          required
        >
          {STATUS_OPTIONS.map(status => (
            <MenuItem key={status} value={status}>
              {status}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          fullWidth
          margin="normal"
          label="Maximum Capacity"
          name="maxCapacity"
          type="number"
          value={formData.maxCapacity}
          onChange={handleChange}
        />

        <TextField
          fullWidth
          margin="normal"
          label="Description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          multiline
          rows={4}
        />

        <Box mt={3} display="flex" gap={2}>
          <Button
            variant="contained"
            color="primary"
            type="submit"
          >
            {id ? 'Update Instance' : 'Create Instance'}
          </Button>
          <Button
            variant="outlined"
            onClick={() => navigate('/instances')}
          >
            Cancel
          </Button>
        </Box>
      </Box>

      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={() => setError('')}
      >
        <Alert severity="error" onClose={() => setError('')}>
          {error}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default InstanceForm; 