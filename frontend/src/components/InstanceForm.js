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
  Grid,
  FormControl,
  InputLabel,
  Select,
} from '@mui/material';
import { instanceApi, courseApi } from '../services/api';
import { SEMESTER_OPTIONS } from '../utils/semesterUtils';

function InstanceForm() {
  const { year: yearParam, semester: semesterParam, courseId: courseIdParam } = useParams();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [courses, setCourses] = useState([]);
  const [formData, setFormData] = useState({
    course: null,
    year: new Date().getFullYear(),
    semester: 1,
    instructor: '',
  });

  // Generate year options (current year ± 5 years)
  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: 11 }, (_, i) => currentYear - 5 + i);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch available courses
        const coursesResponse = await courseApi.getAllCourses();
        setCourses(coursesResponse.data);

        // If editing, fetch instance details
        if (yearParam && semesterParam && courseIdParam) {
          const instanceResponse = await instanceApi.getInstance(yearParam, semesterParam, courseIdParam);
          const instance = instanceResponse.data;
          
          // Find the course object from the courses list
          const course = coursesResponse.data.find(c => c.courseId === instance.courseId);
          
          setFormData({
            course: course || null, // Ensure null if course not found
            year: instance.year,
            semester: instance.semester,
            instructor: instance.instructor,
          });
        }
      } catch (err) {
        setError('Failed to fetch data');
        console.error('Error fetching data:', err);
      }
    };

    fetchData();
  }, [yearParam, semesterParam, courseIdParam]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!formData.course) {
        setError('Please select a course');
        return;
      }

      const instanceData = {
        courseId: formData.course.courseId,
        year: parseInt(formData.year, 10),
        semester: parseInt(formData.semester, 10),
        instructor: formData.instructor,
      };

      if (yearParam && semesterParam && courseIdParam) {
        // Update existing instance
        await instanceApi.updateInstance(yearParam, semesterParam, courseIdParam, instanceData);
      } else {
        // Create new instance
        await instanceApi.createInstance(instanceData);
      }
      navigate('/instances');
    } catch (err) {
      setError(err.response?.data || 'Failed to save course instance');
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
        {yearParam ? 'Edit Course Instance' : 'Add New Course Instance'}
      </Typography>

      <Box component="form" onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Autocomplete
              options={courses}
              getOptionLabel={(option) => `${option.courseId} - ${option.title}`}
              value={formData.course}
              onChange={(_, newValue) => {
                setFormData(prev => ({
                  ...prev,
                  course: newValue,
                }));
              }}
              isOptionEqualToValue={(option, value) => 
                option.courseId === value.courseId
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Course"
                  required
                />
              )}
              disabled={!!yearParam}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel id="year-select-label">Year</InputLabel>
              <Select
                labelId="year-select-label"
                name="year"
                value={formData.year}
                label="Year"
                onChange={handleChange}
                required
                disabled={!!yearParam}
              >
                {yearOptions.map((y) => (
                  <MenuItem key={y} value={y}>{y}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel id="semester-select-label">Semester</InputLabel>
              <Select
                labelId="semester-select-label"
                name="semester"
                value={formData.semester}
                label="Semester"
                onChange={handleChange}
                required
                disabled={!!yearParam}
              >
                {SEMESTER_OPTIONS.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Instructor"
              name="instructor"
              value={formData.instructor}
              onChange={handleChange}
              required
            />
          </Grid>

          <Grid item xs={12}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
            >
              {yearParam ? 'Update Instance' : 'Create Instance'}
            </Button>
          </Grid>
        </Grid>
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