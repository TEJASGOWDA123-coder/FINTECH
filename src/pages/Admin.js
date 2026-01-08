import React, { useState, useEffect } from 'react';
import { getAllAccounts } from '../services/api';
import '../index.css';

const Admin = () => {
    const [accounts, setAccounts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        getAllAccounts()
            .then(data => {
                setAccounts(Array.isArray(data) ? data : []);
                setLoading(false);
            })
            .catch(err => {
                console.error('Fetch Failed:', err);
                setError('Failed to load accounts. Ensure backend exposes GET /accounts');
                setLoading(false);
            });
    }, []);

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <h1 style={styles.header}>Admin Panel</h1>
                <p style={styles.subHeader}>View all registered accounts (Debug).</p>

                {error && <p style={styles.error}>{error}</p>}

                {loading ? (
                    <p style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>Loading accounts...</p>
                ) : (
                    <div style={styles.tableContainer}>
                        <table style={styles.table}>
                            <thead>
                                <tr>
                                    <th style={styles.th}>Account ID</th>
                                    <th style={styles.th}>Owner</th>
                                    <th style={styles.th}>Type</th>
                                    <th style={styles.thRight}>Balance</th>
                                </tr>
                            </thead>
                            <tbody>
                                {accounts.map((acc, index) => (
                                    <tr key={index} style={styles.tr}>
                                        <td style={styles.tdCode}>{acc.accountNumber || acc.account_number || acc.id}</td>
                                        <td style={styles.td}>{acc.username || acc.owner}</td>
                                        <td style={styles.td}>{acc.accountType || acc.type}</td>
                                        <td style={styles.tdRight}>${acc.balance || acc.initialDeposit || 0}</td>
                                    </tr>
                                ))}
                                {accounts.length === 0 && (
                                    <tr>
                                        <td colSpan="4" style={{ ...styles.td, textAlign: 'center' }}>No accounts found.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

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
        maxWidth: '900px',
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
        fontWeight: 'bold',
    },
    tdRight: {
        padding: '1rem',
        textAlign: 'right',
        fontSize: '1rem',
        color: 'var(--accent-color)',
    },
};

export default Admin;
