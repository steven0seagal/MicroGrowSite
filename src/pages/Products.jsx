import React from 'react';
import { useTranslation } from 'react-i18next';
import ProductImage from '../assets/first_chip.jpg';

const Products = () => {
    const { t } = useTranslation();

    // Only one product for now as requested
    const products = [
        {
            id: 'cellsphere',
            name: t('products.deviceTitle'),
            description: t('products.deviceDesc'),
            // Placeholder image as requested
            image: ProductImage
        }
    ];

    const features = ['realistic', 'longterm', 'flow', 'throughput', 'scalable', 'analysis'];
    const [openFeature, setOpenFeature] = React.useState(null);

    const toggleFeature = (index) => {
        setOpenFeature(openFeature === index ? null : index);
    };

    return (
        <div className="fade-in-up">
            {/* Section 1: Products Header */}
            <section className="section-fullscreen" style={{ backgroundColor: '#F5F5F7', minHeight: '60vh' }}>
                <div className="container text-center">
                    <h1 style={{ fontSize: 'var(--font-size-h1)', color: 'var(--color-primary)', marginBottom: 'var(--spacing-sm)' }}>
                        {t('products.title')}
                    </h1>
                    <p className="text-large" style={{ maxWidth: '700px', margin: '0 auto', color: 'var(--color-text-light)' }}>
                        {t('products.subtitle')}
                    </p>
                </div>
            </section>

            {/* Section 2: Product Listings */}
            {products.map((product) => (
                <section
                    key={product.id}
                    id={product.id}
                    className="section-fullscreen"
                    style={{
                        backgroundColor: 'white',
                    }}
                >
                    <div className="container" style={{
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'start',
                        gap: 'var(--spacing-lg)',
                        flexWrap: 'wrap'
                    }}>
                        <div style={{ flex: 1, minWidth: '350px' }}>
                            <img
                                src={product.image}
                                alt={product.name}
                                style={{ borderRadius: '12px', width: '100%', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}
                            />
                        </div>
                        <div style={{ flex: 1.5, minWidth: '350px' }}>
                            <h2 style={{ fontSize: 'var(--font-size-h2)', color: 'var(--color-primary)', marginBottom: 'var(--spacing-sm)' }}>
                                {product.name}
                            </h2>
                            <p className="text-large" style={{ color: 'var(--color-text-light)', lineHeight: '1.6', marginBottom: '2rem' }}>
                                {product.description}
                            </p>

                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(2, 1fr)',
                                gap: '1.5rem',
                                alignItems: 'start'
                            }}>
                                {features.map((f, i) => (
                                    <div
                                        key={i}
                                        onClick={() => toggleFeature(i)}
                                        style={{
                                            backgroundColor: '#F9FAFB',
                                            padding: '1.5rem',
                                            borderRadius: '12px',
                                            cursor: 'pointer',
                                            transition: 'background-color 0.2s',
                                            border: openFeature === i ? '1px solid var(--color-accent)' : '1px solid transparent',
                                            // gridColumn: openFeature === i ? 'span 2' : 'span 1' // REMOVED: User wants it to stay same width
                                        }}
                                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F0F8FF'}
                                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#F9FAFB'}
                                    >
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <h4 style={{ color: 'var(--color-primary)', marginBottom: 0, fontWeight: 'bold', fontSize: '1rem' }}>
                                                {t(`products.features.${f}.title`)}
                                            </h4>
                                            <span style={{ fontSize: '1.2rem', color: 'var(--color-accent)', fontWeight: 'bold' }}>
                                                {openFeature === i ? '−' : '+'}
                                            </span>
                                        </div>

                                        {openFeature === i && (
                                            <p style={{ marginTop: '1rem', fontSize: '0.95rem', color: '#555', lineHeight: '1.5', animation: 'fadeInUp 0.3s ease' }}>
                                                {t(`products.features.${f}.desc`)}
                                            </p>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>
            ))}

            <section className="section-fullscreen" style={{ minHeight: '50vh', backgroundColor: '#F5F5F7' }}>
                <div className="container text-center">
                    <h3 style={{ color: 'var(--color-text-light)' }}>{t('products.comingSoon')}</h3>
                </div>
            </section>
        </div>
    );
};

export default Products;
