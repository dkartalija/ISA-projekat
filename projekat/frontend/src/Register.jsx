import { useState } from 'react';
import API from './api';

const Register = ({ onRegisterSuccess, onCancel, onOpenLogin }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [contactNumber, setContactNumber] = useState('');

    const [errorMsg, setErrorMsg] = useState('');
    const [successMsg, setSuccessMsg] = useState('');

    const handleRegister = async (e) => {
        e.preventDefault();
        setErrorMsg('');
        setSuccessMsg('');

        try {
            await API.post('/auth/signup', {
                email: email.trim(),
                password: password,
                firstName: firstName.trim(),
                lastName: lastName.trim(),
                contactNumber: contactNumber.trim()
            });

            setSuccessMsg('Uspešna registracija! Sada se možete prijaviti.');

            // Nakon 1.5 sekunde automatski prebaci korisnika na Login
            setTimeout(() => {
                if (onRegisterSuccess) {
                    onRegisterSuccess();
                } else if (onOpenLogin) {
                    onOpenLogin();
                }
            }, 1500);

        } catch (error) {
            console.error('Greška pri registraciji:', error);
            if (error.response?.data?.message) {
                setErrorMsg(error.response.data.message);
            } else {
                setErrorMsg('Greška pri kreiranju naloga. Proverite podatke.');
            }
        }
    };

    return (
        <div className="auth-overlay">
            <div className="auth-box" style={{ maxWidth: '450px' }}>
                <h2>Registracija novog člana 🐝</h2>
                <p>Popunite podatke za kreiranje naloga</p>

                {errorMsg && <div className="alert-box error">{errorMsg}</div>}
                {successMsg && <div className="alert-box success">{successMsg}</div>}

                <form onSubmit={handleRegister}>
                    <div className="field" style={{ marginBottom: '10px' }}>
                        <label>Ime</label>
                        <input
                            type="text"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            required
                        />
                    </div>

                    <div className="field" style={{ marginBottom: '10px' }}>
                        <label>Prezime</label>
                        <input
                            type="text"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            required
                        />
                    </div>

                    <div className="field" style={{ marginBottom: '10px' }}>
                        <label>Email adresa</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className="field" style={{ marginBottom: '10px' }}>
                        <label>Lozinka</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <div className="field" style={{ marginBottom: '15px' }}>
                        <label>Broj telefona</label>
                        <input
                            type="text"
                            value={contactNumber}
                            onChange={(e) => setContactNumber(e.target.value)}
                            required
                        />
                    </div>

                    <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '8px' }}>
                        Registruj se
                    </button>
                </form>

                <p style={{ marginTop: '15px', fontSize: '0.9rem', textAlign: 'center' }}>
                    Već imate nalog?{' '}
                    <span
                        onClick={onOpenLogin}
                        style={{ color: '#d97706', cursor: 'pointer', fontWeight: 'bold', textDecoration: 'underline' }}
                    >
                        Prijavite se
                    </span>
                </p>

                <button onClick={onCancel} className="btn btn-outline" style={{ width: '100%', marginTop: '8px', border: 'none' }}>
                    ← Nazad na početnu
                </button>
            </div>
        </div>
    );
};

export default Register;