import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Register.css';

const API = 'http://localhost:5000/register';

function Register() {

    const [name,      setName]      = useState("");
    const [role,      setRole]      = useState("");
    const [company,   setCompany]   = useState("");
    const [people,    setPeople]    = useState([]);
    const [loading,   setLoading]   = useState(false);
    const [fetching,  setFetching]  = useState(true);
    const [status,    setStatus]    = useState(null); // { type: 'success'|'error', message }
    const [editingId, setEditingId] = useState(null); // _id of person being edited

    // ── Fetch all people from DB on page load ──
    useEffect(() => {
        async function fetchPeople() {
            try {
                const res = await axios.get(API);
                setPeople(res.data);
            } catch (err) {
                setStatus({ type: 'error', message: 'Could not load data. Is the backend running?' });
            } finally {
                setFetching(false);
            }
        }
        fetchPeople();
    }, []);

    // ── Clear form ──
    function clearForm() {
        setName("");
        setRole("");
        setCompany("");
        setEditingId(null);
        setStatus(null);
    }

    // ── Submit: either Create or Update ──
    async function handleSubmit(e) {
        e.preventDefault();

        if (!name.trim() || !role.trim() || !company.trim()) {
            setStatus({ type: 'error', message: 'All fields are required!' });
            return;
        }

        const data = { name: name.trim(), role: role.trim(), company: company.trim() };
        setLoading(true);
        setStatus(null);

        try {
            if (editingId) {
                // ── UPDATE ──
                const res = await axios.put(`${API}/${editingId}`, data);
                setPeople(prev => prev.map(p => p._id === editingId ? res.data.profile : p));
                setStatus({ type: 'success', message: `${data.name} updated successfully!` });
            } else {
                // ── CREATE ──
                const res = await axios.post(API, data);
                setPeople(prev => [...prev, res.data.profile]);
                setStatus({ type: 'success', message: `${data.name} registered successfully!` });
            }
            clearForm();
        } catch (err) {
            const msg = err.response?.data?.message || 'Server error. Make sure the backend is running on port 5000.';
            setStatus({ type: 'error', message: msg });
        } finally {
            setLoading(false);
        }
    }

    // ── Start editing a person ──
    function handleEdit(person) {
        setEditingId(person._id);
        setName(person.name);
        setRole(person.role);
        setCompany(person.company);
        setStatus(null);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // ── Delete a person ──
    async function handleDelete(id, personName) {
        if (!window.confirm(`Delete "${personName}"?`)) return;
        try {
            await axios.delete(`${API}/${id}`);
            setPeople(prev => prev.filter(p => p._id !== id));
            setStatus({ type: 'success', message: `${personName} deleted.` });
        } catch (err) {
            setStatus({ type: 'error', message: 'Delete failed. Try again.' });
        }
    }

    return (
        <div className="register-card">
            <h2 className="register-title">
                {editingId ? '✏️ Edit Person' : 'Register a Person'}
            </h2>

            <form className="register-form" onSubmit={handleSubmit}>

                <div className="register-form__field">
                    <label htmlFor="name">Name:</label>
                    <input
                        id="name"
                        type="text"
                        placeholder="Enter name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </div>

                <div className="register-form__field">
                    <label htmlFor="role">Role:</label>
                    <input
                        id="role"
                        type="text"
                        placeholder="Enter role"
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                    />
                </div>

                <div className="register-form__field">
                    <label htmlFor="company">Company:</label>
                    <input
                        id="company"
                        type="text"
                        placeholder="Enter company"
                        value={company}
                        onChange={(e) => setCompany(e.target.value)}
                    />
                </div>

                {status && (
                    <p className={`register-status register-status--${status.type}`}>
                        {status.message}
                    </p>
                )}

                <div className="register-form__actions">
                    <button
                        className="register-form__submit"
                        type="submit"
                        disabled={loading}
                    >
                        {loading
                            ? (editingId ? 'Updating...' : 'Submitting...')
                            : (editingId ? 'Update' : 'Submit')}
                    </button>

                    {editingId && (
                        <button
                            type="button"
                            className="register-form__cancel"
                            onClick={clearForm}
                        >
                            Cancel
                        </button>
                    )}
                </div>

            </form>

            {/* ── Registered People List ── */}
            <div className="register-people">
                <h3>
                    Registered People ({people.length})
                </h3>

                {fetching ? (
                    <p className="register-loading">Loading from database...</p>
                ) : people.length === 0 ? (
                    <p className="register-empty">No people registered yet.</p>
                ) : (
                    <ul>
                        {people.map((p) => (
                            <li key={p._id}>
                                <div className="register-person__info">
                                    <strong>{p.name}</strong>
                                    <span>{p.role} @ {p.company}</span>
                                </div>
                                <div className="register-person__btns">
                                    <button
                                        className="btn-edit"
                                        onClick={() => handleEdit(p)}
                                    >
                                        Edit
                                    </button>
                                    <button
                                        className="btn-delete"
                                        onClick={() => handleDelete(p._id, p.name)}
                                    >
                                        Delete
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}

export default Register;
