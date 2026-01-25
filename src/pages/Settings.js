import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';

const Settings = () => {
    const { theme, toggleTheme } = useTheme();
    const [is2FAEnabled, setIs2FAEnabled] = useState(localStorage.getItem('2faEnabled') === 'true');
    const [showModal, setShowModal] = useState(false);
    const [passwords, setPasswords] = useState({ current: '', new: '', confirm: '' });
    const [message, setMessage] = useState({ text: '', type: '' }); // type: 'success' | 'error'

    const showMessage = (text, type = 'success') => {
        setMessage({ text, type });
        setTimeout(() => setMessage({ text: '', type: '' }), 3000);
    };

    const toggle2FA = () => {
        const newState = !is2FAEnabled;
        setIs2FAEnabled(newState);
        localStorage.setItem('2faEnabled', newState);
        showMessage(`Two-Factor Authentication ${newState ? 'Enabled' : 'Disabled'}`);
    };

    const handlePasswordChange = (e) => {
        e.preventDefault();
        if (passwords.new !== passwords.confirm) {
            showMessage('New passwords do not match', 'error');
            return;
        }
        if (passwords.new.length < 6) {
            showMessage('Password must be at least 6 characters', 'error');
            return;
        }
        // Simulate API call
        setTimeout(() => {
            setShowModal(false);
            showMessage('Password changed successfully');
            setPasswords({ current: '', new: '', confirm: '' });
        }, 500);
    };

    const [profile, setProfile] = useState({
        name: localStorage.getItem('profileName') || 'Active User',
        email: localStorage.getItem('profileEmail') || 'user@fintech.com'
    });

    const handleProfileChange = (e) => {
        const { name, value } = e.target;
        setProfile(prev => ({ ...prev, [name]: value }));
        if (name === 'name') localStorage.setItem('profileName', value);
        if (name === 'email') localStorage.setItem('profileEmail', value);
    };

    return (
        <div style={styles.container}>
            {message.text && (
                <div style={{ ...styles.toast, backgroundColor: message.type === 'error' ? 'rgba(239, 68, 68, 0.9)' : 'rgba(16, 185, 129, 0.9)' }}>
                    {message.text}
                </div>
            )}

            <header style={styles.header}>
                <h1 style={styles.title}>Settings</h1>
                <p style={styles.subtitle}>Manage your account and app preferences</p>
            </header>

            <div style={styles.grid}>
                {/* Profile Section */}
                <section style={styles.card}>
                    <h3 style={styles.sectionTitle}>👤 Profile Settings</h3>
                    <div style={styles.field}>
                        <label style={styles.label}>Full Name</label>
                        <input
                            type="text"
                            name="name"
                            value={profile.name}
                            onChange={handleProfileChange}
                            style={styles.input}
                        />
                    </div>
                    <div style={styles.field}>
                        <label style={styles.label}>Email Address</label>
                        <input
                            type="email"
                            name="email"
                            value={profile.email}
                            onChange={handleProfileChange}
                            style={styles.input}
                        />
                    </div>
                </section>

                {/* Appearance Section */}
                <section style={styles.card}>
                    <h3 style={styles.sectionTitle}>🎨 Appearance</h3>
                    <div style={styles.toggleRow}>
                        <div>
                            <p style={styles.toggleLabel}>Theme Mode</p>
                            <p style={styles.toggleSub}>Switch between light and dark themes</p>
                        </div>
                        <button onClick={toggleTheme} style={styles.themeBtn}>
                            {theme === 'dark' ? '☀️ Light' : '🌙 Dark'}
                        </button>
                    </div>
                </section>

                {/* Security Section */}
                <section style={styles.card}>
                    <h3 style={styles.sectionTitle}>🔒 Security</h3>
                    <button onClick={() => setShowModal(true)} style={styles.actionBtn}>Change Password</button>
                    <button
                        onClick={toggle2FA}
                        style={{
                            ...styles.actionBtn,
                            marginTop: '0.5rem',
                            backgroundColor: is2FAEnabled ? 'var(--primary-color)' : 'var(--bg-tertiary)',
                            color: is2FAEnabled ? '#ffffff' : 'var(--text-primary)',
                            borderColor: is2FAEnabled ? 'transparent' : 'var(--glass-border)'
                        }}
                    >
                        {is2FAEnabled ? 'Disable Two-Factor' : 'Enable Two-Factor'}
                    </button>
                </section>
            </div>

            {/* Modal */}
            {showModal && (
                <div style={styles.modalOverlay}>
                    <div style={styles.modalContent}>
                        <h3 style={styles.modalTitle}>Change Password</h3>
                        <form onSubmit={handlePasswordChange}>
                            <div style={styles.field}>
                                <label style={styles.label}>Current Password</label>
                                <input
                                    type="password"
                                    style={styles.input}
                                    value={passwords.current}
                                    onChange={e => setPasswords({ ...passwords, current: e.target.value })}
                                    required
                                />
                            </div>
                            <div style={styles.field}>
                                <label style={styles.label}>New Password</label>
                                <input
                                    type="password"
                                    style={styles.input}
                                    value={passwords.new}
                                    onChange={e => setPasswords({ ...passwords, new: e.target.value })}
                                    required
                                />
                            </div>
                            <div style={styles.field}>
                                <label style={styles.label}>Confirm Password</label>
                                <input
                                    type="password"
                                    style={styles.input}
                                    value={passwords.confirm}
                                    onChange={e => setPasswords({ ...passwords, confirm: e.target.value })}
                                    required
                                />
                            </div>
                            <div style={styles.modalActions}>
                                <button type="button" onClick={() => setShowModal(false)} style={styles.cancelBtn}>Cancel</button>
                                <button type="submit" style={styles.saveBtn}>Update Password</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

const styles = {
    container: {
        padding: '2.5rem',
        backgroundColor: 'var(--bg-primary)',
        minHeight: '100vh',
        color: 'var(--text-primary)',
        transition: 'var(--transition)',
        position: 'relative',
    },
    header: { marginBottom: '3rem' },
    title: {
        fontSize: '2.5rem',
        fontWeight: '900',
        margin: '0 0 0.5rem 0',
        background: 'linear-gradient(135deg, #4f46e5 0%, #c026d3 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
    },
    subtitle: { color: 'var(--text-muted)', fontSize: '1rem' },
    grid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
        gap: '2rem',
        maxWidth: '1200px',
    },
    card: {
        backgroundColor: 'var(--bg-secondary)',
        borderRadius: '24px',
        padding: '2rem',
        border: '1px solid var(--glass-border)',
        boxShadow: 'var(--shadow-lg)',
    },
    sectionTitle: {
        fontSize: '1.25rem',
        fontWeight: '700',
        marginBottom: '1.5rem',
        color: 'var(--text-primary)',
    },
    field: { marginBottom: '1.25rem' },
    label: {
        display: 'block',
        fontSize: '0.85rem',
        fontWeight: '600',
        color: 'var(--text-muted)',
        marginBottom: '0.5rem',
    },
    input: {
        width: '100%',
        backgroundColor: 'var(--bg-tertiary)',
        border: '1px solid var(--glass-border)',
        borderRadius: '12px',
        padding: '0.75rem 1rem',
        color: 'var(--text-primary)',
        fontSize: '0.9rem',
        outline: 'none',
    },
    toggleRow: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    toggleLabel: { fontWeight: '600', margin: 0 },
    toggleSub: { fontSize: '0.8rem', color: 'var(--text-muted)', margin: '0.2rem 0 0 0' },
    themeBtn: {
        padding: '0.6rem 1.25rem',
        borderRadius: '10px',
        border: 'none',
        backgroundColor: 'var(--primary-color)',
        color: '#ffffff',
        fontWeight: '700',
        cursor: 'pointer',
    },
    actionBtn: {
        width: '100%',
        padding: '0.75rem',
        borderRadius: '12px',
        border: '1px solid var(--glass-border)',
        backgroundColor: 'var(--bg-tertiary)',
        color: 'var(--text-primary)',
        fontWeight: '600',
        cursor: 'pointer',
        transition: 'var(--transition)',
    },
    toast: {
        position: 'fixed',
        top: '20px',
        right: '20px',
        padding: '1rem 2rem',
        borderRadius: '12px',
        color: 'white',
        fontWeight: '600',
        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
        zIndex: 2000,
        animation: 'slideIn 0.3s ease-out',
    },
    modalOverlay: {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        backdropFilter: 'blur(5px)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
    },
    modalContent: {
        backgroundColor: 'var(--bg-secondary)',
        padding: '2.5rem',
        borderRadius: '24px',
        width: '90%',
        maxWidth: '400px',
        border: '1px solid var(--glass-border)',
        boxShadow: 'var(--shadow-xl)',
    },
    modalTitle: {
        marginTop: 0,
        color: 'var(--text-primary)',
        marginBottom: '1.5rem',
    },
    modalActions: {
        display: 'flex',
        gap: '1rem',
        marginTop: '2rem',
    },
    cancelBtn: {
        flex: 1,
        padding: '0.75rem',
        borderRadius: '10px',
        border: '1px solid var(--text-muted)',
        backgroundColor: 'transparent',
        color: 'var(--text-secondary)',
        cursor: 'pointer',
    },
    saveBtn: {
        flex: 1,
        padding: '0.75rem',
        borderRadius: '10px',
        border: 'none',
        backgroundColor: 'var(--primary-color)',
        color: 'white',
        fontWeight: '700',
        cursor: 'pointer',
    },
};

export default Settings;
