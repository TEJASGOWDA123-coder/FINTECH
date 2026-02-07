import axios from 'axios';
axios.defaults.withCredentials = true;

// React proxy (in package.json) will forward requests to http://localhost:8080
const API_URL = '';

const api = axios.create({
    baseURL: API_URL,
    withCredentials: true, // Important: Send cookies (JSESSIONID) with requests
    // Headers are handled automatically by Axios for URLSearchParams
});



export const loginUser = async (credentials) => {
    try {
        const response = await axios.post(
            '/login',
            {
                accountNumber: credentials.accountNumber,
                password: credentials.password
            },
            {
                withCredentials: true // 🔥 REQUIRED
            }
        );
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const createAccount = async (accountData) => {
    const payload = {
        ...accountData,
        AadharNumber: accountData.aadharNumber,
        DOB: accountData.dob
    }
    try {
        const response = await axios.post(
            '/createAccount',
            payload,
            { withCredentials: true }
        );
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const depositFunds = async (data) => {
    try {
        const response = await axios.post(
            '/api/deposit',
            {
                accountId: data.accountId,
                amount: data.amount
            },
            {
                withCredentials: true
            }
        );
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const transferFunds = async (data) => {
    try {
        console.log('Transfer Payload:', {
            fromAccount: data.sourceAccountId,
            toAccount: data.targetAccountId,
            amount: Number(data.amount),
            upiPin: data.upiPin
        });
        const response = await axios.post(
            '/api/transfer',
            {
                fromAccount: data.sourceAccountId,
                toAccount: data.targetAccountId,
                amount: Number(data.amount),
                upiPin: data.upiPin
            },
            {
                withCredentials: true // 🔥 REQUIRED to send session cookie
            }
        );
        return response.data;
    } catch (err) {
        console.error('Transfer Failed:', err);
        throw err;
    }
};

export const getBalance = async (accountId, upiPin) => {
    try {
        const response = await axios.get(
            `/api/balance?accountId=${accountId}&upiPin=${upiPin}`,
            {
                withCredentials: true
            }
        );
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const getTransactions = async (accountId) => {
    try {
        const response = await axios.get(
            `/api/transactions?accountId=${accountId}`,
            {
                withCredentials: true
            }
        );
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const searchUsers = async (query) => {
    try {
        const response = await axios.get(
            `/api/search-user?query=${query}`,
            {
                withCredentials: true
            }
        );
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const sendChatMessage = async (message) => {
    try {
        const response = await axios.post(
            '/api/chat',
            {
                message: message
            },
            {
                withCredentials: true
            }
        );
        return response.data.response; // Returns the AI response
    } catch (error) {
        console.error("AI Chat Error:", error.message);
        throw error;
    }
};


export const downloadStatement = async () => {
    try {
        const response = await axios.get('/api/statements/monthly', {
            responseType: 'blob',
            withCredentials: true
        });
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'monthly_statement.pdf');
        document.body.appendChild(link);
        link.click();
        link.remove();
    } catch (error) {
        console.error("Statement Download Error:", error.message);
        throw error;
    }
};

export const getAuditLogs = async () => {
    try {
        const response = await axios.get('/api/audit/logs', {
            withCredentials: true
        });
        return response.data;
    } catch (error) {
        console.error("Audit Logs Error:", error.message);
        throw error;
    }
};

export const buyStock = async (data) => {
    try {
        const response = await axios.post('/api/trade/buy', data, {
            withCredentials: true
        });
        return response.data;
    } catch (error) {
        console.error("Buy Stock Error:", error.message);
        throw error;
    }
};

export const sellStock = async (data) => {
    try {
        const response = await axios.post('/api/trade/sell', data, {
            withCredentials: true
        });
        return response.data;
    } catch (error) {
        console.error("Sell Stock Error:", error.message);
        throw error;
    }
};
export const getPortfolio = async (accountId) => {
    try {
        const id = accountId || localStorage.getItem('accountNumber');
        const response = await axios.get(`/api/portfolio?accountId=${id}`, {
            withCredentials: true
        });
        return response.data;
    } catch (error) {
        console.error("Get Portfolio Error:", error.message);
        throw error;
    }
};

// Notification APIs
export const getNotifications = async (accountId) => {
    try {
        const id = accountId || localStorage.getItem('accountNumber');
        const response = await axios.get(`/api/notifications?accountId=${id}`, {
            withCredentials: true
        });
        return response.data;
    } catch (error) {
        console.error("Get Notifications Error:", error.message);
        throw error;
    }
};

export const markNotificationRead = async (notificationId, accountId) => {
    try {
        const id = accountId || localStorage.getItem('accountNumber');
        const response = await axios.post(`/api/notifications/mark-read/${notificationId}?accountId=${id}`, {}, {
            withCredentials: true
        });
        return response.data;
    } catch (error) {
        console.error("Mark Notification Read Error:", error.message);
        throw error;
    }
};

export const getUnreadNotificationCount = async (accountId) => {
    try {
        const id = accountId || localStorage.getItem('accountNumber');
        const response = await axios.get(`/api/notifications/unread-count?accountId=${id}`, {
            withCredentials: true
        });
        return response.data.count;
    } catch (error) {
        console.error("Get Unread Count Error:", error.message);
        throw error;
    }
};

export default api;
