import { useState, useEffect } from 'react';
import API from './api';

const AdminPanel = ({ onBack }) => {
    const [courses, setCourses] = useState([]);

    // Polja za formu
    const [editingCourseId, setEditingCourseId] = useState(null); // ako nije null, u Update stanju smo
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [durationInWeeks, setDurationInWeeks] = useState('');
    const [categoryId, setCategoryId] = useState('');

    // Za Read
    const [selectedCourse, setSelectedCourse] = useState(null);

    const [msg, setMsg] = useState('');
    const [isError, setIsError] = useState(false);

    const fetchCourses = async () => {
        try {
            const res = await API.get('/courses');
            const data = Array.isArray(res.data) ? res.data : (res.data?.content || []);
            setCourses(data);
        } catch (error) {
            console.error('Greška pri dohvatanju kurseva:', error);
        }
    };

    useEffect(() => {
        let isMounted = true;

        const loadInitialCourses = async () => {
            try {
                const res = await API.get('/courses');
                const data = Array.isArray(res.data) ? res.data : (res.data?.content || []);
                if (isMounted) {
                    setCourses(data);
                }
            } catch (error) {
                console.error('Greška pri dohvatanju kurseva:', error);
            }
        };

        loadInitialCourses();

        return () => {
            isMounted = false;
        };
    }, []);

    // Resetovanje forme
    const resetForm = () => {
        setEditingCourseId(null);
        setTitle('');
        setDescription('');
        setDurationInWeeks('');
        setCategoryId('');
    };

    // Izmene
    const handleStartEdit = (course) => {
        setEditingCourseId(course.id);
        setTitle(course.title || '');
        setDescription(course.description || '');
        setDurationInWeeks(course.durationInWeeks || '');

        const catId = typeof course.category === 'object' ? course.category?.id : course.category;
        setCategoryId(catId || '');

        setMsg('');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // Slanje forme
    const handleSubmit = async (e) => {
        e.preventDefault();
        setMsg('');
        setIsError(false);

        const coursePayload = {
            title,
            description,
            durationInWeeks: Number(durationInWeeks),
            category: { id: Number(categoryId) }
        };

        try {
            if (editingCourseId) {
                // UPDATE
                await API.put(`/courses/${editingCourseId}`, coursePayload);
                setMsg('Uspešno izmenjen kurs!');
            } else {
                // CREATE
                await API.post('/courses', coursePayload);
                setMsg('Uspešno kreiran novi kurs!');
            }

            resetForm();
            await fetchCourses();
        } catch (error) {
            console.error('Greška pri čuvanju kursa:', error);
            setIsError(true);

            if (error.response?.status === 403) {
                setMsg('Pristup odbijen (403). Odjavite se i prijavite ponovo.');
            } else {
                setMsg(editingCourseId ? 'Greška pri izmeni kursa.' : 'Greška pri kreiranju kursa.');
            }
        }
    };

    // DELETE
    const handleDelete = async (id) => {
        if (window.confirm('Da li ste sigurni da želite da obrišete ovaj kurs?')) {
            try {
                await API.delete(`/courses/${id}`);
                if (selectedCourse?.id === id) {
                    setSelectedCourse(null);
                }
                await fetchCourses();
                setMsg('Kurs uspešno obrisan.');
                setIsError(false);
            } catch (error) {
                console.error('Greška pri brisanju kursa:', error);
                alert('Greška pri brisanju kursa.');
            }
        }
    };

    return (
        <div style={{ padding: '30px', maxWidth: '900px', margin: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2>🐝 Admin Kontrolna Tabla - Upravljanje Kursevima</h2>
                <button onClick={onBack} className="btn btn-outline">← Nazad na sajt</button>
            </div>

            {msg && (
                <div
                    className={`alert-box ${isError ? 'error' : 'success'}`}
                    style={{
                        marginBottom: '15px',
                        padding: '10px 15px',
                        borderRadius: '5px',
                        backgroundColor: isError ? '#ffe6e6' : '#e6ffe6',
                        color: isError ? '#cc0000' : '#008000',
                        border: `1px solid ${isError ? '#ffb3b3' : '#b3ffb3'}`
                    }}
                >
                    {msg}
                </div>
            )}

            {/* FORMA ZA KREIRANJE / IZMENU */}
            <form onSubmit={handleSubmit} style={{ background: '#fcf8f2', padding: '20px', borderRadius: '8px', marginBottom: '30px', border: '1px solid #e6d5bc' }}>
                <h3>{editingCourseId ? '✏️ Izmeni kurs' : '➕ Kreiraj novi kurs'}</h3>

                <div className="field" style={{ marginBottom: '10px' }}>
                    <label>Naziv kursa</label>
                    <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required style={{ width: '100%', padding: '8px' }} />
                </div>

                <div className="field" style={{ marginBottom: '10px' }}>
                    <label>Opis</label>
                    <textarea value={description} onChange={(e) => setDescription(e.target.value)} required style={{ width: '100%', padding: '8px', minHeight: '80px' }} />
                </div>

                <div className="field" style={{ marginBottom: '10px' }}>
                    <label>Trajanje u nedeljama</label>
                    <input type="number" value={durationInWeeks} onChange={(e) => setDurationInWeeks(e.target.value)} required style={{ width: '100%', padding: '8px' }} />
                </div>

                <div className="field" style={{ marginBottom: '15px' }}>
                    <label>ID Kategorije</label>
                    <input type="number" value={categoryId} onChange={(e) => setCategoryId(e.target.value)} required style={{ width: '100%', padding: '8px' }} />
                </div>

                <div style={{ display: 'flex', gap: '10px' }}>
                    <button type="submit" className="btn btn-primary">
                        {editingCourseId ? 'Sačuvaj izmene' : 'Sačuvaj kurs'}
                    </button>
                    {editingCourseId && (
                        <button type="button" onClick={resetForm} className="btn btn-outline" style={{ background: '#fff' }}>
                            Otkaži izmenu
                        </button>
                    )}
                </div>
            </form>

            {/* READ - PRIKAZ DETALJA KAD SE KLIKNE "DETALJI" */}
            {selectedCourse && (
                <div style={{ background: '#eef6ff', padding: '15px', borderRadius: '8px', marginBottom: '20px', border: '1px solid #b6d4fe' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h4 style={{ margin: 0 }}>🔍 Detalji kursa: {selectedCourse.title}</h4>
                        <button onClick={() => setSelectedCourse(null)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>✕ Close</button>
                    </div>
                    <p style={{ marginTop: '10px', marginBottom: '5px' }}><strong>Opis:</strong> {selectedCourse.description}</p>
                    <p style={{ margin: '5px 0' }}><strong>Trajanje:</strong> {selectedCourse.durationInWeeks} nedelja</p>
                    <p style={{ margin: '5px 0' }}><strong>Kategorija ID:</strong> {typeof selectedCourse.category === 'object' ? selectedCourse.category?.id : selectedCourse.category}</p>
                </div>
            )}

            {/* LISTA KURSEVA (READ + UPDATE + DELETE DUGMIĆI) */}
            <h3>Postojeći moduli u bazi ({courses.length})</h3>
            <ul style={{ listStyle: 'none', padding: 0 }}>
                {courses.map(course => (
                    <li key={course.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#fff', padding: '12px 15px', marginBottom: '8px', border: '1px solid #ddd', borderRadius: '6px' }}>
                        <div>
                            <strong>{course.title}</strong> <span style={{ color: '#666', fontSize: '0.9rem' }}>({course.durationInWeeks} nedelja)</span>
                        </div>
                        <div style={{ display: 'flex', gap: '8px' }}>
                            {/* READ DUGME */}
                            <button
                                onClick={() => setSelectedCourse(course)}
                                style={{ background: '#0d6efd', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer' }}
                            >
                                Detalji
                            </button>
                            {/* UPDATE DUGME */}
                            <button
                                onClick={() => handleStartEdit(course)}
                                style={{ background: '#ffc107', color: '#000', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer' }}
                            >
                                Izmeni
                            </button>
                            {/* DELETE DUGME */}
                            <button
                                onClick={() => handleDelete(course.id)}
                                style={{ background: '#ff4d4d', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer' }}
                            >
                                Obriši
                            </button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default AdminPanel;