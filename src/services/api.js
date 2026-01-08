import axios from 'axios';

// React proxy (in package.json) will forward requests to http://localhost:8080
const API_URL = '/fintech-banking';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded', // Servlets often expect form data
    },
});

export const loginUser = async (credentials) => {
    try {
        // Expecting a Servlet that accepts POST params
        const params = new URLSearchParams();
        params.append('accountNumber', credentials.accountNumber);
        params.append('password', credentials.password);

        const response = await api.post('/login', params);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const createAccount = async (accountData) => {
    try {
        const params = new URLSearchParams();
        Object.keys(accountData).forEach(key => params.append(key, accountData[key]));

        const response = await api.post('/createAccount', params);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const depositFunds = async (data) => {
    try {
        const params = new URLSearchParams();
        params.append('accountId', data.accountId);
        params.append('amount', data.amount);

        const response = await api.post('/deposit', params);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const transferFunds = async (data) => {
    try {
        const params = new URLSearchParams();
        params.append('sourceAccountId', data.sourceAccountId);
        params.append('targetAccountId', data.targetAccountId);
        params.append('amount', data.amount);

        const response = await api.post('/transfer', params);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const getBalance = async (accountId) => {
    try {
        const response = await api.get(`/balance?accountId=${accountId}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const getTransactions = async (accountId) => {
    try {
        const response = await api.get(`/transactions?accountId=${accountId}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const getAllAccounts = async () => {
    try {
        // Trying standard REST convention or common Servlet pattern
        const response = await api.get('/accounts');
        return response.data;
    } catch (error) {
        throw error;
    }
};

export default api;
