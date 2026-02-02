import axios from 'axios';
// import { GoogleGenerativeAI } from "@google/generative-ai";
import { GoogleGenAI } from "@google/genai";

// React proxy (in package.json) will forward requests to http://localhost:8080
const API_URL = '';
const GEMINI_API_KEY = process.env.REACT_APP_GEMINI_API_KEY;

const api = axios.create({
    baseURL: API_URL,
    withCredentials: true, // Important: Send cookies (JSESSIONID) with requests
    // Headers are handled automatically by Axios for URLSearchParams
});

const token = localStorage.getItem('token');

export const loginUser = async (credentials) => {
    try {
        const response = await axios.post(
            'http://localhost:8080/login',
            {
                AccountNumber: credentials.accountNumber,
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
    const payload = {...accountData,
        AadharNumber : accountData.aadharNumber,
        DOB : accountData.dob
    }
    try {
        const response = await axios.post(
            'http://localhost:8080/CreateAccount',
            payload,
           
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
            'http://localhost:8080/transfer-money',
            {
                targetAccountId: data.targetAccountId,
                amount: data.amount,
                upiPin: data.upiPin
            },
            {
                headers:{
                    Authorization : `Bearer ${token}`
                    
                }
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
            },
            {
                headers : {
                    Autherization : `Bearer ${token}`
                }
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

// const genAI = new GoogleGenerativeAI(`${GEMINI_API_KEY}`);
const ai = new GoogleGenAI({apiKey : 'AIzaSyCk0AMRNT4Fg_GpBQMxlz6Ixe-BmfxvPSI'});

const SYSTEM_PROMPT = `
You are a virtual assistant for Fintech Bank.

Rules:
- Answer ONLY questions related to Fintech Bank services.
- If the question is not related to banking or Fintech Bank, politely refuse.
- Keep responses concise and under 30 words.
- If qustion is not you know then you can reply in short 8-9 words  like this information is not feeded like this.
- Be professional, clear, and helpful.
- When asked about account creation, always provide this link:
  https://fintechbank.com/create-account
- When details are missing, ask a clarifying question.
- Do not hallucinate policies or offers.
`;

export const sendChatMessage = async (message, accountId) => {
    try {
            const res =    await ai.models.generateContent({
                    model: "gemini-3-flash-preview",
                    contents: [
                        {
                        role: "system",
                        parts: [{ text: SYSTEM_PROMPT }]
                        },
                        {
                        role: "user",
                        parts: [{ text: message }]
                        }
                    ]
                });                
     
                const reply =
                res.candidates?.[0]?.content?.parts?.[0]?.text;

    return reply;
      
    } catch (error) {
        console.error("Gemini API Error:", error.message);
        throw error;
    }
};


export default api;
