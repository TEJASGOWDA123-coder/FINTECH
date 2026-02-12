import React, { useState, useEffect } from 'react';
import { downloadStatement, getTransactions } from '../services/api';

const Statements = () => {
    const [loading, setLoading] = useState(false);
    const [statements, setStatements] = useState([]);
    const [selectedMonth, setSelectedMonth] = useState(null);
    const [filteredTransactions, setFilteredTransactions] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        // Generate a list of last 12 months
        const generateMonths = () => {
            const months = [];
            const now = new Date();
            const currentYear = now.getFullYear();

            // Generate months for the current year only
            for (let i = 0; i <= now.getMonth(); i++) {
                const date = new Date(currentYear, now.getMonth() - i, 1);
                const monthName = date.toLocaleString('default', { month: 'long' });
                const year = date.getFullYear();

                // Use local date parts instead of toISOString() to avoid timezone shift
                const formatDate = (d) => {
                    const year = d.getFullYear();
                    const month = String(d.getMonth() + 1).padStart(2, '0');
                    const day = String(d.getDate()).padStart(2, '0');
                    return `${year}-${month}-${day}`;
                };

                const startDate = formatDate(new Date(year, date.getMonth(), 1));
                const endDate = formatDate(new Date(year, date.getMonth() + 1, 0));

                months.push({
                    name: `${monthName} ${year}`,
                    startDate,
                    endDate,
                    month: monthName,
                    year
                });
            }
            setStatements(months);
        };

        generateMonths();
    }, []);

    const handleDownload = async (e, startDate, endDate) => {
        e.stopPropagation(); // Prevent card click
        setLoading(true);
        try {
            await downloadStatement(startDate, endDate);
        } catch (err) {
            alert('Failed to download statement.');
        } finally {
            setLoading(false);
        }
    };

    const handleViewMonth = async (stmt) => {
        setLoading(true);
        setSelectedMonth(stmt);
        setError('');
        try {
            const accountNumber = localStorage.getItem('accountNumber');
            const data = await getTransactions(accountNumber);
            const allTxns = Array.isArray(data) ? data : (data.data || []);

            // Filter transactions by the selected month's range
            const filtered = allTxns.filter(tx => {
                const txDate = (tx.timestamp || tx.date).split('T')[0];
                return txDate >= stmt.startDate && txDate <= stmt.endDate;
            });

            setFilteredTransactions(filtered);
        } catch (err) {
            console.error('Failed to fetch transactions:', err);
            setError('Failed to load transactions for this month.');
        } finally {
            setLoading(false);
        }
    };

    if (selectedMonth) {
        return (
            <div style={styles.container}>
                <header style={styles.header}>
                    <button onClick={() => setSelectedMonth(null)} style={styles.backBtn}>
                        ← Back to Statements
                    </button>
                    <h1 style={styles.title}>{selectedMonth.name} Statement</h1>
                    <p style={styles.subtitle}>Transactions from {selectedMonth.startDate} to {selectedMonth.endDate}</p>
                </header>

                <div style={styles.tableCard}>
                    {loading ? (
                        <p style={styles.infoText}>Loading transactions...</p>
                    ) : error ? (
                        <p style={styles.errorText}>{error}</p>
                    ) : filteredTransactions.length > 0 ? (
                        <div style={styles.tableWrapper}>
                            <table style={styles.table}>
                                <thead>
                                    <tr>
                                        <th style={styles.th}>Date</th>
                                        <th style={styles.th}>Type</th>
                                        <th style={styles.th}>Description</th>
                                        <th style={styles.thRight}>Amount</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredTransactions.map((tx, i) => {
                                        const accountNumber = localStorage.getItem('accountNumber');
                                        const isReceiver = String(tx.receiverAccount || '').trim() === String(accountNumber || '').trim();
                                        const isCredit = isReceiver || tx.type === 'DEPOSIT' || tx.type === 'INITIAL_DEPOSIT';

                                        let otherAccount = isReceiver ? tx.senderAccount : tx.receiverAccount;
                                        if (tx.type === 'DEPOSIT') otherAccount = 'Bank Deposit';
                                        if (tx.type === 'INITIAL_DEPOSIT') otherAccount = 'Initial Deposit';
                                        if (tx.type === 'WITHDRAW') otherAccount = 'Bank Withdrawal';

                                        return (
                                            <tr key={i} style={styles.tr}>
                                                <td style={styles.td}>{new Date(tx.timestamp || tx.date).toLocaleDateString()}</td>
                                                <td style={styles.td}>{tx.type}</td>
                                                <td style={styles.td}>{tx.description || otherAccount || '-'}</td>
                                                <td style={{ ...styles.tdRight, color: isCredit ? 'var(--success-color)' : 'var(--danger-color)' }}>
                                                    {isCredit ? '+' : '-'}{Math.abs(tx.amount).toFixed(2)}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <p style={styles.infoText}>No transactions found for this month.</p>
                    )}
                </div>
            </div>
        );
    }

    return (
        <div style={styles.container}>
            <header style={styles.header}>
                <h1 style={styles.title}>Monthly Statements</h1>
                <p style={styles.subtitle}>View and download your account statements</p>
            </header>

            <div style={styles.grid}>
                {statements.map((stmt, index) => (
                    <div key={index} style={styles.card} onClick={() => handleViewMonth(stmt)}>
                        <div style={styles.cardInfo}>
                            <div style={styles.iconContainer}>
                                <span style={styles.icon}>📄</span>
                            </div>
                            <div>
                                <h3 style={styles.monthName}>{stmt.name}</h3>
                                <p style={styles.dateRange}>{stmt.startDate} to {stmt.endDate}</p>
                            </div>
                        </div>
                        <div style={styles.cardActions}>
                            <button
                                style={styles.viewBtn}
                                onClick={() => handleViewMonth(stmt)}
                            >
                                View
                            </button>
                            <button
                                style={styles.downloadBtn}
                                onClick={(e) => handleDownload(e, stmt.startDate, stmt.endDate)}
                                disabled={loading}
                            >
                                {loading ? '...' : 'Download PDF'}
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const styles = {
    container: {
        padding: '2rem',
        backgroundColor: 'var(--bg-primary)',
        minHeight: '100vh',
    },
    header: {
        marginBottom: '2.5rem',
    },
    title: {
        fontSize: '2rem',
        fontWeight: '900',
        color: 'var(--text-primary)',
        margin: '0 0 0.5rem 0',
    },
    subtitle: {
        color: 'var(--text-muted)',
        fontSize: '1rem',
        margin: 0,
    },
    backBtn: {
        background: 'none',
        border: 'none',
        color: 'var(--primary-color)',
        fontSize: '1rem',
        fontWeight: '700',
        cursor: 'pointer',
        marginBottom: '1rem',
        padding: 0,
        display: 'flex',
        alignItems: 'center',
    },
    grid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
        gap: '1.5rem',
    },
    card: {
        backgroundColor: 'var(--bg-secondary)',
        borderRadius: '16px',
        padding: '1.5rem',
        border: '1px solid var(--glass-border)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
        boxShadow: 'var(--shadow-md)',
        cursor: 'pointer',
    },
    cardInfo: {
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
        marginBottom: '1.5rem',
    },
    iconContainer: {
        width: '48px',
        height: '48px',
        borderRadius: '12px',
        backgroundColor: 'var(--bg-tertiary)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '1.5rem',
    },
    monthName: {
        fontSize: '1.1rem',
        fontWeight: '700',
        color: 'var(--text-primary)',
        margin: '0 0 0.25rem 0',
    },
    dateRange: {
        fontSize: '0.85rem',
        color: 'var(--text-muted)',
        margin: 0,
    },
    cardActions: {
        display: 'flex',
        gap: '0.75rem',
    },
    viewBtn: {
        flex: 1,
        padding: '0.75rem',
        borderRadius: '10px',
        border: '1px solid var(--primary-color)',
        backgroundColor: 'transparent',
        color: 'var(--primary-color)',
        fontSize: '0.9rem',
        fontWeight: '700',
        cursor: 'pointer',
        transition: 'all 0.2s',
    },
    downloadBtn: {
        flex: 2,
        padding: '0.75rem',
        borderRadius: '10px',
        border: 'none',
        backgroundColor: 'var(--primary-color)',
        color: '#ffffff',
        fontSize: '0.9rem',
        fontWeight: '700',
        cursor: 'pointer',
        transition: 'opacity 0.2s',
    },
    tableCard: {
        backgroundColor: 'var(--bg-secondary)',
        borderRadius: '24px',
        padding: '2rem',
        border: '1px solid var(--glass-border)',
        boxShadow: 'var(--shadow-lg)',
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
        fontSize: '0.8rem',
        fontWeight: '700',
        textTransform: 'uppercase',
        borderBottom: '1px solid var(--glass-border)',
    },
    thRight: {
        textAlign: 'right',
        padding: '1rem',
        color: 'var(--text-muted)',
        fontSize: '0.8rem',
        fontWeight: '700',
        textTransform: 'uppercase',
        borderBottom: '1px solid var(--glass-border)',
    },
    tr: {
        borderBottom: '1px solid var(--glass-border)',
        transition: 'background-color 0.2s',
    },
    td: {
        padding: '1.25rem 1rem',
        color: 'var(--text-secondary)',
        fontSize: '0.95rem',
    },
    tdRight: {
        padding: '1.25rem 1rem',
        textAlign: 'right',
        fontSize: '1rem',
        fontWeight: '700',
    },
    infoText: {
        textAlign: 'center',
        padding: '3rem',
        color: 'var(--text-muted)',
    },
    errorText: {
        textAlign: 'center',
        padding: '2rem',
        color: 'var(--danger-color)',
    }
};

export default Statements;
