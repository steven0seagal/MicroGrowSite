import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
    return (
        <div className="home-container">
            {/* Hero Section */}
            <section className="section-fullscreen" style={{ backgroundColor: '#F5F5F7' }}>
                <div className="container text-center">
                    <h1 className="fade-in-up" style={{
                        fontSize: 'var(--font-size-h1)',
                        color: 'var(--color-primary)',
                        marginBottom: 'var(--spacing-sm)',
                        fontWeight: '700'
                    }}>
                        MicroGrow
                    </h1>
                    <h2 className="fade-in-up delay-1" style={{
                        fontSize: 'var(--font-size-h3)',
                        color: 'var(--color-text-main)',
                        marginBottom: 'var(--spacing-md)',
                        fontWeight: '400'
                    }}>
                        The future of cell culture is here.
                    </h2>
                    <div className="fade-in-up delay-2">
                        <Link to="/products" className="btn btn-primary" style={{ borderRadius: '30px', padding: '1rem 2.5rem', fontSize: '1.1rem' }}>
                            Discover Our Technology
                        </Link>
                    </div>
                </div>
            </section>

            {/* Philosophy Section */}
            <section className="section-fullscreen" style={{ backgroundColor: 'white' }}>
                <div className="container" style={{ maxWidth: '900px' }}>
                    <h2 className="fade-in-up" style={{
                        fontSize: 'var(--font-size-h2)',
                        marginBottom: 'var(--spacing-md)',
                        textAlign: 'center'
                    }}>
                        Precision. Scalability. Reproducibility.
                    </h2>
                    <p className="text-large fade-in-up delay-1" style={{ lineHeight: '1.6', color: '#424245' }}>
                        At MicroGrow, we believe that the tools of discovery should be as advanced as the science they support.
                        Traditional cell culture methods have reached their limits. We are breaking through those barriers with
                        microfluidic technology that recreates the complex physiological environments of the human body.
                    </p>
                </div>
            </section>

            {/* Technology Section */}
            <section className="section-fullscreen" style={{ backgroundColor: '#F0F8FF' }}>
                <div className="container" style={{ display: 'flex', alignItems: 'center', gap: '4rem', flexWrap: 'wrap' }}>
                    <div style={{ flex: 1, minWidth: '300px' }}>
                        <img
                            src="https://via.placeholder.com/600x600/367588/FFFFFF?text=Microfluidic+Chip"
                            alt="Microfluidic Chip"
                            style={{ borderRadius: '24px', boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}
                            className="fade-in-up"
                        />
                    </div>
                    <div style={{ flex: 1, minWidth: '300px' }}>
                        <h2 className="fade-in-up delay-1" style={{ fontSize: 'var(--font-size-h2)', marginBottom: 'var(--spacing-sm)' }}>
                            Engineered for Life.
                        </h2>
                        <p className="text-large fade-in-up delay-2" style={{ marginBottom: 'var(--spacing-sm)' }}>
                            Our microchips are not just vessels; they are active environments. Integrated sensors monitor pH,
                            oxygen, and temperature in real-time, ensuring optimal conditions for your cells.
                        </p>
                        <p className="text-large fade-in-up delay-3">
                            From drug toxicity screening to organ-on-a-chip disease modeling, MicroGrow provides the
                            fidelity you need to trust your data.
                        </p>
                    </div>
                </div>
            </section>

            {/* Call to Action */}
            <section className="section-fullscreen" style={{ backgroundColor: '#1d1d1f', color: 'white' }}>
                <div className="container text-center">
                    <h2 className="fade-in-up" style={{ fontSize: 'var(--font-size-h2)', marginBottom: 'var(--spacing-md)', color: 'white' }}>
                        Ready to elevate your research?
                    </h2>
                    <div className="fade-in-up delay-1" style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                        <Link to="/products" className="btn btn-primary" style={{ borderRadius: '30px', padding: '1rem 2rem' }}>
                            View Products
                        </Link>
                        <Link to="/team" className="btn btn-outline" style={{ borderRadius: '30px', padding: '1rem 2rem', borderColor: 'white', color: 'white' }}>
                            Contact Our Team
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
