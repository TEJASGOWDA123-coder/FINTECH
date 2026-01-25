import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
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
            <div style={styles.glassCard}>
                <div style={styles.header}>
                    <h1 style={styles.title}>Create Account</h1>
                    <p style={styles.subtitle}>Start your financial journey with us</p>
                </div>

                {error && <div style={styles.error}>{error}</div>}

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
                                style={styles.input}
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
                                style={styles.input}
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
                                style={styles.input}
                                required
                            />
                        </div>
                        <div style={styles.inputGroup}>
                            <label style={styles.label}>Account Type</label>
                            <select
                                name="accountType"
                                value={formData.accountType}
                                onChange={handleChange}
                                style={styles.input}
                            >
                                <option value="Savings">Savings Account</option>
                                <option value="Current">Current Account</option>
                                <option value="Business">Business Account</option>
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
                            style={styles.input}
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
                            rows="2"
                            style={styles.input}
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
                                style={styles.input}
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
                                style={styles.input}
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
                                style={styles.input}
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
                                style={styles.input}
                                required
                            />
                        </div>
                    </div>

                    <button type="submit" style={styles.button}>
                        Create Account
                    </button>

                    <div style={styles.footer}>
                        <p style={styles.footerText}>Already have an account?</p>
                        <Link to="/login" style={styles.link}>Sign In</Link>
                    </div>
                </form>
            </div>
            <style>{`
                @keyframes fadeInUp {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </div>
    );
};

const styles = {
    container: {
        minHeight: '100vh',
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)',
        padding: '2rem 1rem',
    },
    glassCard: {
        width: '100%',
        maxWidth: '700px',
        padding: '3rem',
        borderRadius: '24px',
        background: 'rgba(255, 255, 255, 0.03)',
        backdropFilter: 'blur(16px)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        boxShadow: '0 25px 50px -12px rgba(11, 1, 73, 0.5)',
        animation: 'fadeInUp 0.6s ease-out',
    },
    header: {
        textAlign: 'center',
        marginBottom: '2rem',
    },
    title: {
        fontSize: '2rem',
        fontWeight: '900',
        color: '#ffffff',
        marginBottom: '0.5rem',
        letterSpacing: '-0.02em',
    },
    subtitle: {
        color: '#94a3b8',
        fontSize: '0.95rem',
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        gap: '1.25rem',
    },
    row: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '1.25rem',
    },
    inputGroup: {
        display: 'flex',
        flexDirection: 'column',
        gap: '0.5rem',
    },
    label: {
        color: '#e2e8f0',
        fontSize: '0.85rem',
        fontWeight: '600',
        marginLeft: '0.25rem',
    },
    input: {
        background: 'rgba(0, 0, 0, 0.2)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: '12px',
        padding: '0.9rem 1rem',
        color: '#ffffff',
        fontSize: '0.95rem',
        outline: 'none',
        transition: 'all 0.2s',
        width: '100%',
    },
    button: {
        marginTop: '1rem',
        background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
        color: '#ffffff',
        border: 'none',
        padding: '1rem',
        borderRadius: '12px',
        fontSize: '1rem',
        fontWeight: '700',
        cursor: 'pointer',
        transition: 'all 0.3s',
        boxShadow: '0 10px 15px -3px rgba(99, 102, 241, 0.3)',
    },
    error: {
        background: 'rgba(239, 68, 68, 0.1)',
        border: '1px solid rgba(239, 68, 68, 0.2)',
        color: '#f87171',
        padding: '0.75rem',
        borderRadius: '8px',
        fontSize: '0.85rem',
        textAlign: 'center',
        marginBottom: '1.5rem',
    },
    footer: {
        marginTop: '1.5rem',
        textAlign: 'center',
        display: 'flex',
        justifyContent: 'center',
        gap: '0.5rem',
        fontSize: '0.9rem',
    },
    footerText: {
        color: '#94a3b8',
    },
    link: {
        color: '#818cf8',
        textDecoration: 'none',
        fontWeight: '600',
    }
};

export default CreateAccount;
