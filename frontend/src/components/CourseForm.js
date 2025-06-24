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
  Chip,
} from '@mui/material';
import { courseApi } from '../services/api';

function CourseForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [availableCourses, setAvailableCourses] = useState([]);
  const [formData, setFormData] = useState({
    courseId: '',
    title: '',
    description: '',
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
            courseId: course.courseId,
            title: course.title,
            description: course.description || '',
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
      if (id) {
        await courseApi.updateCourse(id, formData);
      } else {
        await courseApi.createCourse(formData);
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
          label="Course ID"
          name="courseId"
          value={formData.courseId}
          onChange={handleChange}
          required
          helperText="e.g., CS101"
        />

        <TextField
          fullWidth
          margin="normal"
          label="Course Title"
          name="title"
          value={formData.title}
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

        <Autocomplete
          multiple
          options={availableCourses.filter(course => course.id !== Number(id))}
          getOptionLabel={(option) => `${option.courseId} - ${option.title}`}
          value={formData.prerequisites}
          onChange={(_, newValue) => {
            setFormData(prev => ({
              ...prev,
              prerequisites: newValue,
            }));
          }}
          renderTags={(value, getTagProps) =>
            value.map((option, index) => (
              <Chip
                label={option.courseId}
                {...getTagProps({ index })}
                color="primary"
                variant="outlined"
              />
            ))
          }
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