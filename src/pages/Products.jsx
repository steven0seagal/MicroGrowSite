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

    /* QR Scanner Disabled by User Request
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
    */

    return (
        <div className="fade-in-up">
            {/* Section 1: Products Header */}
            <section className="section-fullscreen" style={{ backgroundColor: '#F5F5F7' }}>
                <div className="container text-center">
                    <h1 style={{ fontSize: 'var(--font-size-h1)', color: 'var(--color-primary)', marginBottom: 'var(--spacing-sm)' }}>
                        Our Products
                    </h1>
                    <p className="text-large" style={{ maxWidth: '700px', margin: '0 auto', color: 'var(--color-text-light)' }}>
                        Advanced microchips engineered for precision cell culture and research excellence.
                    </p>
                </div>
            </section>

            {/* Section 2: Product Listings */}
            {products.map((product, index) => (
                <section
                    key={product.id}
                    id={product.id}
                    className="section-fullscreen"
                    style={{
                        backgroundColor: index % 2 === 0 ? 'white' : '#F5F5F7',
                    }}
                >
                    <div className="container" style={{
                        display: 'flex',
                        flexDirection: index % 2 === 0 ? 'row' : 'row-reverse',
                        alignItems: 'center',
                        gap: 'var(--spacing-lg)',
                        flexWrap: 'wrap'
                    }}>
                        <div style={{ flex: 1, minWidth: '300px' }}>
                            <img
                                src={product.image}
                                alt={product.name}
                                style={{ borderRadius: '12px', width: '100%', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}
                            />
                        </div>
                        <div style={{ flex: 1, minWidth: '300px' }}>
                            <h2 style={{ fontSize: 'var(--font-size-h2)', color: 'var(--color-primary)', marginBottom: 'var(--spacing-sm)' }}>
                                {product.name}
                            </h2>
                            <p className="text-large" style={{ color: 'var(--color-text-light)', lineHeight: '1.6' }}>
                                {product.description}
                            </p>
                        </div>
                    </div>
                </section>
            ))}
        </div>
    );
};

export default Products;
