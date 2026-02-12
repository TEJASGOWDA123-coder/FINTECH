import React, { useState, useCallback, useEffect } from 'react';

import '../index.css';
import { getTransactions, reverseTransaction } from '../services/api';

const TransactionHistory = () => {

    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(false);

    const [error, setError] = useState('');
    const [accountNumber] = useState(localStorage.getItem('accountNumber') || '');
    const [reversingId, setReversingId] = useState(null);
    const [toast, setToast] = useState({ show: false, message: '', type: '' });

    const showToast = (message, type = 'success') => {
        setToast({ show: true, message, type });
        setTimeout(() => setToast({ show: false, message: '', type: '' }), 4000);
    };

    const fetchTransactions = useCallback(() => {
        setLoading(true);
        getTransactions(accountNumber)
            .then(data => {
                setLoading(false);
                if (Array.isArray(data)) {
                    setTransactions(data);
                } else if (data.status === "success" || data.data) {
                    setTransactions(data.data || data);
                } else {
                    setError(data.message || "Failed to fetch transactions");
                }
            })
            .catch(err => {
                setLoading(false);
                console.error('History fetch failed:', err);
                setError('Failed to load transactions.');
            });
    }, [accountNumber]);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                // Since accountNumber is already loaded from localStorage, we can just fetch
                fetchTransactions();
            } catch (err) {
                console.error("Failed to fetch user data", err);
            }
        };
        fetchUserData();
    }, [fetchTransactions]);

    const handleReverse = async (txnId) => {
        if (!window.confirm(`Are you sure you want to reverse transaction ${txnId}?`)) return;

        setReversingId(txnId);
        try {
            const res = await reverseTransaction(txnId);
            if (res.status === 'success' || res.success) {
                showToast(`Transaction ${txnId} successfully reversed.`);
                fetchTransactions();
            } else {
                showToast(res.message || 'Failed to reverse transaction', 'error');
            }
        } catch (err) {
            console.error('Reversal failed:', err);
            const errorMsg = err.response?.data?.message || err.message || 'Failed to reverse transaction';
            showToast(errorMsg, 'error');
        } finally {
            setReversingId(null);
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <h1 style={styles.header}>Transaction History</h1>
                <p style={styles.subHeader}>Track your financial activity.</p>

                {/* <form onSubmit={fetchTransactions} style={{ ...styles.form, marginBottom: '2rem' }}> */}
                {/* <div style={styles.inputGroup} >
                    <label style={styles.label}>Account ID to View</label>

                    <input type="text"
                        value={pin}
                        placeholder="Enter  Pin"
                        onChange={(e) => setPin(e.target.value)} />
                </div>
                <button type="submit" onClick={() => handlecheckhistory()} style={styles.button}>View History</button> */}
                {/* </form> */}

                {error && <p style={styles.error}>{error}</p>}

                {loading ? (
                    <p style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>Loading transactions...</p>
                ) : (
                    <div style={styles.tableContainer}>
                        <table style={styles.table}>
                            <thead>
                                <tr>
                                    <th style={styles.th}>Date</th>
                                    <th style={styles.th}>Type</th>
                                    <th style={styles.th}>ID</th>
                                    <th style={styles.th}>Account</th>
                                    <th style={styles.th}>Status</th>
                                    <th style={styles.thRight}>Amount</th>
                                    <th style={styles.thRight}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {transactions.map((txn) => {
                                    const isReceiver = String(txn.receiverAccount).trim() === String(accountNumber).trim();
                                    const amount = Math.abs(txn.amount);
                                    let isCredit = isReceiver;

                                    // Explicitly handle types to ensure correct credit/debit logic
                                    if (txn.type === 'DEPOSIT' || txn.type === 'INITIAL_DEPOSIT') isCredit = true;
                                    if (txn.type === 'WITHDRAW') isCredit = false;

                                    // Determine the "other" account
                                    let otherAccount = isReceiver ? txn.senderAccount : txn.receiverAccount;
                                    if (txn.type === 'DEPOSIT') otherAccount = 'Bank Deposit';
                                    if (txn.type === 'INITIAL_DEPOSIT') otherAccount = 'Initial Deposit';
                                    if (txn.type === 'WITHDRAW') otherAccount = 'Bank Withdrawal';

                                    const displayType = isCredit ? 'Credited' : 'Debited';

                                    return (
                                        <tr key={txn.id} style={styles.tr}>
                                            <td style={styles.td}>{new Date(txn.timestamp || txn.date).toLocaleString()}</td>
                                            <td style={styles.td}>{txn.type}</td>
                                            <td style={styles.tdCode}>{txn.id}</td>
                                            <td style={styles.tdCode}>{otherAccount}</td>
                                            <td style={styles.td}>
                                                <span style={{ color: isCredit ? 'var(--success-color)' : 'var(--danger-color)', fontWeight: '600' }}>
                                                    {displayType}
                                                </span>
                                            </td>
                                            <td style={{ ...styles.tdRight, color: isCredit ? 'var(--success-color)' : 'var(--danger-color)' }}>
                                                {isCredit ? '+' : '-'}{amount.toFixed(2)}
                                            </td>
                                            <td style={styles.tdRight}>
                                                <button
                                                    onClick={() => handleReverse(txn.id)}
                                                    disabled={txn.reversed || reversingId === txn.id || txn.type === 'REVERSAL'}
                                                    style={{
                                                        ...styles.reverseBtn,
                                                        opacity: (txn.reversed || reversingId === txn.id || txn.type === 'REVERSAL') ? 0.5 : 1,
                                                        cursor: (txn.reversed || reversingId === txn.id || txn.type === 'REVERSAL') ? 'not-allowed' : 'pointer'
                                                    }}
                                                >
                                                    {reversingId === txn.id ? '...' : (txn.reversed || txn.type === 'REVERSAL' ? 'Reversed' : 'Reverse')}
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {toast.show && (
                <div style={{
                    ...styles.toast,
                    backgroundColor: toast.type === 'error' ? 'var(--danger-color)' : 'var(--success-color)'
                }}>
                    {toast.message}
                </div>
            )}
        </div>
    );
};




const styles = {
    container: {
        maxWidth: '1000px',
        margin: '2rem auto',
    },
    card: {
        backgroundColor: 'var(--bg-secondary)',
        padding: '2.5rem',
        borderRadius: 'var(--radius-xl)',
        border: '1px solid var(--glass-border)',
        boxShadow: 'var(--shadow-lg)',
        transition: 'var(--transition)',
    },
    header: {
        fontSize: '2rem',
        fontWeight: '900',
        marginBottom: '0.75rem',
        color: 'var(--text-primary)',
        letterSpacing: '-0.02em',
    },
    subHeader: {
        color: 'var(--text-muted)',
        marginBottom: '2.5rem',
        fontSize: '1rem',
    },
    form: {
        display: 'flex',
        gap: '1rem',
        alignItems: 'flex-end',
        backgroundColor: 'var(--bg-tertiary)',
        padding: '1.5rem',
        borderRadius: '16px',
        border: '1px solid var(--glass-border)',
    },
    inputGroup: {
        flex: 1,
        display: 'flex',
        flexDirection: 'row',
        gap: '0.5rem',
    },
    label: {
        fontSize: '0.75rem',
        fontWeight: '700',
        color: 'var(--text-muted)',
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
    },
    button: {
        backgroundColor: 'var(--primary-color)',
        color: 'white',
        border: 'none',
        padding: '0.75rem 1.5rem',
        fontSize: '0.9rem',
        fontWeight: '800',
        borderRadius: '10px',
        cursor: 'pointer',
        transition: 'var(--transition)',
        height: '44px',
    },
    tableContainer: {
        marginTop: '2rem',
        borderRadius: '16px',
        overflow: 'hidden',
        border: '1px solid var(--glass-border)',
    },
    table: {
        width: '100%',
        borderCollapse: 'collapse',
        backgroundColor: 'var(--bg-secondary)',
    },
    th: {
        textAlign: 'left',
        padding: '1rem 1.5rem',
        color: 'var(--text-muted)',
        backgroundColor: 'var(--bg-tertiary)',
        fontSize: '0.75rem',
        fontWeight: '700',
        textTransform: 'uppercase',
        borderBottom: '1px solid var(--glass-border)',
    },
    thRight: {
        textAlign: 'right',
        padding: '1rem 1.5rem',
        color: 'var(--text-muted)',
        backgroundColor: 'var(--bg-tertiary)',
        fontSize: '0.75rem',
        fontWeight: '700',
        textTransform: 'uppercase',
        borderBottom: '1px solid var(--glass-border)',
    },
    tr: {
        borderBottom: '1px solid var(--glass-border)',
        transition: 'var(--transition)',
    },
    td: {
        padding: '1.25rem 1.5rem',
        color: 'var(--text-secondary)',
        fontSize: '0.9rem',
    },
    tdCode: {
        padding: '1.25rem 1.5rem',
        color: 'var(--text-muted)',
        fontFamily: 'monospace',
        fontSize: '0.8rem',
    },
    tdRight: {
        padding: '1.25rem 1.5rem',
        textAlign: 'right',
        fontSize: '0.95rem',
        fontWeight: '800',
        color: 'var(--text-primary)',
    },
    error: {
        color: 'var(--danger-color)',
        textAlign: 'center',
        padding: '1rem',
        backgroundColor: 'rgba(244, 63, 94, 0.1)',
        borderRadius: '12px',
        margin: '1.5rem 0',
        border: '1px solid var(--danger-color)',
    },
    reverseBtn: {
        backgroundColor: 'transparent',
        color: 'var(--danger-color)',
        border: '1px solid var(--danger-color)',
        padding: '0.4rem 0.8rem',
        borderRadius: '8px',
        fontSize: '0.75rem',
        fontWeight: '700',
        transition: 'var(--transition)',
    },
    toast: {
        position: 'fixed',
        bottom: '30px',
        right: '30px',
        padding: '1rem 2rem',
        borderRadius: '12px',
        color: 'white',
        fontWeight: '700',
        boxShadow: 'var(--shadow-lg)',
        zIndex: 9999,
        animation: 'slideIn 0.3s ease-out',
    }
};

export default TransactionHistory;
