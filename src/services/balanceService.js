import axios from 'axios';

export const fetchBalance = async (accountId, pin) => {
    const response = await axios.post(
        "http://localhost:8080/api/balance",
        { accountId, pin },
        {
            withCredentials: true // 🔥 REQUIRED
        }
    );
    return response.data;
};
