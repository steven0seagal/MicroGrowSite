import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const Home = () => {
    const { t } = useTranslation();

    return (
        <div className="home-container">
            {/* Hero Section */}
            <section className="section-fullscreen" style={{ backgroundColor: '#F5F5F7', minHeight: '90vh' }}>
                <div className="container text-center">
                    <h1 className="fade-in-up" style={{
                        fontSize: 'var(--font-size-h1)',
                        color: 'var(--color-primary)',
                        marginBottom: 'var(--spacing-sm)',
                        fontWeight: '700'
                    }}>
                        {t('home.heroTitle')}<span style={{ color: 'var(--color-accent)' }}>{t('home.heroSubtitle')}</span>
                    </h1>
                    <h2 className="fade-in-up delay-1" style={{
                        fontSize: 'var(--font-size-h3)',
                        color: 'var(--color-text-main)',
                        marginBottom: 'var(--spacing-md)',
                        fontWeight: '400'
                    }}>
                        {t('home.introTitle')}
                    </h2>
                    <p className="text-large fade-in-up delay-2" style={{ maxWidth: '800px', margin: '0 auto var(--spacing-lg)', color: '#424245' }}>
                        {t('home.introText')}
                    </p>
                    <div className="fade-in-up delay-3">
                        <Link to="/products" className="btn btn-primary" style={{ borderRadius: '30px', padding: '1rem 2.5rem', fontSize: '1.2rem' }}>
                            {t('home.cta')}
                        </Link>
                    </div>
                </div>
            </section>

            {/* The Problem Section */}
            <section className="section-fullscreen" style={{ backgroundColor: '#1d1d1f', color: 'white' }}>
                <div className="container">
                    <div className="fade-in-up" style={{ maxWidth: '900px', margin: '0 auto', textAlign: 'center' }}>
                        <h2 style={{ fontSize: 'var(--font-size-h2)', marginBottom: 'var(--spacing-md)', color: 'white' }}>
                            {t('home.problem.title')}
                        </h2>
                        <p style={{ fontSize: '1.5rem', lineHeight: '1.6', fontWeight: '300' }}>
                            {t('home.problem.text')}
                        </p>
                    </div>
                </div>
            </section>

            {/* Our Mission Section */}
            <section className="section-fullscreen" style={{ backgroundColor: 'white' }}>
                <div className="container" style={{ maxWidth: '900px' }}>
                    <div className="fade-in-up" style={{ textAlign: 'center' }}>
                        <h2 style={{ fontSize: 'var(--font-size-h2)', color: 'var(--color-primary)', marginBottom: 'var(--spacing-sm)' }}>
                            {t('home.mission.title')}
                        </h2>
                        <p className="text-large" style={{ color: 'var(--color-text-light)', lineHeight: '1.8' }}>
                            {t('home.mission.text')}
                        </p>
                    </div>
                </div>
            </section>

            {/* The Solution Section */}
            <section className="section-fullscreen" style={{ backgroundColor: '#F5F5F7' }}>
                <div className="container" style={{ maxWidth: '900px' }}>
                    <div className="fade-in-up" style={{ textAlign: 'center' }}>
                        <h2 style={{ fontSize: 'var(--font-size-h2)', color: 'var(--color-primary)', marginBottom: 'var(--spacing-sm)' }}>
                            {t('home.solution.title')}
                        </h2>
                        <p className="text-large" style={{ color: 'var(--color-text-light)', lineHeight: '1.8' }}>
                            {t('home.solution.text')}
                        </p>
                    </div>
                </div>
            </section>

            {/* Impact Section */}
            <section className="section-fullscreen" style={{ backgroundColor: '#F0F8FF' }}>
                <div className="container text-center" style={{ maxWidth: '1000px' }}>
                    <h2 className="fade-in-up" style={{ fontSize: 'var(--font-size-h2)', color: 'var(--color-primary)', marginBottom: 'var(--spacing-md)' }}>
                        {t('home.impact.title')}
                    </h2>
                    <p className="text-large fade-in-up delay-1" style={{ fontSize: '1.4rem', lineHeight: '1.6' }}>
                        {t('home.impact.text')}
                    </p>
                </div>
            </section>

            {/* Call to Action */}
            <section className="section-fullscreen" style={{ backgroundColor: '#204252', color: 'white' }}>
                <div className="container text-center">
                    <h2 className="fade-in-up" style={{ fontSize: 'var(--font-size-h2)', marginBottom: 'var(--spacing-md)', color: 'white' }}>
                        {t('home.cta')}
                    </h2>
                    <div className="fade-in-up delay-1" style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                        <Link to="/products" className="btn" style={{ backgroundColor: 'white', color: 'var(--color-primary)', borderRadius: '30px', padding: '1rem 2rem' }}>
                            {t('nav.products')}
                        </Link>
                        <a href="mailto:contact@microgrow.bio" className="btn btn-outline" style={{ borderRadius: '30px', padding: '1rem 2rem', borderColor: 'white', color: 'white' }}>
                            {t('nav.contact')}
                        </a>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
