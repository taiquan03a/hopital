import axios from 'axios';

const API_BASE = 'http://localhost:6886/api'; // Đổi lại nếu cần

const axiosInstance = axios.create({
    baseURL: API_BASE,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Thêm interceptor để tự động gắn token nếu có
axiosInstance.interceptors.request.use((config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
});

// API User
export const registerUser = (data) => axiosInstance.post('/user/register/', data).then(res => res.data);
export const verifyToken = () => axiosInstance.get('/user/verify-token/').then(res => res.data);
export const validToken = () => axiosInstance.post('/user/valid/').then(res => res.data);
export const getAllUsers = () => axiosInstance.get('/user/all/').then(res => res.data);
export const loginUser = (data) => axiosInstance.post('/user/login/', data).then(res => res.data);

// API Pharmaceutical
export const getAllCategories = () => axiosInstance.get('/pharmaceutical-api/category/all/').then(res => res.data);
export const addCategory = (data) => axiosInstance.post('/pharmaceutical-api/category/add/', data).then(res => res.data);
export const getAllSuppliers = () => axiosInstance.get('/pharmaceutical-api/supplier/all/').then(res => res.data);
export const addSupplier = (data) => axiosInstance.post('/pharmaceutical-api/supplier/add/', data).then(res => res.data);
export const getAllPharmaceuticals = () => axiosInstance.get('/pharmaceutical-api/pharmaceutical/all/').then(res => res.data);
export const addPharmaceutical = (data) => axiosInstance.post('/pharmaceutical-api/pharmaceutical/add/', data).then(res => res.data);
export const updatePharmaceutical = (id, data) => axiosInstance.put(`/pharmaceutical-api/pharmaceutical/${id}/`, data).then(res => res.data);

// API Patients
export const getAllPatients = (user_id) => {
    if (!user_id) return Promise.resolve([]);
    return axiosInstance.get(`/patient-api/patient/${user_id}/`).then(res => res.data);
};
export const addPatient = (data) => axiosInstance.post('/patient-api/patient/', data).then(res => res.data);
export const updatePatient = (id, data) => axiosInstance.put(`/patient-api/patient/${id}/`, data).then(res => res.data);

// API Medical Records
export const getAllMedicalRecords = () => axiosInstance.get('/medical-api/medical-record/all/').then(res => res.data);
export const addMedicalRecord = (data) => axiosInstance.post('/medical-api/medical-records/', data).then(res => res.data);
export const updateMedicalRecord = (id, data) => axiosInstance.put(`/medical-api/medical-record/${id}/`, data).then(res => res.data);
export const getMedicalRecordsByPatient = (patient_id) => axiosInstance.get(`/medical-api/medical-records/patient/${patient_id}/`).then(res => res.data);

// API Employees
export const getAllEmployees = () => axiosInstance.get('/employees-api/employees/list/').then(res => res.data);
export const getEmployeeDetail = (id) => axiosInstance.get(`/employees-api/employees/${id}/`).then(res => res.data);
export const addEmployee = (data) => axiosInstance.post('/employees-api/employees/', data).then(res => res.data);
export const updateEmployee = (id, data) => axiosInstance.put(`/employees-api/employees/${id}/`, data).then(res => res.data);

// API Positions
export const getAllPositions = () => axiosInstance.get('/employees-api/positions/list/').then(res => res.data);
export const addPosition = (data) => axiosInstance.post('/employees-api/positions/', data).then(res => res.data);

// API Doctors
export const getAllDoctors = () => axiosInstance.get('/doctor-api/doctor/all/').then(res => res.data);
export const getDoctorDetail = (id) => axiosInstance.get(`/doctor-api/doctor/${id}/`).then(res => res.data);
export const addDoctor = (data) => axiosInstance.post('/doctor-api/doctor/add/', data).then(res => res.data);
export const updateDoctor = (id, data) => axiosInstance.put(`/doctor-api/doctor/${id}/`, data).then(res => res.data);
export const deleteDoctor = (id) => axiosInstance.delete(`/doctor-api/doctor/${id}/`).then(res => res.data);

// API Appointments
export const getAppointmentsByPatient = (patient_id) => axiosInstance.get(`/appointment-api/appointments/user/${patient_id}/`).then(res => res.data);
export const addAppointment = (data) => axiosInstance.post('/appointment-api/appointments/', data).then(res => res.data);
export const updateAppointment = (id, data) => axiosInstance.put(`/appointment-api/appointments/${id}/`, data).then(res => res.data);
export const deleteAppointment = (id) => axiosInstance.delete(`/appointment-api/appointments/${id}/`).then(res => res.data);

// API Reexaminations
export const getAllReexaminations = () => axiosInstance.get('/appointment-api/reexaminations/').then(res => res.data);
export const addReexamination = (data) => axiosInstance.post('/appointment-api/reexaminations/', data).then(res => res.data);
export const updateReexamination = (id, data) => axiosInstance.put(`/appointment-api/reexaminations/${id}/`, data).then(res => res.data);

// API Symptoms
export const getAllSymptoms = () => axiosInstance.get('/disease-api/symptoms/list/').then(res => res.data);
export const addSymptom = (data) => axiosInstance.post('/disease-api/symptoms/', data).then(res => res.data);
export const updateSymptom = (id, data) => axiosInstance.put(`/disease-api/symptoms/${id}/`, data).then(res => res.data);
export const deleteSymptom = (id) => axiosInstance.delete(`/disease-api/symptoms/${id}/`).then(res => res.data);

// API Diseases
export const getAllDiseases = () => axiosInstance.get('/disease-api/diseases/list/').then(res => res.data);
export const getDiseaseDetail = (id) => axiosInstance.get(`/disease-api/diseases/${id}/`).then(res => res.data);
export const addDisease = (data) => axiosInstance.post('/disease-api/diseases/', data).then(res => res.data);
export const updateDisease = (id, data) => axiosInstance.put(`/disease-api/diseases/${id}/`, data).then(res => res.data);
export const deleteDisease = (id) => axiosInstance.delete(`/disease-api/diseases/${id}/`).then(res => res.data);

// API Treatments
export const getAllTreatments = () => axiosInstance.get('/disease-api/treatments/list/').then(res => res.data);
export const addTreatment = (data) => axiosInstance.post('/disease-api/treatments/', data).then(res => res.data);
export const updateTreatment = (id, data) => axiosInstance.put(`/disease-api/treatments/${id}/`, data).then(res => res.data);
export const deleteTreatment = (id) => axiosInstance.delete(`/disease-api/treatments/${id}/`).then(res => res.data);

// Add this new function to handle errors
export const handleError = (err) => {
    console.log('err:', err);
    if (err.response && err.response.data) {
        // ... như cũ
    }
}; 