import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Container, AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import CourseList from './components/CourseList';
import CourseForm from './components/CourseForm';
import InstanceList from './components/InstanceList';
import InstanceForm from './components/InstanceForm';

function App() {
  return (
    <Router>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Course Management System
          </Typography>
          <Button color="inherit" component={Link} to="/">
            Courses
          </Button>
          <Button color="inherit" component={Link} to="/instances">
            Course Instances
          </Button>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Routes>
          <Route path="/" element={<CourseList />} />
          <Route path="/courses/new" element={<CourseForm />} />
          <Route path="/courses/edit/:id" element={<CourseForm />} />
          <Route path="/instances" element={<InstanceList />} />
          <Route path="/instances/new" element={<InstanceForm />} />
          <Route path="/instances/edit/:year/:semester/:courseId" element={<InstanceForm />} />
        </Routes>
      </Container>
    </Router>
  );
}

export default App; 