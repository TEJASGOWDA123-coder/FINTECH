import React, { useEffect, useState } from 'react';
import { getAuditLogs } from '../services/api';

const AuditLogs = () => {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchLogs = async () => {
            try {
                const data = await getAuditLogs();
                setLogs(Array.isArray(data) ? data : (data.data || []));
                setLoading(false);
            } catch (err) {
                setError('Failed to fetch audit logs.');
                setLoading(false);
            }
        };
        fetchLogs();
    }, []);

    if (loading) return <div style={styles.loading}>Loading Audit Logs...</div>;
    if (error) return <div style={styles.error}>{error}</div>;

    return (
        <div style={styles.container}>
            <header style={styles.header}>
                <h1 style={styles.title}>Admin Audit Logs</h1>
                <p style={styles.subtitle}>Track vital system operations and API executions</p>
            </header>

            <div style={styles.tableCard}>
                <div style={styles.tableWrapper}>
                    <table style={styles.table}>
                        <thead>
                            <tr>
                                <th style={styles.th}>Timestamp</th>
                                <th style={styles.th}>Method</th>
                                <th style={styles.th}>Parameters</th>
                                <th style={styles.thRight}>Exec Time (ms)</th>
                            </tr>
                        </thead>
                        <tbody>
                            {logs.length > 0 ? logs.map((log, idx) => (
                                <tr key={idx} style={styles.tr}>
                                    <td style={styles.td}>{new Date(log.timestamp).toLocaleString()}</td>
                                    <td style={styles.tdCode}>{log.methodName}</td>
                                    <td style={styles.tdCode}>{JSON.stringify(log.parameters)}</td>
                                    <td style={styles.tdRight}>{log.executionTime}</td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="4" style={styles.empty}>No logs available</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

const styles = {
    container: {
        padding: '2rem',
        maxWidth: '1200px',
        margin: '0 auto',
    },
    header: {
        marginBottom: '2rem',
    },
    title: {
        fontSize: '2rem',
        fontWeight: '900',
        color: 'var(--text-primary)',
        marginBottom: '0.5rem',
    },
    subtitle: {
        color: 'var(--text-muted)',
        fontSize: '1rem',
    },
    tableCard: {
        backgroundColor: 'var(--bg-secondary)',
        borderRadius: '24px',
        padding: '1.5rem',
        border: '1px solid var(--glass-border)',
        boxShadow: 'var(--shadow-lg)',
        overflow: 'hidden',
    },
    tableWrapper: {
        overflowX: 'auto',
    },
    table: {
        width: '100%',
        borderCollapse: 'collapse',
    },
    th: {
        textAlign: 'left',
        padding: '1rem',
        color: 'var(--text-muted)',
        fontSize: '0.75rem',
        fontWeight: '700',
        textTransform: 'uppercase',
        borderBottom: '1px solid var(--glass-border)',
    },
    thRight: {
        textAlign: 'right',
        padding: '1rem',
        color: 'var(--text-muted)',
        fontSize: '0.75rem',
        fontWeight: '700',
        textTransform: 'uppercase',
        borderBottom: '1px solid var(--glass-border)',
    },
    tr: {
        borderBottom: '1px solid var(--glass-border)',
        transition: 'background 0.2s',
        '&:hover': {
            backgroundColor: 'rgba(255,255,255,0.02)',
        }
    },
    td: {
        padding: '1rem',
        color: 'var(--text-secondary)',
        fontSize: '0.9rem',
    },
    tdCode: {
        padding: '1rem',
        color: 'var(--primary-color)',
        fontSize: '0.8rem',
        fontFamily: 'monospace',
    },
    tdRight: {
        padding: '1rem',
        textAlign: 'right',
        color: 'var(--text-primary)',
        fontWeight: '600',
    },
    loading: {
        padding: '4rem',
        textAlign: 'center',
        color: 'var(--text-muted)',
    },
    error: {
        padding: '1rem',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        color: '#f87171',
        borderRadius: '12px',
        margin: '2rem',
        textAlign: 'center',
    },
    empty: {
        padding: '3rem',
        textAlign: 'center',
        color: 'var(--text-muted)',
    }
};

export default AuditLogs;
