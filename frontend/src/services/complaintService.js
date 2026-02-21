import axios from 'axios';

const API_URL = 'http://localhost:5002/api/complaints';

const bookDiagnosis = async (complaintData) => {
    const token = localStorage.getItem('token');
    const response = await axios.post(API_URL, complaintData, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
};

const getMyComplaints = async () => {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${API_URL}/mycomplaints`, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
};

const getAssignedComplaints = async () => {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${API_URL}/assigned`, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
};

const getComplaintById = async (id) => {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${API_URL}/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
};

const getAllComplaints = async () => {
    const token = localStorage.getItem('token');
    const response = await axios.get(API_URL, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
};

const updateComplaintStatus = async (id, statusData) => {
    const token = localStorage.getItem('token');
    const response = await axios.put(`${API_URL}/${id}`, statusData, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
};

const requestSparePart = async (complaintId, spareData) => {
    const token = localStorage.getItem('token');
    const response = await axios.post(`${API_URL}/${complaintId}/spares`, spareData, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
};

const updateSparePartStatus = async (complaintId, spareId, statusData) => {
    const token = localStorage.getItem('token');
    const response = await axios.put(`${API_URL}/${complaintId}/spares/${spareId}`, statusData, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
};

const complaintService = {
    bookDiagnosis,
    getMyComplaints,
    getAssignedComplaints,
    getComplaintById,
    getAllComplaints,
    updateComplaintStatus,
    requestSparePart,
    updateSparePartStatus
};

export default complaintService;
