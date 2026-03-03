import axios from "axios";

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000",
    headers: {
        "Content-Type": "application/json",
    },
});

export const entryApi = {
    createVisitor: (data: any) => api.post("/entries/visitor", data),
    createVehicle: (data: any) => api.post("/entries/vehicle", data),
};

export const qrApi = {
    getQR: (id: string) => api.get(`/qrs/${id}`),
};

export default api;
