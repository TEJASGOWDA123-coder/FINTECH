import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../index.css';
import axios from 'axios';
import { downloadStatement, getTransactions } from '../services/api';

const Dashboard = () => {
    // const [account, setAccount] = useState(localStorage.getItem('accountNumber') || 'N/A');


    const [AccountDetails, setAccountDetails] = useState({});

    const [showCardNumber, setShowCardNumber] = useState(false);
    const [transactions, setTransactions] = useState([]);
    const [filteredTransactions, setFilteredTransactions] = useState([]);
    const [stats, setStats] = useState({ income: 0, expends: 0 });
    const [monthlyStats, setMonthlyStats] = useState({});
    const [loading, setLoading] = useState(false);
    const [timeFilter, setTimeFilter] = useState('12m'); // '7d', '30d', '12m'
    const [searchTerm, setSearchTerm] = useState('');

    // useEffect(() => {
    //     const handleStorage = () => {
    //         const newAcc = localStorage.getItem('accountNumber') || 'N/A';
    //         setAccount(newAcc);
    //     };
    //     window.addEventListener('storage', handleStorage);
    //     return () => window.removeEventListener('storage', handleStorage);
    // }, []);

    const getloginuser = async () => {
        try {
            // /loggedin_user
            const data = await axios.get(`/loggedin_user`, {
                withCredentials: true
            });

            if (data.data.status === 'success') {
                console.log('Logged in user data:', data.data.data);
                setAccountDetails(data.data.data);
                // Sync localStorage to keep Sidebar and other components updated
                if (data.data.data.accountNumber) {
                    localStorage.setItem('accountNumber', data.data.data.accountNumber);
                    window.dispatchEvent(new Event('storage'));
                }
            }
        } catch (error) {
            console.error("Failed to check login status:", error);
        }
    }
    const fetchDashboardData = (accNum) => {
        if (!accNum) return;
        setLoading(true);
        getTransactions(accNum)
            .then(data => {
                const txns = Array.isArray(data) ? data : [];
                setTransactions(txns);
                setLoading(false);
            })
            .catch(err => {
                console.error('Error fetching dashboard data:', err);
                setLoading(false);
            });
    };

    useEffect(() => {
        getloginuser();
    }, []);

    useEffect(() => {
        if (AccountDetails.accountNumber) {
            fetchDashboardData(AccountDetails.accountNumber);
        }
    }, [AccountDetails.accountNumber]);

    useEffect(() => {
        const calculateStats = () => {
            const now = new Date();
            const currentAcc = String(AccountDetails.accountNumber || '').trim();

            const filtered = transactions.filter(tx => {
                const txDate = new Date(tx.timestamp || tx.date);
                let matchesTime = true;

                if (!isNaN(txDate.getTime())) {
                    const diffTime = Math.abs(now - txDate);
                    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

                    if (timeFilter === '7d' && diffDays > 7) matchesTime = false;
                    if (timeFilter === '30d' && diffDays > 30) matchesTime = false;
                    if (timeFilter === '12m' && diffDays > 365) matchesTime = false;
                }

                const term = searchTerm.toLowerCase();
                const matchesSearch = !term ||
                    String(tx.type || '').toLowerCase().includes(term) ||
                    String(tx.receiverAccount || '').includes(term) ||
                    String(tx.senderAccount || '').includes(term) ||
                    String(tx.amount || '').includes(term) ||
                    String(tx.id || '').toLowerCase().includes(term);

                return matchesTime && matchesSearch;
            });

            setFilteredTransactions(filtered);

            let incomeSum = 0;
            let expendsSum = 0;
            const monthlyData = {};

            filtered.forEach(tx => {
                const amount = Math.abs(tx.amount || 0);
                const isReceiver = String(tx.receiverAccount || '').trim() === currentAcc;
                const isSender = String(tx.senderAccount || '').trim() === currentAcc;
                const txDate = new Date(tx.timestamp || tx.date);
                const month = txDate.toLocaleString('default', { month: 'short' });

                if (!monthlyData[month]) {
                    monthlyData[month] = { income: 0, expends: 0 };
                }

                if (isReceiver) {
                    incomeSum += amount;
                    monthlyData[month].income += amount;
                } else if (isSender) {
                    expendsSum += amount;
                    monthlyData[month].expends += amount;
                }
            });

            console.log('Dashboard Stats Updated:', { incomeSum, expendsSum, monthlyData, currentAcc });
            setStats({ income: incomeSum, expends: expendsSum });
            setMonthlyStats(monthlyData);
        };

        calculateStats();
    }, [transactions, timeFilter, searchTerm, AccountDetails.accountNumber]);

    // const fetchDashboardData = (accId) => {
    //     setLoading(true);
    //     getTransactions(accId)
    //         .then(data => {
    //             if (typeof data === 'string' && data.trim().startsWith('<')) {
    //                 throw new Error('Authentication failed (HTML response)');
    //             }
    //             const txns = Array.isArray(data) ? data : [];
    //             setTransactions(txns);
    //             setLoading(false);
    //         })
    //         .catch(err => {
    //             console.error('Error fetching dashboard data:', err);
    //             setLoading(false);
    //         });
    // };
    const formatCardNumber = (accNum, show) => {
        if (!accNum) return '••••  ••••  ••••  ••••';
        const str = accNum.toString().padStart(10, '0');
        const cardNum = '541275' + str;
        if (show) {
            return cardNum.replace(/\d{4}(?=.)/g, '$& ');
        }
        return `••••  ••••  ••••  ${cardNum.slice(-4)}`;
    };

    return (
        <div style={styles.container}>
            {/* Top Bar */}
            <header style={styles.topBar}>
                <div style={styles.searchContainer}>
                    <span style={styles.searchIcon}>🔍</span>
                    <input
                        type="text"
                        placeholder="Search transactions..."
                        style={styles.searchInput}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div style={styles.userActions}>
                    <Link to="/notifications" style={styles.notifIcon}>🔔</Link>
                    <Link to="/settings" style={styles.settingsIcon}>⚙️</Link>
                    <Link to="/profile" style={styles.profilePic}>
                        <div style={styles.pPicInner} />
                    </Link>
                </div>
            </header>

            <div style={styles.mainHeader}>
                <div>
                    <h1 style={styles.title}>Banking Dashboard</h1>
                    {/* <p style={styles.subtitle}>Welcome Back, Account: {account}</p> */}
                    <p style={styles.subtitle}>Welcome Back: {AccountDetails.username || 'User'}</p>
                    <p style={styles.subtitle}>Account: {AccountDetails.accountNumber}</p>
                </div>

                <div style={styles.filterTime}>
                    <button
                        onClick={async () => {
                            try {
                                await downloadStatement();
                                alert('Statement download started.');
                            } catch (err) {
                                alert('Failed to download statement.');
                            }
                        }}
                        style={styles.timeBtn}
                    >
                        📄 Download Statement
                    </button>
                    <button
                        onClick={() => setTimeFilter('12m')}
                        style={timeFilter === '12m' ? styles.timeBtnActive : styles.timeBtn}
                    >
                        12 Months
                    </button>
                    <button
                        onClick={() => setTimeFilter('30d')}
                        style={timeFilter === '30d' ? styles.timeBtnActive : styles.timeBtn}
                    >
                        30 days
                    </button>
                    <button
                        onClick={() => setTimeFilter('7d')}
                        style={timeFilter === '7d' ? styles.timeBtnActive : styles.timeBtn}
                    >
                        7 days
                    </button>
                    <button style={styles.filterBtn}>🛠️ Filters</button>
                </div>
            </div>

            {/* Top Grid */}
            <div style={styles.topGrid}>
                {/* Credit Card */}
                <div style={styles.cardContainer}>
                    <p style={styles.sectionLabel}>Primary Account</p>
                    <div style={styles.glassCard}>
                        <div style={styles.cardGlow} />
                        <div style={styles.cardHeader}>
                            <div style={styles.cardCircles}>
                                <div style={{ ...styles.cardCircle, backgroundColor: '#f43f5e' }} />
                                <div style={{ ...styles.cardCircle, backgroundColor: '#fbbf24', marginLeft: '-8px' }} />
                            </div>
                            <span style={styles.nfcIcon}>Primary Card</span>
                            <span style={styles.nfcIcon}>📶</span>
                        </div>

                        {/* Modified Card Number Section */}
                        <div style={{ ...styles.cardNumber, display: 'flex', alignItems: 'center', gap: '15px' }}>
                            <span style={{ minWidth: '260px', letterSpacing: showCardNumber ? '0.15em' : '0.1em' }}>
                                {formatCardNumber(AccountDetails.accountNumber, showCardNumber)}
                            </span>
                            <button
                                onClick={() => setShowCardNumber(!showCardNumber)}
                                style={{
                                    background: 'none',
                                    border: 'none',
                                    cursor: 'pointer',
                                    padding: '5px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    opacity: 0.7,
                                    transition: 'opacity 0.2s',
                                    color: 'white'
                                }}
                                // onMouseEnter={(e) => e.currentTarget.style.opacity = 1}
                                // onMouseLeave={(e) => e.currentTarget.style.opacity = 0.7}
                                title={showCardNumber ? "Hide card number" : "Show card number"}
                            >
                                {showCardNumber ? (
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                                        <line x1="1" y1="1" x2="23" y2="23"></line>
                                    </svg>
                                ) : (
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                                        <circle cx="12" cy="12" r="3"></circle>
                                    </svg>
                                )}
                            </button>
                        </div>

                        <div style={styles.cardFooter}>
                            <div>
                                <p style={styles.cardLabel}>Card Holder</p>
                                <p style={styles.cardValue}>{AccountDetails.username} </p>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                                <p style={styles.cardLabel}>Expires</p>
                                <p style={styles.cardValue}>06/28</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Income Analytics */}
                <div style={styles.statCard}>
                    <p style={styles.sectionLabel}>Total Income</p>
                    <p style={styles.statMonth}>{new Date().toLocaleString('default', { month: 'long', year: 'numeric' })}</p>
                    <h2 style={styles.statValue}>${stats.income.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h2>
                    <div style={styles.sparkline}>
                        <svg width="100%" height="40" viewBox="0 0 100 40">
                            <path d="M0 35 Q 25 20, 50 30 T 100 10" fill="none" stroke="#10b981" strokeWidth="2" />
                            <circle cx="50" cy="30" r="3" fill="#10b981" />
                        </svg>
                    </div>
                    <span style={styles.statGrowth}>📈 Real-time data</span>
                </div>

                {/* Expends Analytics */}
                <div style={styles.statCard}>
                    <p style={styles.sectionLabel}>Total Expends</p>
                    <p style={styles.statMonth}>{new Date().toLocaleString('default', { month: 'long', year: 'numeric' })}</p>
                    <h2 style={styles.statValue}>${stats.expends.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h2>
                    <div style={styles.sparkline}>
                        <svg width="100%" height="40" viewBox="0 0 100 40">
                            <path d="M0 10 Q 25 30, 50 20 T 100 35" fill="none" stroke="#f43f5e" strokeWidth="2" />
                            <circle cx="90" cy="33" r="3" fill="#f43f5e" />
                        </svg>
                    </div>
                    <span style={{ ...styles.statGrowth, color: '#f43f5e' }}>📉 Real-time data</span>
                </div>
            </div>

            {/* Bottom Grid */}
            <div style={styles.bottomGrid}>
                {/* Money Flow Chart */}
                <div style={styles.chartSection}>
                    <p style={styles.sectionLabel}>Money Flow</p>
                    <div style={styles.barChartContainer}>
                        {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map(month => {
                            const data = monthlyStats[month] || { income: 0, expends: 0 };
                            // Calculate height relative to a max value for better scaling
                            const maxVal = Math.max(...Object.values(monthlyStats).map(s => s.income + s.expends), 100);
                            const incomeHeight = (data.income / maxVal) * 80; // 80% max height
                            const expendsHeight = (data.expends / maxVal) * 80;

                            return (
                                <div key={month} style={styles.barGroup}>
                                    <div style={styles.barStack}>
                                        <div style={{ ...styles.barSegment, height: `${incomeHeight}%`, backgroundColor: '#818cf8', display: data.income > 0 ? 'block' : 'none' }} />
                                        <div style={{ ...styles.barSegment, height: `${expendsHeight}%`, backgroundColor: '#4f46e5', display: data.expends > 0 ? 'block' : 'none' }} />
                                    </div>
                                    <span style={styles.barLabel}>{month}</span>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Recent Transactions */}
                <div style={styles.transactionsSection}>
                    <p style={styles.sectionLabel}>Recent Transactions</p>
                    <div style={styles.transactionsList}>
                        {loading ? (
                            <p style={{ color: 'var(--text-muted)', textAlign: 'center' }}>Loading...</p>
                        ) : filteredTransactions.length > 0 ? (
                            filteredTransactions.slice(0, 5).map((tx, i) => {
                                const currentAcc = String(AccountDetails.accountNumber || '').trim();
                                const isReceiver = String(tx.receiverAccount || '').trim() === currentAcc;
                                const amount = Math.abs(tx.amount || 0);
                                return (
                                    <div key={i} style={styles.txItem}>
                                        <div style={styles.txIcon}>
                                            <div style={{ ...styles.cardCircle, backgroundColor: isReceiver ? '#10b981' : '#f43f5e' }} />
                                        </div>
                                        <div style={styles.txInfo}>
                                            <p style={styles.txType}>{tx.type}</p>
                                            <p style={styles.txDate}>{new Date(tx.timestamp || tx.date).toLocaleDateString()}</p>
                                        </div>
                                        <p style={{ ...styles.txAmount, color: isReceiver ? '#10b981' : '#f43f5e' }}>
                                            {isReceiver ? '+' : '-'}{amount.toFixed(2)}
                                        </p>
                                    </div>
                                );
                            })
                        ) : (
                            <p style={{ color: 'var(--text-muted)', textAlign: 'center' }}>No recent activity</p>
                        )}
                    </div>
                </div>
            </div>
        </div >
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
    searchContainer: {
        display: 'flex',
        alignItems: 'center',
        backgroundColor: 'var(--bg-secondary)',
        padding: '0.6rem 1.2rem',
        borderRadius: '12px',
        width: '400px',
        border: '1px solid var(--glass-border)',
        boxShadow: 'var(--shadow-lg)',
    },
    searchIcon: {
        fontSize: '0.9rem',
        marginRight: '0.75rem',
        color: 'var(--text-muted)',
    },
    searchInput: {
        backgroundColor: 'transparent',
        border: 'none',
        color: 'var(--text-primary)',
        fontSize: '0.9rem',
        width: '100%',
        outline: 'none',
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
    mainHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        marginBottom: '2.5rem',
    },
    title: {
        fontSize: '2rem',
        fontWeight: '900',
        margin: '0 0 0.5rem 0',
        color: 'var(--text-primary)',
    },
    subtitle: {
        color: 'var(--text-muted)',
        margin: 0,
        fontSize: '1rem',
    },
    filterTime: {
        display: 'flex',
        gap: '0.5rem',
        backgroundColor: 'var(--bg-secondary)',
        padding: '0.4rem',
        borderRadius: '12px',
        border: '1px solid var(--glass-border)',
    },
    timeBtn: {
        padding: '0.5rem 1rem',
        borderRadius: '8px',
        border: 'none',
        backgroundColor: 'transparent',
        color: 'var(--text-muted)',
        fontSize: '0.85rem',
        fontWeight: '600',
        cursor: 'pointer',
    },
    timeBtnActive: {
        padding: '0.5rem 1.2rem',
        borderRadius: '8px',
        border: 'none',
        backgroundColor: 'var(--primary-color)',
        color: '#ffffff',
        fontSize: '0.85rem',
        fontWeight: '700',
        cursor: 'pointer',
    },
    filterBtn: {
        marginLeft: '1rem',
        padding: '0.5rem 1.25rem',
        borderRadius: '8px',
        backgroundColor: 'var(--bg-tertiary)',
        color: 'var(--text-primary)',
        fontSize: '0.85rem',
        fontWeight: '600',
        cursor: 'pointer',
        border: '1px solid var(--glass-border)',
    },
    sectionLabel: {
        fontSize: '0.9rem',
        fontWeight: '800',
        color: 'var(--text-primary)',
        marginBottom: '1.25rem',
    },
    topGrid: {
        display: 'grid',
        gridTemplateColumns: 'minmax(400px, 1.2fr) 1fr 1fr',
        gap: '2.5rem',
        marginBottom: '2.5rem',
    },
    glassCard: {
        height: '220px',
        background: 'var(--accent-gradient)',
        borderRadius: '24px',
        padding: '2rem',
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        boxShadow: '0 20px 40px -12px rgba(79, 70, 229, 0.4)',
    },
    cardGlow: {
        position: 'absolute',
        top: '-50px',
        right: '-50px',
        width: '200px',
        height: '200px',
        background: 'radial-gradient(circle, rgba(255,255,255,0.2) 0%, transparent 70%)',
    },
    cardHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    cardCircles: { display: 'flex' },
    cardCircle: { width: '32px', height: '32px', borderRadius: '50%', opacity: 0.9 },
    nfcIcon: { fontSize: '1.5rem', color: '#ffffff', opacity: 0.6 },
    cardNumber: {
        fontSize: '1.5rem',
        fontWeight: '700',
        letterSpacing: '0.15em',
        color: '#ffffff',
        fontFamily: 'monospace',
    },
    cardFooter: {
        display: 'flex',
        justifyContent: 'space-between',
    },
    cardLabel: { fontSize: '0.7rem', color: 'rgba(255,255,255,0.6)', margin: '0 0 0.25rem 0' },
    cardValue: { fontSize: '0.9rem', fontWeight: '700', color: '#ffffff', margin: 0 },
    statCard: {
        backgroundColor: 'var(--bg-secondary)',
        borderRadius: '24px',
        padding: '2rem',
        border: '1px solid var(--glass-border)',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: 'var(--shadow-lg)',
    },
    statMonth: { fontSize: '0.75rem', color: 'var(--text-muted)', margin: '-1rem 0 1.25rem 0' },
    statValue: { fontSize: '2.2rem', fontWeight: '900', margin: '0 0 1rem 0', color: 'var(--text-primary)' },
    sparkline: { margin: 'auto 0 1rem 0' },
    statGrowth: { fontSize: '0.8rem', color: 'var(--success-color)', fontWeight: '700' },
    bottomGrid: {
        display: 'grid',
        gridTemplateColumns: '2fr 1fr',
        gap: '2.5rem',
    },
    chartSection: {
        backgroundColor: 'var(--bg-secondary)',
        borderRadius: '24px',
        padding: '2rem',
        border: '1px solid var(--glass-border)',
        boxShadow: 'var(--shadow-lg)',
    },
    barChartContainer: {
        display: 'flex',
        justifyContent: 'flex-start',
        alignItems: 'flex-end',
        height: '300px',
        paddingTop: '2rem',
        overflowX: 'auto',
        gap: '1rem',
        paddingBottom: '0.75rem',
        scrollBehavior: 'smooth',
    },
    barGroup: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '1rem',
        flex: 1,
        minWidth: '35px',
    },
    barStack: {
        width: '12px',
        height: '100%',
        backgroundColor: 'var(--bg-tertiary)',
        borderRadius: '6px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        overflow: 'hidden',
    },
    barSegment: { width: '100%', borderRadius: '6px' },
    barLabel: { fontSize: '0.75rem', color: 'var(--text-muted)' },
    transactionsSection: {
        backgroundColor: 'var(--bg-secondary)',
        borderRadius: '24px',
        padding: '2rem',
        border: '1px solid var(--glass-border)',
        boxShadow: 'var(--shadow-lg)',
    },
    transactionsList: {
        display: 'flex',
        flexDirection: 'column',
        gap: '1.5rem',
    },
    txItem: {
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
    },
    txIcon: { width: '32px', height: '32px' },
    txInfo: { flex: 1 },
    txType: { fontSize: '0.9rem', fontWeight: '700', margin: '0 0 0.1rem 0', color: 'var(--text-primary)' },
    txDate: { fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0 },
    txAmount: { fontSize: '0.9rem', fontWeight: '800' },
};

export default Dashboard;
