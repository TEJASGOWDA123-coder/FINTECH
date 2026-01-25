import React from 'react';

const Privacy = () => {
    return (
        <div style={styles.container}>
            <header style={styles.header}>
                <h1 style={styles.title}>Privacy Policy</h1>
                <p style={styles.subtitle}>Last updated: January 2026</p>
            </header>

            <div style={styles.content}>
                <section style={styles.section}>
                    <h3 style={styles.sectionTitle}>1. Data Collection</h3>
                    <p style={styles.text}>
                        We collect minimal personal data required to provide our banking services,
                        including your account number and transaction history.
                    </p>
                </section>

                <section style={styles.section}>
                    <h3 style={styles.sectionTitle}>2. Security</h3>
                    <p style={styles.text}>
                        Your data is encrypted and stored securely. We use industry-standard
                        protocols to protect your sensitive financial information.
                    </p>
                </section>

                <section style={styles.section}>
                    <h3 style={styles.sectionTitle}>3. AI Usage</h3>
                    <p style={styles.text}>
                        Our AI Assistant (powered by Gemini) processes your queries to provide
                        financial guidance. It does not store personal financial data locally.
                    </p>
                </section>
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
    header: {
        marginBottom: '3rem',
    },
    title: {
        fontSize: '2.5rem',
        fontWeight: '900',
        margin: '0 0 0.5rem 0',
        background: 'linear-gradient(135deg, #4f46e5 0%, #c026d3 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
    },
    subtitle: {
        color: 'var(--text-muted)',
        fontSize: '1rem',
    },
    content: {
        backgroundColor: 'var(--bg-secondary)',
        borderRadius: '24px',
        padding: '2rem',
        border: '1px solid var(--glass-border)',
        boxShadow: 'var(--shadow-lg)',
        maxWidth: '800px',
    },
    section: {
        marginBottom: '2rem',
    },
    sectionTitle: {
        fontSize: '1.25rem',
        fontWeight: '700',
        marginBottom: '1rem',
        color: 'var(--text-primary)',
    },
    text: {
        lineHeight: '1.6',
        color: 'var(--text-secondary)',
        fontSize: '1rem',
    },
};

export default Privacy;
