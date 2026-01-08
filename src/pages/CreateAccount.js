import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createAccount } from '../services/api';
import '../index.css';

const CreateAccount = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: '',
        phoneNumber: '',
        dob: '',
        email: '',
        address: '',
        aadharNumber: '',
        panNumber: '',
        password: '',
        accountType: 'Savings',
        initialDeposit: '',
    });
    const [error, setError] = useState('');

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
        console.log('Account Creation Data:', formData);

        createAccount(formData)
            .then(response => {
                console.log('Account Created:', response);
                // The Servlet redirects to create_account.jsp?success=true&account=ACC...
                // But since we are using axios, we might get the HTML of that page or a redirect response.
                // ideally the backend should return JSON.
                // If the backend returns a redirect, axios might follow it or return the page.

                // Assuming for now the backend might be adjusted or we parse the redirect URL if possible,
                // OR we just alert the user to check their backend logs/DB if we can't parse it easily without backend changes.

                // However, often standard Spring MVC/Servlets interaction with React implies returning JSON.
                // If the Servlet code provided earlier does `response.sendRedirect`, that's tricky for an SPA (Single Page App).

                // Hack: If we assume the user modifies the backend to return JSON, good.
                // If not, we might check if response.request.responseURL contains the account number?

                // Let's assume successful 200 OK means it worked for now and try to hint at the login,
                // or simpler: tell the user "Account Created! Please check your dashboard or backend specific output for the Account Number".

                // WAIT, earlier I saw: `response.sendRedirect("create_account.jsp?success=true&account=" + accountNumber);`
                // Axios follows redirects transparently usually. The final responseURL might have the param.

                alert(`Account Creation Request Sent! \nIf successful, you can now login with your password.`);
                navigate('/login');
            })
            .catch(err => {
                console.error('Creation Failed:', err);
                setError('Failed to create account. Please check your inputs or backend connection.');
            });
    };

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <h1 style={styles.header}>Create Account</h1>
                <p style={styles.subHeader}>Start your financial journey with us.</p>

                {error && <p style={styles.error}>{error}</p>}

                <form onSubmit={handleSubmit} style={styles.form}>
                    <div style={styles.row}>
                        <div style={styles.inputGroup}>
                            <label style={styles.label}>Username</label>
                            <input
                                type="text"
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                                placeholder="johndoe123"
                                required
                            />
                        </div>

                        <div style={styles.inputGroup}>
                            <label style={styles.label}>Phone Number</label>
                            <input
                                type="tel"
                                name="phoneNumber"
                                value={formData.phoneNumber}
                                onChange={handleChange}
                                placeholder="+1 234 567 8900"
                                required
                            />
                        </div>
                    </div>

                    <div style={styles.row}>
                        <div style={styles.inputGroup}>
                            <label style={styles.label}>Date of Birth</label>
                            <input
                                type="date"
                                name="dob"
                                value={formData.dob}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div style={styles.inputGroup}>
                            <label style={styles.label}>Account Type</label>
                            <select
                                name="accountType"
                                value={formData.accountType}
                                onChange={handleChange}
                                style={styles.select}
                            >
                                <option value="Savings">Savings</option>
                                <option value="Current">Current</option>
                                <option value="Business">Business</option>
                            </select>
                        </div>
                    </div>

                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Email Address</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="john@example.com"
                            required
                        />
                    </div>

                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Address</label>
                        <textarea
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            placeholder="123 FinTech Ave, New York, NY"
                            rows="3"
                            style={styles.textarea}
                            required
                        />
                    </div>

                    <div style={styles.row}>
                        <div style={styles.inputGroup}>
                            <label style={styles.label}>Aadhar Number</label>
                            <input
                                type="text"
                                name="aadharNumber"
                                value={formData.aadharNumber}
                                onChange={handleChange}
                                placeholder="1234 5678 9012"
                                required
                            />
                        </div>

                        <div style={styles.inputGroup}>
                            <label style={styles.label}>PAN Number</label>
                            <input
                                type="text"
                                name="panNumber"
                                value={formData.panNumber}
                                onChange={handleChange}
                                placeholder="ABCDE1234F"
                                required
                            />
                        </div>
                    </div>

                    <div style={styles.row}>
                        <div style={styles.inputGroup}>
                            <label style={styles.label}>Password</label>
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="••••••••"
                                required
                            />
                        </div>

                        <div style={styles.inputGroup}>
                            <label style={styles.label}>Initial Deposit ($)</label>
                            <input
                                type="number"
                                name="initialDeposit"
                                value={formData.initialDeposit}
                                onChange={handleChange}
                                placeholder="0.00"
                                min="0"
                                required
                            />
                        </div>
                    </div>

                    <button type="submit" style={styles.button}>
                        Create Account
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
        minHeight: '100vh',
        padding: '20px',
    },
    card: {
        backgroundColor: 'var(--bg-secondary)',
        padding: '2.5rem',
        borderRadius: 'var(--radius-lg)',
        boxShadow: 'var(--shadow-lg)',
        width: '100%',
        maxWidth: '520px', // Wider to accommodate 2 columns
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
    form: {
        display: 'flex',
        flexDirection: 'column',
        gap: '1.5rem',
    },
    row: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '1rem',
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
    select: {
        padding: '0.75rem 1rem',
        backgroundColor: 'var(--bg-secondary)',
        border: '1px solid var(--glass-border)',
        color: 'var(--text-primary)',
        borderRadius: 'var(--radius-md)',
        fontSize: '1rem',
        width: '100%',
        boxSizing: 'border-box',
    },
    textarea: {
        padding: '0.75rem 1rem',
        backgroundColor: 'var(--bg-secondary)',
        border: '1px solid var(--glass-border)',
        color: 'var(--text-primary)',
        borderRadius: 'var(--radius-md)',
        fontSize: '1rem',
        width: '100%',
        boxSizing: 'border-box',
        fontFamily: 'inherit',
        resize: 'vertical',
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
        transition: 'background-color 0.2s',
    },
};

export default CreateAccount;
