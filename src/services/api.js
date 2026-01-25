import axios from 'axios';

// React proxy (in package.json) will forward requests to http://localhost:8080
const API_URL = '';
const GEMINI_API_KEY = process.env.REACT_APP_GEMINI_API_KEY;

const api = axios.create({
    baseURL: API_URL,
    withCredentials: true, // Important: Send cookies (JSESSIONID) with requests
    // Headers are handled automatically by Axios for URLSearchParams
});

export const loginUser = async (credentials) => {
    try {
        const response = await axios.post(
            'http://localhost:8080/login',
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
    try {
        const response = await axios.post(
            'http://localhost:8080/createAccount',
            accountData,
            {
                withCredentials: true
            }
        );
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const depositFunds = async (data) => {
    try {
        const response = await axios.post(
            'http://localhost:8080/api/deposit',
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
        const response = await axios.post(
            'http://localhost:8080/api/transfer',
            {
                sourceAccountId: data.sourceAccountId,
                targetAccountId: data.targetAccountId,
                amount: data.amount,
                upiPin: data.upiPin
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

export const getBalance = async (accountId, upiPin) => {
    try {
        const response = await axios.get(
            `http://localhost:8080/api/balance?accountId=${accountId}&upiPin=${upiPin}`,
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
            `http://localhost:8080/api/transactions?accountId=${accountId}`,
            {
                withCredentials: true
            }
        );
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const sendChatMessage = async (message, accountId) => {
    try {
        const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;

        const systemPrompt = `You are Fintech AI, a premium banking assistant for Financo. 
        Your user is identifying with account: ${accountId}.
        Current context: Providing help via the chat interface.
        Instructions: Keep responses helpful, professional, and clear. 
        Note: For balance/transfer/history details, guide the user to the specific dashboard pages.`;

        const response = await axios.post(geminiUrl, {
            contents: [{
                parts: [{
                    text: `${systemPrompt}\n\nUser Question: ${message}`
                }]
            }]
        });

        if (response.data && response.data.candidates && response.data.candidates[0].content.parts[0].text) {
            return { response: response.data.candidates[0].content.parts[0].text };
        }
        throw new Error("Empty response from AI service");
    } catch (error) {
        console.error("Gemini API Error:", error.message);
        throw error;
    }
};


export default api;
