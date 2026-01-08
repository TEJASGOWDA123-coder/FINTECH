import React, { useState } from 'react';
import { getTransactions } from '../services/api';
import '../index.css';

const TransactionHistory = () => {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [accountId, setAccountId] = useState(''); // Allow user to search for now
    const [error, setError] = useState('');

    const fetchTransactions = (e) => {
        if (e) e.preventDefault();
        setLoading(true);
        setError('');

        getTransactions(accountId)
            .then(data => {
                // Ensure data is array
                const txns = Array.isArray(data) ? data : [];
                setTransactions(txns);
                setLoading(false);
            })
            .catch(err => {
                console.error('Fetch Failed:', err);
                setError('Failed to load transactions.');
                setLoading(false);
            });
    };

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <h1 style={styles.header}>Transaction History</h1>
                <h1 style={styles.header}>Transaction History</h1>
                <p style={styles.subHeader}>Track your financial activity.</p>

                <form onSubmit={fetchTransactions} style={{ ...styles.form, marginBottom: '2rem' }}>
                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Account ID to View</label>
                        <input
                            type="text"
                            value={accountId}
                            onChange={(e) => setAccountId(e.target.value)}
                            placeholder="Enter Account ID"
                            required
                        />
                    </div>
                    <button type="submit" style={styles.button}>View History</button>
                </form>

                {error && <p style={styles.error}>{error}</p>}

                {loading ? (
                    <p style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>Loading transactions...</p>
                ) : (
                    <div style={styles.tableContainer}>
                        <table style={styles.table}>
                            <thead>
                                <tr>
                                    <th style={styles.th}>Date</th>
                                    <th style={styles.th}>Type</th>
                                    <th style={styles.th}>ID</th>
                                    <th style={styles.th}>Status</th>
                                    <th style={styles.thRight}>Amount</th>
                                </tr>
                            </thead>
                            <tbody>
                                {transactions.map((txn) => (
                                    <tr key={txn.id} style={styles.tr}>
                                        <td style={styles.td}>{txn.date}</td>
                                        <td style={styles.td}>{txn.type}</td>
                                        <td style={styles.tdCode}>{txn.id}</td>
                                        <td style={styles.td}>
                                            <span style={getStatusStyle(txn.status)}>{txn.status}</span>
                                        </td>
                                        <td style={{ ...styles.tdRight, ...getAmountStyle(txn.amount) }}>
                                            {txn.amount > 0 ? '+' : ''}{txn.amount.toFixed(2)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

const getStatusStyle = (status) => {
    const baseStyle = {
        padding: '0.25rem 0.5rem',
        borderRadius: '4px',
        fontSize: '0.8rem',
        fontWeight: '600',
    };

    switch (status) {
        case 'Completed': return { ...baseStyle, backgroundColor: 'rgba(16, 185, 129, 0.2)', color: '#10b981' };
        case 'Pending': return { ...baseStyle, backgroundColor: 'rgba(245, 158, 11, 0.2)', color: '#f59e0b' };
        case 'Failed': return { ...baseStyle, backgroundColor: 'rgba(239, 68, 68, 0.2)', color: '#ef4444' };
        default: return baseStyle;
    }
};

const getAmountStyle = (amount) => ({
    color: amount > 0 ? '#10b981' : '#f8fafc',
    fontWeight: '600',
});

const styles = {
    container: {
        display: 'flex',
        justifyContent: 'center',
        padding: '40px 20px',
    },
    card: {
        backgroundColor: 'var(--bg-secondary)',
        padding: '2.5rem',
        borderRadius: 'var(--radius-lg)',
        boxShadow: 'var(--shadow-lg)',
        width: '100%',
        maxWidth: '800px', // Wider for table
        border: '1px solid var(--glass-border)',
    },
    header: {
        margin: '0 0 0.5rem 0',
        fontSize: '2rem',
        fontWeight: '700',
        textAlign: 'center',
        background: 'linear-gradient(to right, var(--primary-color), var(--accent-color))',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
    },
    subHeader: {
        color: 'var(--text-secondary)',
        textAlign: 'center',
        marginBottom: '2rem',
    },
    error: {
        color: 'var(--danger-color)',
        textAlign: 'center',
        margin: '1rem',
    },
    form: {
        display: 'flex',
        gap: '1rem',
        alignItems: 'flex-end',
    },
    inputGroup: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        gap: '0.5rem',
    },
    label: {
        fontSize: '0.9rem',
        fontWeight: '500',
        color: 'var(--text-secondary)',
    },
    button: {
        backgroundColor: 'var(--primary-color)',
        color: 'white',
        border: 'none',
        padding: '0.75rem 1.5rem',
        fontSize: '1rem',
        fontWeight: '600',
        borderRadius: 'var(--radius-md)',
        cursor: 'pointer',
    },
    tableContainer: {
        overflowX: 'auto',
    },
    table: {
        width: '100%',
        borderCollapse: 'collapse',
        minWidth: '600px',
    },
    th: {
        textAlign: 'left',
        padding: '1rem',
        color: 'var(--text-secondary)',
        borderBottom: '1px solid var(--glass-border)',
        fontSize: '0.9rem',
    },
    thRight: {
        textAlign: 'right',
        padding: '1rem',
        color: 'var(--text-secondary)',
        borderBottom: '1px solid var(--glass-border)',
        fontSize: '0.9rem',
    },
    tr: {
        borderBottom: '1px solid var(--glass-border)',
        transition: 'background-color 0.2s',
    },
    td: {
        padding: '1rem',
        color: 'var(--text-primary)',
        fontSize: '0.95rem',
    },
    tdCode: {
        padding: '1rem',
        color: 'var(--text-secondary)',
        fontFamily: 'monospace',
        fontSize: '0.9rem',
    },
    tdRight: {
        padding: '1rem',
        textAlign: 'right',
        fontSize: '1rem',
    },
};

export default TransactionHistory;
