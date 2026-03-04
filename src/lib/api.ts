import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

// Create axios instance
const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor to add auth token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor to handle token refresh
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const refreshToken = localStorage.getItem('refreshToken');
                const response = await axios.post(`${API_URL}/auth/refresh-token`, {
                    refreshToken,
                });

                const { accessToken } = response.data.data;
                localStorage.setItem('accessToken', accessToken);

                originalRequest.headers.Authorization = `Bearer ${accessToken}`;
                return api(originalRequest);
            } catch (refreshError) {
                localStorage.removeItem('accessToken');
                localStorage.removeItem('refreshToken');
                window.location.href = '/login';
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

// Auth API
export const authAPI = {
    register: (data: { name: string; email: string; password: string; phone?: string }) =>
        api.post('/auth/register', data),

    login: (data: { email: string; password: string }) =>
        api.post('/auth/login', data),

    logout: () =>
        api.post('/auth/logout'),

    getMe: () =>
        api.get('/auth/me'),

    forgotPassword: (email: string) =>
        api.post('/auth/forgot-password', { email }),

    resetPassword: (data: { token: string; newPassword: string }) =>
        api.post('/auth/reset-password', data),
};

// Contacts API
export const contactsAPI = {
    getAll: (params?: any) =>
        api.get('/contacts', { params }),

    getOne: (id: string) =>
        api.get(`/contacts/${id}`),

    create: (data: any) =>
        api.post('/contacts', data),

    update: (id: string, data: any) =>
        api.put(`/contacts/${id}`, data),

    delete: (id: string) =>
        api.delete(`/contacts/${id}`),

    import: (file: File) => {
        const formData = new FormData();
        formData.append('file', file);
        return api.post('/contacts/import', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
    },

    export: () =>
        api.get('/contacts/export', { responseType: 'blob' }),
};

// Campaigns API
export const campaignsAPI = {
    getAll: (params?: any) =>
        api.get('/campaigns', { params }),

    getOne: (id: string) =>
        api.get(`/campaigns/${id}`),

    create: (data: any) =>
        api.post('/campaigns', data),

    update: (id: string, data: any) =>
        api.put(`/campaigns/${id}`, data),

    delete: (id: string) =>
        api.delete(`/campaigns/${id}`),

    start: (id: string) =>
        api.post(`/campaigns/${id}/start`),

    pause: (id: string) =>
        api.post(`/campaigns/${id}/pause`),

    getStats: () =>
        api.get('/campaigns/stats'),
};

// Conversations API
export const conversationsAPI = {
    getAll: (params?: any) =>
        api.get('/conversations', { params }),

    getOne: (id: string) =>
        api.get(`/conversations/${id}`),

    create: (data: any) =>
        api.post('/conversations', data),

    update: (id: string, data: any) =>
        api.put(`/conversations/${id}`, data),

    assign: (id: string, assignedTo: string) =>
        api.post(`/conversations/${id}/assign`, { assignedTo }),

    close: (id: string) =>
        api.post(`/conversations/${id}/close`),

    getStats: () =>
        api.get('/conversations/stats'),
};

// Messages API
export const messagesAPI = {
    getAll: (conversationId: string, params?: any) =>
        api.get(`/messages/${conversationId}`, { params }),

    send: (data: { conversationId: string; content: string; type?: string; mediaUrl?: string }) =>
        api.post('/messages', data),

    markAsRead: (conversationId: string) =>
        api.post(`/messages/${conversationId}/read`),
};

// Bots API
export const botsAPI = {
    getAll: (params?: any) =>
        api.get('/bots', { params }),

    getOne: (id: string) =>
        api.get(`/bots/${id}`),

    create: (data: any) =>
        api.post('/bots', data),

    update: (id: string, data: any) =>
        api.put(`/bots/${id}`, data),

    delete: (id: string) =>
        api.delete(`/bots/${id}`),

    toggle: (id: string) =>
        api.post(`/bots/${id}/toggle`),

    importN8n: (workflow: any) =>
        api.post('/bots/import-n8n', { workflow }),
};

// Templates API
export const templatesAPI = {
    getAll: () =>
        api.get('/templates'),

    getOne: (id: string) =>
        api.get(`/templates/${id}`),

    create: (data: any) =>
        api.post('/templates', data),

    update: (id: string, data: any) =>
        api.put(`/templates/${id}`, data),

    delete: (id: string) =>
        api.delete(`/templates/${id}`),

    sync: () =>
        api.post('/templates/sync'),
};

// Dashboard API
export const dashboardAPI = {
    getStats: (period?: string) =>
        api.get('/dashboard/stats', { params: { period } }),

    getActivity: (limit?: number) =>
        api.get('/dashboard/activity', { params: { limit } }),
};

export default api;
