import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Autocomplete,
  Snackbar,
  Alert,
} from '@mui/material';
import { courseApi } from '../services/api';

function CourseForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [availableCourses, setAvailableCourses] = useState([]);
  const [formData, setFormData] = useState({
    courseCode: '',
    name: '',
    description: '',
    credits: '',
    prerequisites: [],
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch available courses for prerequisites
        const coursesResponse = await courseApi.getAllCourses();
        setAvailableCourses(coursesResponse.data);

        // If editing, fetch course details
        if (id) {
          const courseResponse = await courseApi.getCourse(id);
          const course = courseResponse.data;
          setFormData({
            courseCode: course.courseCode,
            name: course.name,
            description: course.description || '',
            credits: course.credits.toString(),
            prerequisites: course.prerequisites || [],
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
      const courseData = {
        ...formData,
        credits: parseInt(formData.credits, 10),
      };

      if (id) {
        await courseApi.updateCourse(id, courseData);
      } else {
        await courseApi.createCourse(courseData);
      }
      navigate('/');
    } catch (err) {
      setError('Failed to save course');
      console.error('Error saving course:', err);
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
        {id ? 'Edit Course' : 'Add New Course'}
      </Typography>

      <Box component="form" onSubmit={handleSubmit}>
        <TextField
          fullWidth
          margin="normal"
          label="Course Code"
          name="courseCode"
          value={formData.courseCode}
          onChange={handleChange}
          required
        />

        <TextField
          fullWidth
          margin="normal"
          label="Course Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
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

        <TextField
          fullWidth
          margin="normal"
          label="Credits"
          name="credits"
          type="number"
          value={formData.credits}
          onChange={handleChange}
          required
        />

        <Autocomplete
          multiple
          options={availableCourses}
          getOptionLabel={(option) => `${option.courseCode} - ${option.name}`}
          value={formData.prerequisites}
          onChange={(_, newValue) => {
            setFormData(prev => ({
              ...prev,
              prerequisites: newValue,
            }));
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              margin="normal"
              label="Prerequisites"
              placeholder="Select prerequisites"
            />
          )}
        />

        <Box mt={3} display="flex" gap={2}>
          <Button
            variant="contained"
            color="primary"
            type="submit"
          >
            {id ? 'Update Course' : 'Create Course'}
          </Button>
          <Button
            variant="outlined"
            onClick={() => navigate('/')}
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

export default CourseForm; 