import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const courseApi = {
  getAllCourses: () => api.get('/api/courses'),
  getCourse: (id) => api.get(`/api/courses/${id}`),
  createCourse: (course) => api.post('/api/courses', course),
  updateCourse: (id, course) => api.put(`/api/courses/${id}`, course),
  deleteCourse: (id) => api.delete(`/api/courses/${id}`),
};

export const instanceApi = {
  getAllInstances: () => api.get('/api/course-instances'),
  getInstance: (id) => api.get(`/api/course-instances/${id}`),
  createInstance: (instance) => api.post('/api/course-instances', instance),
  updateInstance: (id, instance) => api.put(`/api/course-instances/${id}`, instance),
  deleteInstance: (id) => api.delete(`/api/course-instances/${id}`),
};

export default api; 