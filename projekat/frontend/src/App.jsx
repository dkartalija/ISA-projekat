import { useState } from 'react';
import Landing from './Landing';
import Login from './Login';
import Register from './Register';
import AdminPanel from './AdminPanel';

function App() {
    const [currentView, setCurrentView] = useState('landing');

    const [isLoggedIn, setIsLoggedIn] = useState(() => {
        return !!localStorage.getItem('token');
    });

    const [userRole, setUserRole] = useState(() => {
        return localStorage.getItem('role');
    });

    const checkIsAdmin = (role) => {
        if (!role) return false;
        const roleStr = typeof role === 'object' ? JSON.stringify(role) : String(role);
        return roleStr.toUpperCase().includes('ADMIN');
    };

    const handleLoginSuccess = () => {
        setIsLoggedIn(true);
        const role = localStorage.getItem('role');
        setUserRole(role);

        if (checkIsAdmin(role)) {
            setCurrentView('admin');
        } else {
            setCurrentView('landing');
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('role');
        setIsLoggedIn(false);
        setUserRole(null);
        setCurrentView('landing');
    };

    const isAdmin = checkIsAdmin(userRole);

    return (
        <div>
            {currentView === 'login' && (
                <Login
                    onLoginSuccess={handleLoginSuccess}
                    onCancel={() => setCurrentView('landing')}
                    onOpenRegister={() => setCurrentView('register')}
                />
            )}

            {currentView === 'register' && (
                <Register
                    onRegisterSuccess={() => setCurrentView('login')}
                    onOpenLogin={() => setCurrentView('login')}
                    onCancel={() => setCurrentView('landing')}
                />
            )}

            {currentView === 'admin' && (
                isAdmin ? (
                    <AdminPanel onBack={() => setCurrentView('landing')} />
                ) : (
                    <div style={{ padding: '40px', textAlign: 'center' }}>
                        <h2>Pristup Odbijen</h2>
                        <p>Nemate administratorska prava za pregled ove stranice.</p>
                        <button
                            className="btn btn-primary"
                            onClick={() => setCurrentView('landing')}
                        >
                            Nazad na Početnu
                        </button>
                    </div>
                )
            )}

            {currentView === 'landing' && (
                <Landing
                    isLoggedIn={isLoggedIn}
                    userRole={userRole}
                    isAdmin={isAdmin}
                    onOpenLogin={() => setCurrentView('login')}
                    onOpenAdmin={() => setCurrentView('admin')}
                    onLogout={handleLogout}
                />
            )}
        </div>
    );
}

export default App;