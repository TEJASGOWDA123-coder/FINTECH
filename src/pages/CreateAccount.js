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

    const handleSubmit = async(e) => {
        e.preventDefault();
        setError('');
        console.log('Account Creation Data:', formData);

        const payload = {
            ...formData,
            DOB: formData.dob,
            AadharNumber: formData.aadharNumber,
            Currentballance: formData.initialDeposit,
        };
        delete payload.dob;
        delete payload.aadharNumber;
        const response = await createAccount(payload)
        if(response.status==='success'){
            navigate('/login');
        }else if(response.status==='failed'){
            setError(response.message);
        }
            
            
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
