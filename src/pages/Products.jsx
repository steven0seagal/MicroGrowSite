import React, { useState } from 'react';
import QRScanner from '../components/QRScanner';

const products = [
    {
        id: 'chip-001',
        name: 'MicroChip Alpha',
        description: 'The Alpha series is designed for high-throughput screening. It features 96 independent wells with integrated sensors for real-time monitoring of pH and dissolved oxygen. Ideal for drug discovery and toxicity testing.',
        image: 'https://via.placeholder.com/400x300/367588/FFFFFF?text=MicroChip+Alpha'
    },
    {
        id: 'chip-002',
        name: 'MicroChip Beta',
        description: 'Optimized for long-term cell culture, the Beta series provides a stable environment with precise temperature control. Its microfluidic channels ensure constant nutrient supply and waste removal, mimicking the in vivo vascular system.',
        image: 'https://via.placeholder.com/400x300/89CFF0/FFFFFF?text=MicroChip+Beta'
    },
    {
        id: 'chip-003',
        name: 'MicroChip Gamma',
        description: 'Our most advanced chip for organ-on-a-chip applications. The Gamma series allows for the co-culture of multiple cell types to study complex tissue interactions. Features transparent walls for high-resolution microscopy.',
        image: 'https://via.placeholder.com/400x300/E0F7FA/333333?text=MicroChip+Gamma'
    }
];

const Products = () => {
    const [showScanner, setShowScanner] = useState(false);
    const [highlightedProduct, setHighlightedProduct] = useState(null);

    const handleScan = (data) => {
        if (data) {
            const product = products.find(p => p.id === data || p.name === data);
            if (product) {
                setHighlightedProduct(product.id);
                setShowScanner(false);
                // Scroll to product
                const element = document.getElementById(product.id);
                if (element) element.scrollIntoView({ behavior: 'smooth' });
            } else {
                alert(`Product not found for code: ${data}`);
            }
        }
    };

    return (
        <div className="fade-in container section">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-md)' }}>
                <h1 style={{ color: 'var(--color-primary)' }}>Our Products</h1>
                <button
                    className="btn btn-outline"
                    onClick={() => setShowScanner(!showScanner)}
                >
                    {showScanner ? 'Close Scanner' : 'Scan QR Code'}
                </button>
            </div>

            {showScanner && (
                <div style={{ marginBottom: 'var(--spacing-md)', padding: '1rem', border: '1px solid var(--color-border)', borderRadius: '8px' }}>
                    <p className="text-center mb-sm">Scan a product QR code to find it on the page.</p>
                    <QRScanner onScanResult={handleScan} />
                </div>
            )}

            <div className="products-list">
                {products.map((product, index) => (
                    <div
                        key={product.id}
                        id={product.id}
                        style={{
                            display: 'flex',
                            flexDirection: index % 2 === 0 ? 'row' : 'row-reverse',
                            alignItems: 'center',
                            gap: 'var(--spacing-md)',
                            marginBottom: 'var(--spacing-lg)',
                            padding: '1rem',
                            border: highlightedProduct === product.id ? '2px solid var(--color-primary)' : 'none',
                            borderRadius: '8px',
                            transition: 'border 0.3s ease'
                        }}
                    >
                        <div style={{ flex: 1 }}>
                            <img
                                src={product.image}
                                alt={product.name}
                                style={{ borderRadius: '8px', width: '100%', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}
                            />
                        </div>
                        <div style={{ flex: 1 }}>
                            <h2 style={{ color: 'var(--color-primary)', marginBottom: 'var(--spacing-sm)' }}>{product.name}</h2>
                            <p style={{ color: 'var(--color-text-light)' }}>{product.description}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Products;
