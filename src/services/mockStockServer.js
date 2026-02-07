import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

// Create a new instance of the mock adapter on the default axios instance
// onNoMatch: "passthrough" allows other requests (like login) to go to the real server
const mock = new MockAdapter(axios, { delayResponse: 0, onNoMatch: "passthrough" });

const INITIAL_STOCKS = [
    { symbol: 'AAPL', quantity: 10, buyPrice: 150.00, currentPrice: 155.00 },
    { symbol: 'GOOGL', quantity: 5, buyPrice: 2800.00, currentPrice: 2750.00 },
    { symbol: 'TSLA', quantity: 8, buyPrice: 900.00, currentPrice: 920.00 },
    { symbol: 'AMZN', quantity: 15, buyPrice: 3300.00, currentPrice: 3350.00 },
    { symbol: 'MSFT', quantity: 12, buyPrice: 290.00, currentPrice: 305.00 },
];

/**
 * Configure the mock adapter to intercept GET requests to http://localhost:3000/stocks
 */
export const setupStockMock = () => {
    mock.onGet('http://localhost:3000/stocks').reply(async (config) => {
        // Simulate random latency between 100ms and 500ms
        const latency = Math.floor(Math.random() * 400) + 100;

        await new Promise(resolve => setTimeout(resolve, latency));

        // Fluctuate prices slightly
        const updatedStocks = INITIAL_STOCKS.map(stock => {
            const changePercent = (Math.random() * 0.02) - 0.01; // -1% to +1%
            const newPrice = stock.currentPrice * (1 + changePercent);
            return {
                ...stock,
                currentPrice: parseFloat(newPrice.toFixed(2))
            };
        });

        // Return legacy 200 OK and data
        return [200, updatedStocks];
    });

    console.log('Mock Stock API initialized');
};
