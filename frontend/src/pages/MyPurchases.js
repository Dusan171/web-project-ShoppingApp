import React, { useEffect, useState, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { getAllProducts } from '../services/productService'; 
import '../css/ReviewModal.css'; 

async function postReviewAPI(reviewData, token) {
    const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(reviewData)
    });
    if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || "Failed to post review.");
    }
    return res.json();
}

async function postReportAPI(reportData, token) {
    const res = await fetch('/api/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(reportData)
    });
    if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || "Failed to post report.");
    }
    return res.json();
}

export default function MyPurchases() {
    const { user } = useAuth();
    const [purchases, setPurchases] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
    const [selectedProductForReview, setSelectedProductForReview] = useState(null);
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');

    const [isReportModalOpen, setIsReportModalOpen] = useState(false);
    const [selectedProductForReport, setSelectedProductForReport] = useState(null);
    const [reportReason, setReportReason] = useState('');
    
    const loadPurchases = useCallback(async () => {
        if (!user) return;
        setLoading(true);
        try {
            const allProducts = await getAllProducts();
            const mySoldProducts = allProducts.filter(p => 
                p.status === 'Sold' && String(p.kupacId) === String(user.id)
            );
            setPurchases(mySoldProducts);
        } catch (error) {
            console.error("Failed to load purchases:", error);
            setError("Greška pri učitavanju kupovina.");
        } finally {
            setLoading(false);
        }
    }, [user]);

    useEffect(() => {
        loadPurchases();
    }, [loadPurchases]);

    const openReviewModal = (product) => {
        setSelectedProductForReview(product);
        setRating(0);
        setComment('');
        setIsReviewModalOpen(true);
    };

    const closeReviewModal = () => {
        setIsReviewModalOpen(false);
        setSelectedProductForReview(null);
    };

    const handleReviewSubmit = async () => {
        if (rating === 0) {
            alert("Molimo odaberite ocjenu (1-5).");
            return;
        }
        const token = localStorage.getItem('token');
        const reviewData = {
            ocjena: rating,
            komentar: comment,
            productId: selectedProductForReview.id,
            receiverId: selectedProductForReview.prodavacId
        };
        try {
            await postReviewAPI(reviewData, token);
            alert("Recenzija uspješno poslana!");
            closeReviewModal();
            loadPurchases(); 
        } catch (err) {
            alert(`Greška: ${err.message}`);
        }
    };

    const openReportModal = (product) => {
        setSelectedProductForReport(product);
        setReportReason('');
        setIsReportModalOpen(true);
    };

    const closeReportModal = () => {
        setIsReportModalOpen(false);
        setSelectedProductForReport(null);
    };

    const handleReportSubmit = async () => {
        if (reportReason.trim() === '') {
            alert("Molimo unesite razlog prijave.");
            return;
        }
        const token = localStorage.getItem('token');
        const reportData = {
            razlog: reportReason,
            productId: selectedProductForReport.id,
        };
        try {
            await postReportAPI(reportData, token);
            alert("Prijava uspješno poslana administratoru na pregled.");
            closeReportModal();
        } catch (err) {
            alert(`Greška: ${err.message}`);
        }
    };

    if (loading) return <h2>Učitavanje...</h2>;

    return (
        <div className="container" style={{ paddingTop: '100px' }}>
            <h2>Moje Kupovine</h2>
            {error && <p className="alert alert-danger">{error}</p>}
            <table className="table table-striped">
                <thead>
                    <tr>
                        <th>Proizvod</th>
                        <th>Status</th>
                        <th style={{width: '220px'}}>Akcije</th>
                    </tr>
                </thead>
                <tbody>
                    {purchases.map(product => (
                        <tr key={product.id}>
                            <td>{product.name}</td>
                            <td><span className="badge bg-success">{product.status}</span></td>
                            <td>
                                <button 
                                    className="btn btn-sm btn-primary me-2" 
                                    onClick={() => openReviewModal(product)}
                                >
                                    Ocijeni
                                </button>
                                <button 
                                    className="btn btn-sm btn-danger" 
                                    onClick={() => openReportModal(product)}
                                >
                                    Prijavi Prodavca
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {purchases.length === 0 && !loading && <p>Nemate završenih kupovina.</p>}

            {/* MODAL ZA RECENZIJE */}
            {isReviewModalOpen && (
                <div className="modal-backdrop">
                    <div className="modal">
                        <h3>Ocijenite kupovinu za "{selectedProductForReview.name}"</h3>
                        <div className="rating-stars">
                            {[1, 2, 3, 4, 5].map(star => (
                                <span 
                                    key={star}
                                    className={star <= rating ? 'star-filled' : 'star-empty'}
                                    onClick={() => setRating(star)}
                                >
                                    ★
                                </span>
                            ))}
                        </div>
                        <textarea 
                            value={comment} 
                            onChange={(e) => setComment(e.target.value)} 
                            placeholder="Vaš komentar (opcionalno)..."
                        />
                        <div className="modal-buttons">
                            <button onClick={handleReviewSubmit}>Pošalji recenziju</button>
                            <button onClick={closeReviewModal}>Otkaži</button>
                        </div>
                    </div>
                </div>
            )}

            {/* MODAL ZA PRIJAVU */}
            {isReportModalOpen && (
                <div className="modal-backdrop">
                    <div className="modal">
                        <h3>Prijavi prodavca za "{selectedProductForReport.name}"</h3>
                        <textarea 
                            value={reportReason} 
                            onChange={(e) => setReportReason(e.target.value)} 
                            placeholder="Unesite razlog prijave (npr. niste dobili proizvod, oštećen je...)"
                        />
                        <div className="modal-buttons">
                            <button onClick={handleReportSubmit}>Pošalji prijavu</button>
                            <button onClick={closeReportModal}>Otkaži</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}