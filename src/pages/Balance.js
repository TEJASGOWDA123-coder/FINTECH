import React, { useState } from 'react';
import { getBalance } from '../services/api';
import '../index.css';

const Balance = () => {
    const [accountId, setAccountId] = useState('');
    const [balance, setBalance] = useState(null);
    const [error, setError] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');
        setBalance(null);
        console.log('Checking balance for:', accountId);
        let acc = localStorage.getItem('accountNumber');
        console.log('acc',acc);
        
        getBalance(acc)
            .then(response => {
                console.log('Balance:', response);
                const bal = typeof response === 'object' ? response.balance : response;
                setBalance(bal);
            })
            .catch(err => {
                console.error('Balance Check Failed:', err);
                setError('Failed to fetch balance. Check Account ID.');
            });
    };

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <h1 style={styles.header}>Check Balance</h1>
                <p style={styles.subHeader}>View your meaningful financial insights.</p>

                {error && <p style={styles.error}>{error}</p>}

                <form onSubmit={handleSubmit} style={styles.form}>
                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Account ID</label>
                        <input
                            type="text"
                            value={accountId}
                            onChange={(e) => setAccountId(e.target.value)}
                            placeholder="Enter Account ID"
                            required
                        />
                    </div>

                    <button type="submit" style={styles.button}>
                        Check Balance
                    </button>
                </form>

                {balance !== null && (
                    <div style={styles.balanceDisplay}>
                        <p style={styles.balanceLabel}>Current Balance</p>
                        <h2 style={styles.balanceAmount}>${balance}</h2>
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
        alignItems: 'center',
        minHeight: '80vh',
        padding: '20px',
    },
    card: {
        backgroundColor: 'var(--bg-secondary)',
        padding: '2.5rem',
        borderRadius: 'var(--radius-lg)',
        boxShadow: 'var(--shadow-lg)',
        width: '100%',
        maxWidth: '480px',
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
    form: {
        display: 'flex',
        flexDirection: 'column',
        gap: '1.5rem',
    },
    inputGroup: {
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
        padding: '1rem',
        fontSize: '1rem',
        fontWeight: '600',
        borderRadius: 'var(--radius-md)',
        marginTop: '1rem',
        transition: 'filter 0.2s',
    },
    balanceDisplay: {
        marginTop: '2rem',
        textAlign: 'center',
        padding: '1.5rem',
        backgroundColor: 'rgba(16, 185, 129, 0.1)', // Subtle emerald tint
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--accent-color)',
        animation: 'fadeIn 0.5s ease-out',
    },
    balanceLabel: {
        margin: '0',
        color: 'var(--text-secondary)',
        fontSize: '0.9rem',
        textTransform: 'uppercase',
        letterSpacing: '1px',
    },
    balanceAmount: {
        margin: '0.5rem 0 0 0',
        fontSize: '2.5rem',
        fontWeight: '700',
        color: 'var(--accent-color)',
    },
    error: {
        color: 'var(--danger-color)',
        textAlign: 'center',
        marginBottom: '1rem',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        padding: '0.5rem',
        borderRadius: '4px',
    },
};

export default Balance;
