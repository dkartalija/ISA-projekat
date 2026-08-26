import { useState, useEffect } from 'react';
import API from './api';

const Landing = ({ isLoggedIn, isAdmin, onOpenLogin, onOpenAdmin, onLogout }) => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedCourse, setSelectedCourse] = useState(null); // Čuva kurs za koji se gledaju detalji

    useEffect(() => {
        API.get('/courses')
            .then((res) => {
                const data = Array.isArray(res.data) ? res.data : (res.data?.content || []);
                setCourses(data);
                setLoading(false);
            })
            .catch(() => {
                setCourses([]);
                setLoading(false);
            });
    }, []);

    const handleCourseClick = (course) => {
        if (!isLoggedIn) {
            // Not login
            onOpenLogin();
        } else {
            setSelectedCourse(course);
        }
    };

    return (
        <div>
            <header className="header">
                <div className="nav-container">
                    <div className="logo">
                        <span className="logo-icon">🐝</span>
                        Akademija <span>Pčelarstva</span>
                    </div>
                    <div className="nav-actions">
                        {isLoggedIn ? (
                            <>
                                {isAdmin && (
                                    <button onClick={onOpenAdmin} className="btn btn-outline" style={{ marginRight: '10px' }}>
                                        ⚙️ Admin Panel
                                    </button>
                                )}
                                <button onClick={onLogout} className="btn btn-primary">
                                    Odjavi se
                                </button>
                            </>
                        ) : (
                            <button onClick={onOpenLogin} className="btn btn-primary">
                                Prijava na sistem
                            </button>
                        )}
                    </div>
                </div>
            </header>

            {/* Hero */}
            <section className="hero-landing">
                <h1>Mesto gde se tradicija i moderna pčelarska praksa susreću</h1>
                <p>
                    Dobrodošli na edukativnu platformu posvećenu očuvanju i unapređenju pčelarstva.
                    Kroz višedecenijsko iskustvo u radu sa pčelinjim društvima, prikupili smo praktična znanja
                    koja pomažu kako početnicima, tako i iskusnim pčelarima da unaprede svoj pčelinjak.
                </p>
            </section>

            {/* Modal */}
            {selectedCourse && (
                <div className="auth-overlay" style={{ zIndex: 1000 }}>
                    <div className="auth-box" style={{ maxWidth: '600px', textAlign: 'left' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                            <h2 style={{ margin: 0 }}>🐝 {selectedCourse.title || selectedCourse.name}</h2>
                            <button
                                onClick={() => setSelectedCourse(null)}
                                style={{ background: 'none', border: 'none', fontSize: '1.2rem', cursor: 'pointer', color: '#666' }}
                            >
                                ✕
                            </button>
                        </div>
                        <p style={{ fontSize: '1rem', lineHeight: '1.5', color: '#444' }}>
                            {selectedCourse.description || 'Nema opisa za ovaj kurs.'}
                        </p>
                        <div style={{ marginTop: '20px', padding: '12px', background: '#fcf8f2', borderRadius: '6px', border: '1px solid #e6d5bc' }}>
                            <p style={{ margin: '4px 0' }}>
                                <strong>Trajanje:</strong> {selectedCourse.durationInWeeks ? `${selectedCourse.durationInWeeks} nedelja` : 'Nije definisano'}
                            </p>
                            {selectedCourse.category && (
                                <p style={{ margin: '4px 0' }}>
                                    <strong>Kategorija:</strong> {typeof selectedCourse.category === 'object' ? (selectedCourse.category.name || selectedCourse.category.id) : selectedCourse.category}
                                </p>
                            )}
                        </div>
                        <button
                            onClick={() => setSelectedCourse(null)}
                            className="btn btn-primary"
                            style={{ width: '100%', marginTop: '20px' }}
                        >
                            Zatvori
                        </button>
                    </div>
                </div>
            )}

            <section className="container">
                <div className="about-text-block">
                    <h2>O našem programu edukacije 🐝</h2>
                    <p>
                        Pčelarstvo nije samo posao — to je način života koji zahteva razumevanje prirode,
                        praćenje sezonskih promena i pravovremene reakcije u pčelinjaku. Naš cilj je da kroz
                        jasno strukturirane module prenesemo proverene tehnike rada sa LR košnicama, uzgoja kvalitetnih matica
                        i održavanja zdravlja pčela tokom cele godine.
                    </p>
                    <p>
                        Prijavom na portal dobijate pristup celokupnom nastavnom materijalu, evidenciji lekcija i
                        smernicama za praktičan rad na terenu.
                    </p>
                </div>

                <div className="section-header">
                    <span>🍯</span>
                    <h2 className="section-title">Dostupni edukativni moduli</h2>
                </div>

                {loading ? (
                    <p style={{ color: 'var(--text-muted)' }}>Učitavanje modula...</p>
                ) : courses.length === 0 ? (
                    <div className="course-grid">
                        <div className="course-card">
                            <div>
                                <div className="card-header-icon">🐝</div>
                                <h3>Osnovi pčelarstva i prolećni razvoj</h3>
                                <p>Priprema pčelinjaka za prvu pašu, odabir lokacije, pregled društava i prolećna prihrana.</p>
                            </div>
                            <div className="card-meta">
                                <span className="duration-tag">⏱️ 4 nedelje</span>
                                <button
                                    onClick={() => handleCourseClick({ title: 'Osnovi pčelarstva i prolećni razvoj', description: 'Priprema pčelinjaka za prvu pašu, odabir lokacije, pregled društava i prolećna prihrana.', durationInWeeks: 4 })}
                                    className="btn btn-outline"
                                    style={{ fontSize: '0.8rem', padding: '6px 12px' }}
                                >
                                    {isLoggedIn ? 'Detaljnije' : 'Pristupi'}
                                </button>
                            </div>
                        </div>

                        <div className="course-card">
                            <div>
                                <div className="card-header-icon">🍯</div>
                                <h3>Uzgoj matica i sprečavanje rojenja</h3>
                                <p>Tehnike uzgoja, formiranje novih rojeva, zamena matica i održavanje snage pčelinjih društava.</p>
                            </div>
                            <div className="card-meta">
                                <span className="duration-tag">⏱️ 6 nedelja</span>
                                <button
                                    onClick={() => handleCourseClick({ title: 'Uzgoj matica i sprečavanje rojenja', description: 'Tehnike uzgoja, formiranje novih rojeva, zamena matica i održavanje snage pčelinjih društava.', durationInWeeks: 6 })}
                                    className="btn btn-outline"
                                    style={{ fontSize: '0.8rem', padding: '6px 12px' }}
                                >
                                    {isLoggedIn ? 'Detaljnije' : 'Pristupi'}
                                </button>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="course-grid">
                        {courses.map((course) => (
                            <div key={course.id || course.title} className="course-card">
                                <div>
                                    <div className="card-header-icon">🐝</div>
                                    <h3>{course.title || course.name}</h3>
                                    <p>{course.description || 'Detaljan vodič i lekcije za rad u pčelinjaku.'}</p>
                                </div>
                                <div className="card-meta">
                                    <span className="duration-tag">
                                        ⏱️ {course.durationInWeeks ? `${course.durationInWeeks} nedelja` : 'Standardni modul'}
                                    </span>
                                    <button
                                        onClick={() => handleCourseClick(course)}
                                        className="btn btn-outline"
                                        style={{ fontSize: '0.8rem', padding: '6px 12px' }}
                                    >
                                        {isLoggedIn ? 'Detaljnije' : 'Pristupi'}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
};

export default Landing;