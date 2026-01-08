import React, { useState } from 'react';
import { transferFunds } from '../services/api';
import '../index.css';

const Transfer = () => {
    const [formData, setFormData] = useState({
        sourceAccountId: '',
        targetAccountId: '',
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
        console.log('Transfer Data:', formData);

        transferFunds(formData)
            .then(response => {
                console.log('Transfer Success:', response);
                setSuccess(`Successfully transferred $${formData.amount} to Account ${formData.targetAccountId}`);
                setFormData({ sourceAccountId: '', targetAccountId: '', amount: '' }); // Reset
            })
            .catch(err => {
                console.error('Transfer Failed:', err);
                setError('Transfer failed. Please check details and balance.');
            });
    };

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <h1 style={styles.header}>Transfer Funds</h1>
                <p style={styles.subHeader}>Send money securely to another account.</p>

                {error && <p style={styles.error}>{error}</p>}
                {success && <p style={styles.success}>{success}</p>}

                <form onSubmit={handleSubmit} style={styles.form}>
                    <div style={styles.inputGroup}>
                        <label style={styles.label}>From Account ID</label>
                        <input
                            type="text"
                            name="sourceAccountId"
                            value={formData.sourceAccountId}
                            onChange={handleChange}
                            placeholder="Your Account ID"
                            required
                        />
                    </div>

                    <div style={styles.inputGroup}>
                        <label style={styles.label}>To Account ID</label>
                        <input
                            type="text"
                            name="targetAccountId"
                            value={formData.targetAccountId}
                            onChange={handleChange}
                            placeholder="Recipient's Account ID"
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
                        Transfer Now
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
};

export default Transfer;
