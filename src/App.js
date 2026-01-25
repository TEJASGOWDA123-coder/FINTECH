import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import CreateAccount from './pages/CreateAccount';
import Deposit from './pages/Deposit';
import Transfer from './pages/Transfer';
import Balance from './pages/Balance';
import TransactionHistory from './pages/TransactionHistory';
import Dashboard from './pages/Dashboard';
import Privacy from './pages/Privacy';
import Settings from './pages/Settings';
import Profile from './pages/Profile';
import Notifications from './pages/Notifications';
import Login from './pages/Login';
import Sidebar from './components/Sidebar';
import ChatBox from './components/ChatBox';
import { ThemeProvider } from './context/ThemeContext';
import './App.css';

// Layout component to handle conditional Sidebar/ChatBox rendering
const Layout = ({ children }) => {
  const location = useLocation();
  const hideSidebarRoutes = ['/login', '/create-account'];
  const shouldHideSidebar = hideSidebarRoutes.includes(location.pathname);

  return (
    <div className="App">
      {!shouldHideSidebar && <Sidebar />}
      <main className="content" style={{ marginLeft: shouldHideSidebar ? '0' : undefined, width: shouldHideSidebar ? '100%' : undefined }}>
        {children}
      </main>
      <ChatBox />
    </div>
  );
};

function App() {
  return (
    <ThemeProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/create-account" element={<CreateAccount />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/" element={<Navigate to="/login" replace />} />

            {/* Banking Routes */}
            <Route path="/deposit" element={<Deposit />} />
            <Route path="/transfer" element={<Transfer />} />
            <Route path="/balance" element={<Balance />} />
            <Route path="/transactions" element={<TransactionHistory />} />
          </Routes>
        </Layout>
      </Router>
    </ThemeProvider>
  );
}

export default App;
