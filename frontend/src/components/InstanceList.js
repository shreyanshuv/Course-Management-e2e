import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  IconButton,
  Snackbar,
  Alert,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Grid,
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon, Search as SearchIcon } from '@mui/icons-material';
import { instanceApi } from '../services/api';

function InstanceList() {
  const [instances, setInstances] = useState([]);
  const [error, setError] = useState('');
  const [year, setYear] = useState(new Date().getFullYear());
  const [semester, setSemester] = useState(1);
  const navigate = useNavigate();

  // Generate year options (current year ± 5 years)
  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: 11 }, (_, i) => currentYear - 5 + i);
  const semesterOptions = [1, 2];

  const fetchInstances = async () => {
    try {
      const response = await instanceApi.getInstancesByYearSemester(year, semester);
      console.log('Instances:', response.data);
      setInstances(response.data);
    } catch (err) {
      setError('Failed to fetch course instances');
      console.error('Error fetching course instances:', err);
    }
  };

  useEffect(() => {
    fetchInstances();
  }, [year, semester]);

  const handleDelete = async (courseId) => {
    if (window.confirm('Are you sure you want to delete this course instance?')) {
      try {
        await instanceApi.deleteInstance(year, semester, courseId);
        fetchInstances();
      } catch (err) {
        setError('Failed to delete course instance');
        console.error('Error deleting course instance:', err);
      }
    }
  };

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">Course Instances</Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate('/instances/new')}
        >
          Add New Instance
        </Button>
      </Box>

      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={5}>
            <FormControl fullWidth>
              <InputLabel id="year-select-label">Year</InputLabel>
              <Select
                labelId="year-select-label"
                value={year}
                label="Year"
                onChange={(e) => setYear(e.target.value)}
              >
                {yearOptions.map((y) => (
                  <MenuItem key={y} value={y}>{y}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={5}>
            <FormControl fullWidth>
              <InputLabel id="semester-select-label">Semester</InputLabel>
              <Select
                labelId="semester-select-label"
                value={semester}
                label="Semester"
                onChange={(e) => setSemester(e.target.value)}
              >
                {semesterOptions.map((s) => (
                  <MenuItem key={s} value={s}>Semester {s}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Paper>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Course ID</TableCell>
              <TableCell>Title</TableCell>
              <TableCell>Year</TableCell>
              <TableCell>Semester</TableCell>
              <TableCell>Instructor</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {instances.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  No course instances found for the selected year and semester
                </TableCell>
              </TableRow>
            ) : (
              instances.map((instance) => (
                <TableRow key={`${instance.year}-${instance.semester}-${instance.courseId}`}>
                  <TableCell>{instance.courseId}</TableCell>
                  <TableCell>{instance.courseTitle}</TableCell>
                  <TableCell>{instance.year}</TableCell>
                  <TableCell>{instance.semester}</TableCell>
                  <TableCell>{instance.instructor}</TableCell>
                  <TableCell>{instance.status}</TableCell>
                  <TableCell>
                    <IconButton
                      color="primary"
                      onClick={() => navigate(`/instances/edit/${instance.year}/${instance.semester}/${instance.courseId}`)}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      color="error"
                      onClick={() => handleDelete(instance.courseId)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

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

export default InstanceList; 