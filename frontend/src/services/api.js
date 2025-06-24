import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': '*/*'
  },
});

export const courseApi = {
  getAllCourses: () => api.get('/api/courses'),
  getCourse: (id) => api.get(`/api/courses/${id}`),
  createCourse: (course) => api.post('/api/courses', {
    courseId: course.courseId,
    title: course.title,
    description: course.description || '',
    prerequisites: course.prerequisites.map(p => ({ courseId: p.courseId })) || []
  }),
  updateCourse: (id, course) => api.put(`/api/courses/${id}`, {
    courseId: course.courseId,
    title: course.title,
    description: course.description || '',
    prerequisites: course.prerequisites.map(p => ({ courseId: p.courseId })) || []
  }),
  deleteCourse: (id) => api.delete(`/api/courses/${id}`),
};

export const instanceApi = {
  getAllInstances: () => api.get('/api/instances'),
  getInstancesByYearSemester: (year, semester) => 
    api.get(`/api/instances/${year}/${semester}`),
  getInstance: (year, semester, courseId) => 
    api.get(`/api/instances/${year}/${semester}/${courseId}`),
  createInstance: (instance) => api.post('/api/instances', {
    courseId: instance.course.courseId,
    year: instance.year,
    semester: instance.semester,
    instructor: instance.instructor,
    maxCapacity: instance.maxCapacity,
    status: instance.status
  }),
  updateInstance: (year, semester, courseId, instance) => api.put(`/api/instances/${year}/${semester}/${courseId}`, {
    courseId: instance.course.courseId,
    year: instance.year,
    semester: instance.semester,
    instructor: instance.instructor,
    maxCapacity: instance.maxCapacity,
    status: instance.status
  }),
  deleteInstance: (year, semester, courseId) => 
    api.delete(`/api/instances/${year}/${semester}/${courseId}`),
};

export default api; 