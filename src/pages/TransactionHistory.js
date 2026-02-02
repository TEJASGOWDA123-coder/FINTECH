import React, { useState } from 'react';
import { getTransactions } from '../services/api';
import '../index.css';
import axios from 'axios';

const TransactionHistory = () => {
    const storedAccount = localStorage.getItem('accountNumber') || '';
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [accountId, setAccountId] = useState(storedAccount);
    const [error, setError] = useState('');
    const [pin , setPin] = useState('')

    // React.useEffect(() => {
    //     if (storedAccount) {
    //         executeFetch(storedAccount);
    //     }
    // }, [storedAccount]);

    // const executeFetch = (id) => {
    //     setLoading(true);
    //     setError('');
    //     getTransactions(id)
    //         .then(data => {
    //             const txns = Array.isArray(data) ? data : [];
    //             setTransactions(txns);
    //             setLoading(false);
    //         })
    //         .catch(err => {
    //             setError('Failed to load transactions.');
    //             setLoading(false);
    //         });
    // };

    // const fetchTransactions = (e) => {
    //     if (e) e.preventDefault();
    //     executeFetch(accountId);
    // };
    // console.log({transactions});
    
   
    const handlecheckhistory=()=>{
        const token = localStorage.getItem('token');
        const data = axios.get(`http://localhost:8080/transactions?UpiPin=${pin}`,{
            headers :{
                'Authorization' : `Bearer ${token}`
            }
        })
        data.then(res=>
            {
                setPin('')
            setError('')
            if(res.data.status === "success"){
                setTransactions(res.data.data);
            }else{
                setError(res.data.message); 
            }
        }
        );
        
        
    }

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <h1 style={styles.header}>Transaction History</h1>
                <p style={styles.subHeader}>Track your financial activity.</p>

                {/* <form onSubmit={fetchTransactions} style={{ ...styles.form, marginBottom: '2rem' }}> */}
                    <div style={styles.inputGroup} >
                        <label style={styles.label}>Account ID to View</label>
                       
                        <input type="text" 
                        value={pin}
                        placeholder="Enter  Pin"
                        onChange={(e)=>setPin(e.target.value)} />
                    </div>
                    <button type="submit" onClick={()=>handlecheckhistory()} style={styles.button}>View History</button>
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
                                    <th style={styles.th}>Status</th>
                                    <th style={styles.thRight}>Amount</th>
                                </tr>
                            </thead>
                            <tbody>
                                {transactions.map((txn) => (
                                    <tr key={txn.id} style={styles.tr}>
                                        <td style={styles.td}>{txn.transactionDate
}</td>
                                        <td style={styles.td}>{txn.transactionType}</td>
                                        <td style={styles.tdCode}>{txn.
transaction_id
}</td>
                                        <td style={styles.td}>
                                            {/* <span style={getStatusStyle(txn.status)}>{txn.status}</span> */}
                                            {txn.transactionType}
                                        </td>
                                        <td style={{ ...styles.tdRight, ...getAmountStyle(txn.transactionType != 'debit') }}>
                                            {txn.transactionType === 'debit' ? '-' : '+'}{txn.amount.toFixed(2)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

const getStatusStyle = (status) => {
    const baseStyle = {
        padding: '0.25rem 0.5rem',
        borderRadius: '6px',
        fontSize: '0.75rem',
        fontWeight: '700',
        textTransform: 'uppercase',
    };

    switch (status) {
        case 'Completed': return { ...baseStyle, backgroundColor: 'rgba(16, 185, 129, 0.1)', color: 'var(--success-color)' };
        case 'Pending': return { ...baseStyle, backgroundColor: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b' };
        case 'Failed': return { ...baseStyle, backgroundColor: 'rgba(244, 63, 94, 0.1)', color: 'var(--danger-color)' };
        default: return baseStyle;
    }
};

const getAmountStyle = (amount) => ({
    color: amount > 0 ? 'var(--success-color)' : 'var(--text-primary)',
    fontWeight: '800',
});

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
};

export default TransactionHistory;
