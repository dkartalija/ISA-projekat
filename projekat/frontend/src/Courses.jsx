import { useState, useEffect } from 'react';
import API from './api';

const Courses = ({ onLogout }) => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        API.get('/courses')
            .then((res) => {
                const data = Array.isArray(res.data) ? res.data : (res.data?.content || []);
                setCourses(data);
                setLoading(false);
            })
            .catch((err) => {
                console.error('Greška pri dobijanju kurseva:', err);
                setError('Nije moguće učitati edukacije sa servera.');
                setLoading(false);
            });
    }, []);

    return (
        <div>
            <header className="header">
                <div className="nav-container">
                    <div className="logo">
                        <span className="logo-icon">🐝</span>
                        Akademija <span>Pčelarstva</span>
                    </div>
                    <div className="nav-actions">
                        <span className="hero-badge" style={{ margin: 0 }}>Korisnički portal</span>
                        <button onClick={onLogout} className="btn btn-danger">Odjavi se</button>
                    </div>
                </div>
            </header>

            <main className="container" style={{ paddingTop: '32px' }}>
                <section className="hero-landing" style={{ padding: '20px 0 40px' }}>
                    <h1>Dobrodošli u Pčelarsku Akademiju 🍯</h1>
                    <p>Pristupili ste nastavnom programu. Odaberite modul za pregled detaljnog sadržaja i lekcija.</p>
                </section>

                <div className="section-header">
                    <span>🍯</span>
                    <h2 className="section-title">Vaši aktivni moduli</h2>
                </div>

                {loading && <p style={{ color: 'var(--text-muted)' }}>Učitavanje programa...</p>}
                {error && <div className="alert-box error">{error}</div>}

                {!loading && !error && courses.length === 0 && (
                    <p style={{ color: 'var(--text-muted)' }}>Trenutno nema aktivnih kurseva.</p>
                )}

                <div className="course-grid">
                    {courses.map((course) => (
                        <div key={course.id || course.title} className="course-card">
                            <div>
                                <div className="card-header-icon">🐝</div>
                                <h3>{course.title || course.name || 'Pčelarski modul'}</h3>
                                <p>{course.description || 'Nema opisa za ovaj kurs.'}</p>
                            </div>
                            <div className="card-meta">
                                <span className="duration-tag">
                                    ⏱️ {course.durationInWeeks ? `${course.durationInWeeks} nedelja` : 'Trajanje: Fleksibilno'}
                                </span>
                                <button className="btn btn-primary" style={{ fontSize: '0.8rem', padding: '6px 12px' }}>
                                    Lekcije →
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
};

export default Courses;