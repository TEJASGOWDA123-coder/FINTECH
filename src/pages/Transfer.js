import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { transferFunds } from '../services/api';
import '../index.css';

const Transfer = () => {
    const storedAccount = localStorage.getItem('accountNumber') || 'N/A';
    const [formData, setFormData] = useState({
        targetAccountId: '',
        amount: '',
        upiPin: '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setLoading(true);

        try {
            await transferFunds(formData);
            setSuccess(`Successfully transferred $${formData.amount} to Account ${formData.targetAccountId}`);
            setFormData({ ...formData, targetAccountId: '', amount: '', upiPin: '' });
        } catch (err) {
            console.error('Transfer Failed:', err);
            setError(err.response?.data?.message || 'Transfer failed. Please check details and balance.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={styles.container}>
            {/* Top Bar (Simplified version of Dashboard Top Bar) */}
            <header style={styles.topBar}>
                <div style={styles.headerTitle}>
                    <h1 style={styles.title}>Send Money</h1>
                    <p style={styles.subtitle}>Secure, instant transfers to any account.</p>
                </div>
                <div style={styles.userActions}>
                    <Link to="/notifications" style={styles.notifIcon}>🔔</Link>
                    <Link to="/settings" style={styles.settingsIcon}>⚙️</Link>
                    <Link to="/profile" style={styles.profilePic}>
                        <div style={styles.pPicInner} />
                    </Link>
                </div>
            </header>

            <div style={styles.contentGrid}>
                {/* Transfer Form Card */}
                <div style={styles.card}>
                    <div style={styles.cardGlow} />
                    <form onSubmit={handleSubmit} style={styles.form}>
                        <div style={styles.inputSection}>
                            <label style={styles.label}>Recipient Account</label>
                            <div style={styles.inputWrapper}>
                                <span style={styles.inputIcon}>🆔</span>
                                <input
                                    type="text"
                                    name="targetAccountId"
                                    value={formData.targetAccountId}
                                    onChange={handleChange}
                                    placeholder="Enter recipient's account ID"
                                    style={styles.input}
                                    required
                                />
                            </div>
                        </div>

                        <div style={styles.inputSection}>
                            <label style={styles.label}>Amount ($)</label>
                            <div style={styles.inputWrapper}>
                                <span style={styles.inputIcon}>💰</span>
                                <input
                                    type="number"
                                    name="amount"
                                    value={formData.amount}
                                    onChange={handleChange}
                                    placeholder="0.00"
                                    min="0.01"
                                    step="0.01"
                                    style={styles.input}
                                    required
                                />
                            </div>
                        </div>

                        <div style={styles.inputSection}>
                            <label style={styles.label}>UPI PIN</label>
                            <div style={styles.inputWrapper}>
                                <span style={styles.inputIcon}>🔒</span>
                                <input
                                    type="password"
                                    name="upiPin"
                                    value={formData.upiPin}
                                    onChange={handleChange}
                                    placeholder="Enter 6-digit security PIN"
                                    maxLength="6"
                                    style={styles.input}
                                    required
                                />
                            </div>
                        </div>

                        {error && <div style={styles.errorBox}>{error}</div>}
                        {success && <div style={styles.successBox}>{success}</div>}

                        <button
                            type="submit"
                            style={{
                                ...styles.submitBtn,
                                opacity: loading ? 0.7 : 1,
                                cursor: loading ? 'not-allowed' : 'pointer'
                            }}
                            disabled={loading}
                        >
                            {loading ? 'Processing...' : 'Confirm Transfer 🚀'}
                        </button>
                    </form>
                </div>

                {/* Info Card */}
                <div style={styles.infoCard}>
                    <h3 style={styles.infoTitle}>Transfer Information</h3>
                    <div style={styles.infoItem}>
                        <p style={styles.infoLabel}>From Account</p>
                        <p style={styles.infoValue}>{storedAccount}</p>
                    </div>
                    <div style={styles.infoItem}>
                        <p style={styles.infoLabel}>Fees</p>
                        <p style={styles.infoValue}>$0.00 (Free)</p>
                    </div>
                    <div style={styles.infoItem}>
                        <p style={styles.infoLabel}>Estimated Arrival</p>
                        <p style={styles.infoValue}>Instant</p>
                    </div>
                    <div style={styles.securityTip}>
                        <span style={{ fontSize: '1.2rem' }}>🛡️</span>
                        <p style={styles.tipText}>
                            Always double-check the recipient's Account ID before confirming the transaction.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

const styles = {
    container: {
        paddingBottom: '2rem',
        backgroundColor: 'var(--bg-primary)',
        minHeight: '100vh',
        transition: 'var(--transition)',
    },
    topBar: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '2.5rem',
    },
    headerTitle: {
        display: 'flex',
        flexDirection: 'column',
        gap: '0.25rem',
    },
    title: {
        fontSize: '2rem',
        fontWeight: '900',
        margin: 0,
        color: 'var(--text-primary)',
    },
    subtitle: {
        color: 'var(--text-muted)',
        margin: 0,
        fontSize: '1rem',
    },
    userActions: {
        display: 'flex',
        alignItems: 'center',
        gap: '1.5rem',
    },
    notifIcon: { fontSize: '1.2rem', cursor: 'pointer', color: 'var(--text-secondary)' },
    settingsIcon: { fontSize: '1.2rem', cursor: 'pointer', color: 'var(--text-secondary)' },
    profilePic: {
        width: '40px',
        height: '40px',
        borderRadius: '10px',
        backgroundColor: 'var(--bg-tertiary)',
        padding: '2px',
        border: '1px solid var(--glass-border)',
    },
    pPicInner: {
        width: '100%',
        height: '100%',
        borderRadius: '8px',
        background: 'linear-gradient(135deg, #4f46e5 0%, #c026d3 100%)',
    },
    contentGrid: {
        display: 'grid',
        gridTemplateColumns: '1.5fr 1fr',
        gap: '2.5rem',
        maxWidth: '1200px',
        margin: '0 auto',
    },
    card: {
        backgroundColor: 'var(--bg-secondary)',
        borderRadius: '24px',
        padding: '2.5rem',
        border: '1px solid var(--glass-border)',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: 'var(--shadow-lg)',
    },
    cardGlow: {
        position: 'absolute',
        top: '-100px',
        right: '-100px',
        width: '300px',
        height: '300px',
        background: 'radial-gradient(circle, rgba(79, 70, 229, 0.1) 0%, transparent 70%)',
        zIndex: 0,
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        gap: '2rem',
        position: 'relative',
        zIndex: 1,
    },
    inputSection: {
        display: 'flex',
        flexDirection: 'column',
        gap: '0.75rem',
    },
    label: {
        fontSize: '0.85rem',
        fontWeight: '700',
        color: 'var(--text-muted)',
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
        marginLeft: '4px',
    },
    inputWrapper: {
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
    },
    inputIcon: {
        position: 'absolute',
        left: '1.25rem',
        fontSize: '1.1rem',
        opacity: 0.7,
    },
    input: {
        paddingLeft: '3.5rem',
        height: '60px',
        fontSize: '1.1rem',
        fontWeight: '500',
    },
    submitBtn: {
        marginTop: '1rem',
        height: '60px',
        backgroundColor: 'var(--primary-color)',
        color: 'white',
        border: 'none',
        borderRadius: '16px',
        fontSize: '1.1rem',
        fontWeight: '800',
        transition: 'var(--transition)',
        boxShadow: '0 8px 16px -4px rgba(79, 70, 229, 0.4)',
    },
    errorBox: {
        padding: '1rem',
        backgroundColor: 'rgba(244, 63, 94, 0.1)',
        border: '1px solid rgba(244, 63, 94, 0.2)',
        borderRadius: '12px',
        color: 'var(--danger-color)',
        fontSize: '0.9rem',
        textAlign: 'center',
    },
    successBox: {
        padding: '1rem',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        border: '1px solid rgba(16, 185, 129, 0.2)',
        borderRadius: '12px',
        color: 'var(--success-color)',
        fontSize: '0.9rem',
        textAlign: 'center',
    },
    infoCard: {
        backgroundColor: 'var(--bg-tertiary)',
        borderRadius: '24px',
        padding: '2rem',
        border: '1px solid var(--glass-border)',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.5rem',
    },
    infoTitle: {
        fontSize: '1.2rem',
        fontWeight: '800',
        margin: '0 0 0.5rem 0',
        color: 'var(--text-primary)',
    },
    infoItem: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingBottom: '1rem',
        borderBottom: '1px solid var(--glass-border)',
    },
    infoLabel: {
        fontSize: '0.9rem',
        color: 'var(--text-muted)',
        margin: 0,
    },
    infoValue: {
        fontSize: '1rem',
        fontWeight: '700',
        color: 'var(--text-primary)',
        margin: 0,
    },
    securityTip: {
        marginTop: 'auto',
        padding: '1.25rem',
        backgroundColor: 'var(--bg-secondary)',
        borderRadius: '16px',
        display: 'flex',
        gap: '1rem',
        alignItems: 'center',
        border: '1px solid var(--glass-border)',
    },
    tipText: {
        fontSize: '0.85rem',
        color: 'var(--text-secondary)',
        margin: 0,
        lineHeight: '1.5',
    },
};

export default Transfer;
