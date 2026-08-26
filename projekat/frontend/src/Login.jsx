import { useState } from 'react';
import API from './api';

const Login = ({ onLoginSuccess, onCancel, onOpenRegister }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMsg, setErrorMsg] = useState('');
    const [successMsg, setSuccessMsg] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        setErrorMsg('');
        setSuccessMsg('');

        try {
            localStorage.removeItem('token');
            localStorage.removeItem('refreshToken');
            localStorage.removeItem('role');

            const response = await API.post('/auth/login', {
                email: email.trim(),
                password: password
            });

            const token = response.data.token || response.data.jwt || response.data.accessToken;
            const refreshToken = response.data.refreshToken || token; // Čuva token za osvežavanje

            let rawRole = response.data.role || response.data.roles || response.data.authorities;

            if (Array.isArray(rawRole) && rawRole.length > 0) {
                rawRole = rawRole[0];
            }

            if (typeof rawRole === 'object' && rawRole !== null) {
                rawRole = rawRole.authority || rawRole.role || rawRole.name || '';
            }

            const cleanRole = String(rawRole || '').toUpperCase();

            if (token) {
                localStorage.setItem('token', token);
                localStorage.setItem('refreshToken', refreshToken);
                if (cleanRole) {
                    localStorage.setItem('role', cleanRole);
                }
                onLoginSuccess();
            } else {
                setErrorMsg('Server nije vratio token.');
            }
        } catch (error) {
            console.error(error);
            setErrorMsg('Neuspešna prijava. Proverite podatke.');
        }
    };

    const handleTestSignup = async () => {
        setErrorMsg('');
        setSuccessMsg('');

        const uniqueEmail = `pcelar_${Date.now()}@akademija.com`;
        const testPassword = 'password123';

        try {
            await API.post('/auth/signup', {
                email: uniqueEmail,
                password: testPassword,
                firstName: 'Test',
                lastName: 'Pčelar',
                contactNumber: '060123456'
            });

            setEmail(uniqueEmail);
            setPassword(testPassword);
            setSuccessMsg(`Kreiran nalog: ${uniqueEmail}`);
        } catch (error) {
            console.error(error);
            setErrorMsg('Greška pri kreiranju naloga.');
        }
    };

    return (
        <div className="auth-overlay">
            <div className="auth-box">
                <h2>Portal za članove</h2>
                <p>Unesite pristupne podatke za prijavu</p>

                {errorMsg && <div className="alert-box error">{errorMsg}</div>}
                {successMsg && <div className="alert-box success">{successMsg}</div>}

                <form onSubmit={handleLogin}>
                    <div className="field">
                        <label>Email adresa</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className="field">
                        <label>Lozinka</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '8px' }}>
                        Prijavi se
                    </button>
                </form>

                <button onClick={handleTestSignup} className="btn btn-outline" style={{ width: '100%', marginTop: '12px' }}>
                    Kreiraj brz test nalog
                </button>

                <button onClick={onCancel} className="btn btn-outline" style={{ width: '100%', marginTop: '8px', border: 'none' }}>
                    ← Nazad na početnu
                </button>

                <p style={{ marginTop: '15px', fontSize: '0.9rem', textAlign: 'center' }}>
                    Nemate nalog?{' '}
                    <span
                        onClick={onOpenRegister}
                        style={{ color: '#d97706', cursor: 'pointer', fontWeight: 'bold', textDecoration: 'underline' }}
                    >
                        Registrujte se
                    </span>
                </p>
            </div>
        </div>
    );
};

export default Login;