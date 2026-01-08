import React, { useState } from 'react';
import { depositFunds } from '../services/api';
import '../index.css';

const Deposit = () => {
    const [formData, setFormData] = useState({
        accountId: '',
        amount: '',
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        console.log('Deposit Data:', formData);

        depositFunds(formData)
            .then(response => {
                console.log('Deposit Success:', response);
                setSuccess(`Successfully deposited $${formData.amount} to Account ${formData.accountId}`);
                setFormData({ accountId: '', amount: '' }); // Reset form
            })
            .catch(err => {
                console.error('Deposit Failed:', err);
                setError('Deposit failed. Please check Account ID and try again.');
            });
    };

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <h1 style={styles.header}>Deposit Funds</h1>
                <p style={styles.subHeader}>Add money to your account securely.</p>

                {error && <p style={styles.error}>{error}</p>}
                {success && <p style={styles.success}>{success}</p>}

                <form onSubmit={handleSubmit} style={styles.form}>
                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Account ID</label>
                        <input
                            type="text"
                            name="accountId"
                            value={formData.accountId}
                            onChange={handleChange}
                            placeholder="Enter Account ID"
                            required
                        />
                    </div>

                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Amount ($)</label>
                        <input
                            type="number"
                            name="amount"
                            value={formData.amount}
                            onChange={handleChange}
                            placeholder="0.00"
                            min="0.01"
                            step="0.01"
                            required
                        />
                    </div>

                    <button type="submit" style={styles.button}>
                        Deposit
                    </button>
                </form>
            </div>
        </div>
    );
};

const styles = {
    container: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '80vh', // Adjusted since we have a navbar now
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
    error: {
        color: 'var(--danger-color)',
        textAlign: 'center',
        marginBottom: '1rem',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        padding: '0.5rem',
        borderRadius: '4px',
    },
    success: {
        color: 'var(--accent-color)',
        textAlign: 'center',
        marginBottom: '1rem',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        padding: '0.5rem',
        borderRadius: '4px',
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
        backgroundColor: 'var(--accent-color)', // Emerald for money actions
        color: 'white',
        border: 'none',
        padding: '1rem',
        fontSize: '1rem',
        fontWeight: '600',
        borderRadius: 'var(--radius-md)',
        marginTop: '1rem',
        transition: 'filter 0.2s',
    },
};

export default Deposit;
