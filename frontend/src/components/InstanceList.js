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
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { instanceApi } from '../services/api';

function InstanceList() {
  const [instances, setInstances] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const fetchInstances = async () => {
    try {
      const response = await instanceApi.getAllInstances();
      setInstances(response.data);
    } catch (err) {
      setError('Failed to fetch course instances');
      console.error('Error fetching course instances:', err);
    }
  };

  useEffect(() => {
    fetchInstances();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this course instance?')) {
      try {
        await instanceApi.deleteInstance(id);
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

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Course</TableCell>
              <TableCell>Semester</TableCell>
              <TableCell>Year</TableCell>
              <TableCell>Instructor</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {instances.map((instance) => (
              <TableRow key={instance.id}>
                <TableCell>
                  {`${instance.course.courseCode} - ${instance.course.name}`}
                </TableCell>
                <TableCell>{instance.semester}</TableCell>
                <TableCell>{instance.year}</TableCell>
                <TableCell>{instance.instructor}</TableCell>
                <TableCell>{instance.status}</TableCell>
                <TableCell>
                  <IconButton
                    color="primary"
                    onClick={() => navigate(`/instances/edit/${instance.id}`)}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    color="error"
                    onClick={() => handleDelete(instance.id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
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