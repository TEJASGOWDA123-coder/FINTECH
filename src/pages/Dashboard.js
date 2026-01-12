import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { fetchLoginUser } from '../services/api';
import '../index.css';

const Dashboard = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [accountNumber, setAccountNumber] = useState('');

    useEffect(() => {

        const token = localStorage.getItem('token')
        fetchLoginUser(token).then(response => {
            console.log('Logged in user data:', response);
            setAccountNumber(response.data.Currentballance);
            // You can set user data to state if needed
        });
        // console.log({'dashboard_token':token});
        
        if (location.state && location.state.accountNumber) {
            setAccountNumber(location.state.accountNumber);
        } else {
            // Redirect to login if accessed directly without state (optional security/UX measure)
            // For now, we'll just show a message or let it stay empty
        }
    }, [location]);

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <h1 style={styles.header}>Welcome to Your Dashboard</h1>
                <p style={styles.subHeader}>Your financial journey begins here.</p>

                {accountNumber ? (
                    <div style={styles.successBox}>
                        <h2 style={styles.successTitle}>Account Created Successfully!</h2>
                        <p style={styles.text}>Your Account Number is:</p>
                        <div style={styles.accountNumberDisplay}>
                            {accountNumber}
                        </div>
                        <p style={styles.note}>
                            Please save this number. You will need it for deposits and transfers.
                        </p>
                    </div>
                ) : (
                    <div style={styles.infoBox}>
                        <p>No account information found. Please create an account or login.</p>
                    </div>
                )}

                <div style={styles.buttonGroup}>
                    <button onClick={() => navigate('/deposit')} style={styles.button}>
                        Make a Deposit
                    </button>
                    <button onClick={() => navigate('/transfer')} style={styles.secondaryButton}>
                        Transfer Funds
                    </button>
                    <button onClick={() => navigate('/login')} style={styles.outlineButton}>
                        Go to Login
                    </button>
                </div>
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
        maxWidth: '600px',
        border: '1px solid var(--glass-border)',
        textAlign: 'center',
    },
    header: {
        margin: '0 0 0.5rem 0',
        fontSize: '2rem',
        fontWeight: '700',
        background: 'linear-gradient(to right, var(--primary-color), var(--accent-color))',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
    },
    subHeader: {
        color: 'var(--text-secondary)',
        marginBottom: '2rem',
    },
    successBox: {
        backgroundColor: 'rgba(16, 185, 129, 0.1)', // Light green tint
        border: '1px solid rgba(16, 185, 129, 0.3)',
        borderRadius: 'var(--radius-md)',
        padding: '2rem',
        marginBottom: '2rem',
    },
    successTitle: {
        color: '#10B981', // Green
        fontSize: '1.5rem',
        marginBottom: '1rem',
    },
    text: {
        color: 'var(--text-secondary)',
        marginBottom: '0.5rem',
    },
    accountNumberDisplay: {
        fontSize: '2.5rem',
        fontWeight: 'bold',
        color: 'var(--text-primary)',
        letterSpacing: '2px',
        margin: '1rem 0',
        padding: '1rem',
        backgroundColor: 'var(--bg-primary)',
        borderRadius: 'var(--radius-md)',
        border: '1px dashed var(--glass-border)',
    },
    note: {
        fontSize: '0.9rem',
        color: 'var(--text-secondary)',
        fontStyle: 'italic',
    },
    infoBox: {
        padding: '2rem',
        color: 'var(--text-secondary)',
    },
    buttonGroup: {
        display: 'flex',
        gap: '1rem',
        justifyContent: 'center',
        flexWrap: 'wrap',
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
        transition: 'transform 0.2s',
    },
    secondaryButton: {
        backgroundColor: 'var(--accent-color)',
        color: 'white',
        border: 'none',
        padding: '0.75rem 1.5rem',
        fontSize: '1rem',
        fontWeight: '600',
        borderRadius: 'var(--radius-md)',
        cursor: 'pointer',
    },
    outlineButton: {
        backgroundColor: 'transparent',
        color: 'var(--text-primary)',
        border: '1px solid var(--glass-border)',
        padding: '0.75rem 1.5rem',
        fontSize: '1rem',
        fontWeight: '600',
        borderRadius: 'var(--radius-md)',
        cursor: 'pointer',
    },
};

export default Dashboard;
