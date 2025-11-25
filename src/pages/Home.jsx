import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
    return (
        <div className="fade-in">
            {/* Hero Section */}
            <section style={{
                backgroundColor: 'var(--color-accent)',
                padding: 'var(--spacing-xl) 0',
                textAlign: 'center'
            }}>
                <div className="container">
                    <h1 style={{
                        fontSize: 'var(--font-size-h1)',
                        color: 'var(--color-primary)',
                        marginBottom: 'var(--spacing-sm)'
                    }}>
                        MicroGrow
                    </h1>
                    <p style={{
                        fontSize: '1.25rem',
                        color: 'var(--color-text-light)',
                        maxWidth: '600px',
                        margin: '0 auto var(--spacing-md)'
                    }}>
                        Advanced Microchips for Next-Generation Cell Culture.
                    </p>
                    <Link to="/products" className="btn btn-primary">
                        View Products
                    </Link>
                </div>
            </section>

            {/* About Section */}
            <section className="section container">
                <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
                    <h2 style={{
                        color: 'var(--color-text-main)',
                        marginBottom: 'var(--spacing-md)'
                    }}>
                        Pioneering Biotechnology
                    </h2>
                    <p style={{ marginBottom: 'var(--spacing-sm)', color: 'var(--color-text-light)' }}>
                        MicroGrow is at the forefront of biotechnology, specializing in high-precision microchips designed for optimal cell culture environments. Our mission is to accelerate research and development in life sciences through innovative engineering.
                    </p>
                    <p style={{ color: 'var(--color-text-light)' }}>
                        We combine cutting-edge microfluidics with biocompatible materials to create platforms that mimic in vivo conditions, providing researchers with reliable and reproducible results.
                    </p>
                </div>
            </section>
        </div>
    );
};

export default Home;
