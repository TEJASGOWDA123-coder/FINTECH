import React, { useState, useRef, useEffect } from 'react';
import { sendChatMessage } from '../services/api';

const ChatBox = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { text: "Hello! I'm your Financo AI assistant. How can I help you today?", isAi: true }
    ]);
    const [input, setInput] = useState('');
    const [isThinking, setIsThinking] = useState(false);
    const messagesEndRef = useRef(null);
    // const accountId = localStorage.getItem('accountNumber') || 'anonymous';
    const accountId = ''

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        if (isOpen) scrollToBottom();
    }, [messages, isOpen, isThinking]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim() || isThinking) return;

        const userMsg = input.trim();
        setMessages(prev => [...prev, { text: userMsg, isAi: false }]);
        setInput('');
        setIsThinking(true);

        try {
            const data = await sendChatMessage(userMsg);
            // console.log(data);
            setMessages(prev => [...prev, { text: data, isAi: true }]);
            // const response = await sendChatMessage(userMsg, accountId);
            // setMessages(prev => [...prev, { text: response.response, isAi: true }]);
        } catch (error) {
            const status = error.response?.status;
            console.log('ChatBox Error:', error.message, status);

            let message = "Sorry, I'm having trouble connecting to the AI service. Please try again later.";
            if (status === 401) message = "Session expired or access denied. Please try logging in again.";
            if (status === 404) message = "AI service endpoint not found on server.";

            setMessages(prev => [...prev, { text: message, isAi: true }]);
        } finally {
            setIsThinking(false);
        }
    };

    if (!isOpen) {
        return (
            <div style={styles.bubble} onClick={() => setIsOpen(true)}>
                <span style={styles.bubbleIcon}>💬</span>
            </div>
        );
    }

    return (
        <div style={styles.chatWindow}>
            <div style={styles.header}>
                <div style={styles.headerInfo}>
                    <div style={styles.aiStatus} />
                    <span style={styles.headerTitle}>Fintech AI Assistant</span>
                </div>
                <button style={styles.closeBtn} onClick={() => setIsOpen(false)}>×</button>
            </div>

            <div style={styles.messagesArea}>
                {messages.map((m, i) => (
                    <div key={i} style={m.isAi ? styles.aiMsgContainer : styles.userMsgContainer}>
                        <div style={m.isAi ? styles.aiMsg : styles.userMsg}>
                            {m.text}
                        </div>
                    </div>
                ))}
                {isThinking && (
                    <div style={styles.aiMsgContainer}>
                        <div style={{ ...styles.aiMsg, display: 'flex', gap: '4px' }}>
                            <div className="dot-pulse" style={styles.dot} />
                            <div className="dot-pulse" style={{ ...styles.dot, animationDelay: '0.2s' }} />
                            <div className="dot-pulse" style={{ ...styles.dot, animationDelay: '0.4s' }} />
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            <form onSubmit={handleSend} style={styles.inputArea}>
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Type your message..."
                    style={styles.input}
                />
                <button type="submit" style={styles.sendBtn} disabled={isThinking}>
                    <span style={{ fontSize: '1.2rem' }}>✈️</span>
                </button>
            </form>

            <style>{`
                @keyframes pulse {
                    0%, 100% { transform: translateY(0); opacity: 0.5; }
                    50% { transform: translateY(-3px); opacity: 1; }
                }
                .dot-pulse {
                    width: 6px;
                    height: 6px;
                    background: var(--text-muted);
                    border-radius: 50%;
                    animation: pulse 1s infinite ease-in-out;
                }
            `}</style>
        </div>
    );
};

const styles = {
    bubble: {
        position: 'fixed',
        bottom: '30px',
        right: '30px',
        width: '60px',
        height: '60px',
        backgroundColor: 'var(--primary-color)',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        boxShadow: '0 10px 25px rgba(79, 70, 229, 0.4)',
        zIndex: 2000,
        transition: 'var(--transition)',
    },
    bubbleIcon: { fontSize: '1.5rem', userSelect: 'none' },
    chatWindow: {
        position: 'fixed',
        bottom: '30px',
        right: '30px',
        width: '380px',
        height: '500px',
        backgroundColor: 'var(--bg-secondary)',
        borderRadius: '20px',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: 'var(--shadow-lg)',
        border: '1px solid var(--glass-border)',
        zIndex: 2001,
        overflow: 'hidden',
        animation: 'slideUp 0.3s ease-out',
        transition: 'var(--transition)',
    },
    header: {
        background: 'linear-gradient(135deg, #4f46e5 0%, #c026d3 100%)',
        padding: '1.25rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        color: '#ffffff',
    },
    headerInfo: { display: 'flex', alignItems: 'center', gap: '10px' },
    aiStatus: { width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#10b981' },
    headerTitle: { fontWeight: '700', fontSize: '1rem' },
    closeBtn: {
        background: 'none',
        border: 'none',
        color: '#ffffff',
        fontSize: '1.5rem',
        cursor: 'pointer',
        padding: '0 5px',
        opacity: 0.8,
    },
    messagesArea: {
        flex: 1,
        padding: '1.25rem',
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
    },
    aiMsgContainer: { display: 'flex', justifyContent: 'flex-start' },
    userMsgContainer: { display: 'flex', justifyContent: 'flex-end' },
    aiMsg: {
        maxWidth: '80%',
        backgroundColor: 'var(--bg-tertiary)',
        padding: '0.75rem 1rem',
        borderRadius: '16px 16px 16px 4px',
        fontSize: '0.9rem',
        color: 'var(--text-primary)',
        border: '1px solid var(--glass-border)',
        lineHeight: '1.5',
    },
    userMsg: {
        maxWidth: '80%',
        backgroundColor: 'var(--primary-color)',
        padding: '0.75rem 1rem',
        borderRadius: '16px 16px 4px 16px',
        fontSize: '0.9rem',
        color: '#ffffff',
        lineHeight: '1.5',
    },
    dot: { width: '6px', height: '6px' },
    inputArea: {
        padding: '1.25rem',
        display: 'flex',
        gap: '10px',
        backgroundColor: 'var(--bg-secondary)',
        borderTop: '1px solid var(--glass-border)',
    },
    input: {
        flex: 1,
        backgroundColor: 'var(--bg-tertiary)',
        border: '1px solid var(--glass-border)',
        borderRadius: '12px',
        padding: '0.6rem 1rem',
        color: 'var(--text-primary)',
        fontSize: '0.9rem',
        outline: 'none',
    },
    sendBtn: {
        backgroundColor: 'var(--primary-color)',
        border: 'none',
        borderRadius: '12px',
        width: '40px',
        height: '40px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        color: '#ffffff',
        transition: 'var(--transition)',
    },
};

export default ChatBox;
