import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { loginUser } from '../services/api';
import '../index.css';

const Login = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        accountNumber: '',
        password: '',
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
        setError(''); // Clear previous errors
        console.log('Login Attempt:', formData);

        // Call the API
        loginUser(formData)
            .then(response => {
                console.log('Login Success:', response);
                // Assuming response contains specific success indicator or user data
                // Store account number or token if needed
                localStorage.setItem('accountNumber', formData.accountNumber);
                alert(`Login Successful! Welcome Account: ${formData.accountNumber}`);
                navigate('/balance'); // Redirect to dashboard/balance on success
            })
            .catch(err => {
                console.error('Login Failed:', err);
                setError('Login failed. Please check your credentials.');
            });
    };

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <h1 style={styles.header}>Welcome Back</h1>
                <p style={styles.subHeader}>Securely access your banking dashboard.</p>

                {error && <p style={styles.error}>{error}</p>}

                <form onSubmit={handleSubmit} style={styles.form}>
                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Account Number</label>
                        <input
                            type="text"
                            name="accountNumber"
                            value={formData.accountNumber}
                            onChange={handleChange}
                            placeholder="ACC12345678"
                            required
                        />
                    </div>

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

                    <button type="submit" style={styles.button}>
                        Login
                    </button>

                    <div style={styles.footer}>
                        <p style={styles.footerText}>New user? <Link to="/create-account" style={styles.link}>Create Account</Link></p>
                    </div>
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
        maxWidth: '400px',
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
    footer: {
        textAlign: 'center',
        marginTop: '1rem',
    },
    footerText: {
        color: 'var(--text-secondary)',
        fontSize: '0.9rem',
    },
    link: {
        color: 'var(--primary-color)',
        textDecoration: 'none',
        fontWeight: '600',
    }
};

export default Login;
