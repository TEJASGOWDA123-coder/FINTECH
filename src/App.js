import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import CreateAccount from './pages/CreateAccount';
import Login from './pages/Login';
import Deposit from './pages/Deposit';
import Transfer from './pages/Transfer';
import Balance from './pages/Balance';
import TransactionHistory from './pages/TransactionHistory';
import Admin from './pages/Admin';
import Dashboard from './pages/Dashboard';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <nav className="navbar">
          <div className="nav-brand">FinTech App</div>
          <div className="nav-links">
            <Link to="/login" className="nav-link">Login</Link>
            <Link to="/create-account" className="nav-link">Create Account</Link>
            <Link to="/deposit" className="nav-link">Deposit</Link>
            <Link to="/transfer" className="nav-link">Transfer</Link>
            <Link to="/balance" className="nav-link">Balance</Link>
            <Link to="/transactions" className="nav-link">History</Link>
            <Link to="/dashboard" className="nav-link">Dashboard</Link>
            <Link to="/admin" className="nav-link">Admin</Link>
          </div>
        </nav>

        <div className="content">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/create-account" element={<CreateAccount />} />
            <Route path="/" element={<Login />} /> {/* Default to Login */}
            <Route path="/deposit" element={<Deposit />} />
            <Route path="/transfer" element={<Transfer />} />
            <Route path="/balance" element={<Balance />} />
            <Route path="/transactions" element={<TransactionHistory />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/dashboard" element={<Dashboard />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
