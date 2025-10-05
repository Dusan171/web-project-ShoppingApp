import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';

async function fetchPublicProfile(userId) {
    const res = await fetch(`/api/users/${userId}`);
    if (!res.ok) throw new Error('Korisnik nije pronađen.');
    return res.json();
}

export default function PublicProfilePage() {
    const { userId } = useParams(); 
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const loadProfile = async () => {
            try {
                setLoading(true);
                const data = await fetchPublicProfile(userId);
                setProfile(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        loadProfile();
    }, [userId]);

    if (loading) return <div>Učitavanje profila...</div>;
    if (error) return <div>{error}</div>;
    if (!profile) return <div>Profil nije pronađen.</div>;

    return (
        <div className="profile-page"> {/* Koristimo isti stil kao za MyProfile */}
            <div className="container">
                <div className="profile-card">
                    <img 
                        src={profile.profilnaSlika || '/default-profile.png'} 
                        alt={`${profile.korisnickoIme}'s profile`} 
                        style={{ width: '150px', height: '150px', borderRadius: '50%', objectFit: 'cover' }} 
                    />
                    <h2>{profile.korisnickoIme}</h2>
                    <p><strong>Uloga:</strong> {profile.uloga}</p>
                    <p><strong>Ime:</strong> {profile.ime} {profile.prezime}</p>
                    <p><strong>Opis:</strong> {profile.opis || 'Korisnik nije dodao opis.'}</p>
                    <p><strong>Prosječna ocjena:</strong> {profile.prosjecnaOcjena.toFixed(1)} ★</p>
                </div>

                {profile.uloga === 'Prodavac' && (
                    <div className="products-section">
                        <h2>Proizvodi na prodaju</h2>
                        <div className="row">
                            {profile.proizvodiNaProdaju && profile.proizvodiNaProdaju.map(product => (
                                <div key={product.id} className="col-md-4 mb-3">
                                    <div className="card">
                                        <img src={product.image} className="card-img-top" alt={product.name} />
                                        <div className="card-body">
                                            <h5 className="card-title">{product.name}</h5>
                                            <p className="card-text">${product.price}</p>
                                            <Link to={`/products/${product.id}`} className="btn btn-primary">
                                                Pogledaj proizvod
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
                
                {/* === NOVA SEKCIJA ZA RECENZIJE === */}
<div className="reviews-section mt-5">
    <h2>Recenzije ({profile.recenzije.length})</h2>
    {profile.recenzije && profile.recenzije.length > 0 ? (
        profile.recenzije.map(review => (
            <div key={review.id} className="card mb-3">
                <div className="card-body">
                    <h5 className="card-title">{'★'.repeat(review.ocjena).padEnd(5, '☆')}</h5>
                    <p className="card-text">{review.komentar}</p>
                    <footer className="blockquote-footer">
                        Ostavio/la <cite title="Source Title">{review.authorUsername}</cite>
                    </footer>
                </div>
            </div>
        ))
    ) : (
        <p>Ovaj korisnik još nema recenzija.</p>
    )}
</div>
            </div>
        </div>
    );
}