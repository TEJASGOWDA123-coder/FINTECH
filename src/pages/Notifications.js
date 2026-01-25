import React from 'react';

const Notifications = () => {
    const notifications = [
        { id: 1, type: 'transaction', title: 'Fund Transfer Success', message: 'You successfully sent $1,200.00 to Account 5678.', time: '2 hours ago', icon: '💸' },
        { id: 2, type: 'security', title: 'New Login Detected', message: 'A new login was detected from a Chrome browser on Windows.', time: '5 hours ago', icon: '🛡️' },
        { id: 3, type: 'system', title: 'Theme Update', message: 'The new high-fidelity Dark Mode is now available. Try it in Settings!', time: '1 day ago', icon: '✨' },
        { id: 4, type: 'transaction', title: 'Deposit Received', message: 'A deposit of $500.00 has been credited to your account.', time: '2 days ago', icon: '📥' },
    ];

    return (
        <div style={styles.container}>
            <header style={styles.header}>
                <h1 style={styles.title}>Notifications</h1>
                <p style={styles.subtitle}>Stay updated with your latest account activities</p>
            </header>

            <div style={styles.list}>
                {notifications.map((notif) => (
                    <div key={notif.id} style={styles.notifCard}>
                        <div style={styles.notifIcon}>{notif.icon}</div>
                        <div style={styles.notifText}>
                            <h3 style={styles.notifTitle}>{notif.title}</h3>
                            <p style={styles.notifMessage}>{notif.message}</p>
                            <span style={styles.notifTime}>{notif.time}</span>
                        </div>
                        <div style={styles.notifBadge} />
                    </div>
                ))}
            </div>
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
    },
    header: { marginBottom: '3rem' },
    title: {
        fontSize: '2.5rem',
        fontWeight: '900',
        margin: '0 0 0.5rem 0',
        background: 'linear-gradient(135deg, #4f46e5 0%, #10b981 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
    },
    subtitle: { color: 'var(--text-muted)', fontSize: '1rem' },
    list: {
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        maxWidth: '800px',
    },
    notifCard: {
        display: 'flex',
        alignItems: 'center',
        padding: '1.5rem',
        backgroundColor: 'var(--bg-secondary)',
        borderRadius: '20px',
        border: '1px solid var(--glass-border)',
        boxShadow: 'var(--shadow-lg)',
        transition: 'var(--transition)',
        position: 'relative',
    },
    notifIcon: {
        fontSize: '1.5rem',
        marginRight: '1.5rem',
        backgroundColor: 'var(--bg-tertiary)',
        width: '50px',
        height: '50px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '12px',
    },
    notifText: { flex: 1 },
    notifTitle: { fontSize: '1.1rem', fontWeight: '700', margin: '0 0 0.25rem 0' },
    notifMessage: { fontSize: '0.9rem', color: 'var(--text-secondary)', margin: '0 0 0.5rem 0', lineHeight: '1.4' },
    notifTime: { fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '600' },
    notifBadge: {
        width: '10px',
        height: '10px',
        borderRadius: '50%',
        backgroundColor: 'var(--primary-color)',
        position: 'absolute',
        top: '1.5rem',
        right: '1.5rem',
    },
};

export default Notifications;
