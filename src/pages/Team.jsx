import React from 'react';
import { useTranslation } from 'react-i18next';
import agnieszkaImg from '../assets/team/agnieszka_zuchowska.jpg';
import patrycjaImg from '../assets/team/patrycja_baranowska.jpg';
import elzbietaImg from '../assets/team/elzbieta_jastrzebska.jpg';

const Team = () => {
    const { t } = useTranslation();

    return (
        <div className="fade-in-up">
            {/* Section 1: Our Team (Intro) */}
            <section className="section-fullscreen" style={{ backgroundColor: '#F5F5F7' }}>
                <div className="container text-center">
                    <h1 style={{ fontSize: 'var(--font-size-h1)', color: 'var(--color-primary)', marginBottom: 'var(--spacing-sm)' }}>
                        {t('team.title')}
                    </h1>
                    <p className="text-large" style={{ maxWidth: '700px', margin: '0 auto', color: 'var(--color-text-light)' }}>
                        {t('home.introText')}
                    </p>
                </div>
            </section>

            {/* Team Grid */}
            <section className="section-fullscreen" style={{ backgroundColor: '#F5F5F7' }}>
                <div className="container" style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                    gap: '3rem',
                    justifyContent: 'center'
                }}>
                    {/* Explicitly ordering: Agnieszka, Patrycja, Elżbieta */}
                    {/* However, the css grid with auto-fit might wrap 2 on a line if screen is medium. 
                        User asked for "3 people in one row" (desktop) and "1 per line" (phone).
                        To strictly enforce 3 in row on large screens and 1 on small, we should use media queries or a strictly controlled grid.
                        Since I cannot easily insert media queries in inline styles, I will use a className and ensure css handles it, 
                        or use a style block here for simplicity if css file editing is too heavy. 
                        Actually, 'repeat(3, 1fr)' enforces 3 columns. On mobile we want 1.
                        I'll use window.innerWidth check or better: standard CSS class.
                        But I will try to use the existing 'container' behaviors or add a specific style.
                    */}
                    <style>{`
                        .team-grid {
                            display: grid;
                            grid-template-columns: 1fr;
                            gap: 3rem;
                        }
                        @media (min-width: 1024px) {
                            .team-grid {
                                grid-template-columns: repeat(3, 1fr);
                            }
                        }
                    `}</style>
                    <div className="team-grid">
                        {/* Agnieszka */}
                        <div className="team-card fade-in-up delay-1">
                            <div className="image-wrapper" style={{ marginBottom: '1.5rem', borderRadius: '50%', overflow: 'hidden', width: '200px', height: '200px', margin: '0 auto 1.5rem' }}>
                                <img src={agnieszkaImg} alt="Dr Eng. Agnieszka Żuchowska" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top' }} />
                            </div>
                            <h3 style={{ color: 'var(--color-primary)', marginBottom: '0.5rem' }}>{t('team.agnieszka.name')}</h3>
                            <p style={{ color: '#666', lineHeight: '1.4' }}>{t('team.agnieszka.role')}</p>
                        </div>

                        {/* Patrycja */}
                        <div className="team-card fade-in-up delay-2">
                            <div className="image-wrapper" style={{ marginBottom: '1.5rem', borderRadius: '50%', overflow: 'hidden', width: '200px', height: '200px', margin: '0 auto 1.5rem' }}>
                                <img src={patrycjaImg} alt="Dr Eng. Patrycja Baranowska" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 20%' }} />
                            </div>
                            <h3 style={{ color: 'var(--color-primary)', marginBottom: '0.5rem' }}>{t('team.patrycja.name')}</h3>
                            <p style={{ color: '#666', lineHeight: '1.4' }}>{t('team.patrycja.role')}</p>
                        </div>

                        {/* Elżbieta */}
                        <div className="team-card fade-in-up delay-3">
                            <div className="image-wrapper" style={{ marginBottom: '1.5rem', borderRadius: '50%', overflow: 'hidden', width: '200px', height: '200px', margin: '0 auto 1.5rem' }}>
                                <img src={elzbietaImg} alt="Prof. Dr Hab. Eng. Elżbieta Jastrzębska" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            </div>
                            <h3 style={{ color: 'var(--color-primary)', marginBottom: '0.5rem' }}>{t('team.elzbieta.name')}</h3>
                            <p style={{ color: '#666', lineHeight: '1.4' }}>{t('team.elzbieta.role')}</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Section 3: Get in Touch */}
            <section className="section-fullscreen" style={{ backgroundColor: '#1d1d1f', color: 'white' }}>
                <div className="container text-center">
                    <h2 style={{ fontSize: 'var(--font-size-h2)', marginBottom: 'var(--spacing-md)', color: 'white' }}>{t('nav.contact')}</h2>
                    <p className="text-large" style={{ marginBottom: 'var(--spacing-md)', color: '#a1a1a6' }}>
                        Collaborate with us on your next breakthrough.
                    </p>
                    <div style={{ fontSize: '1.2rem', marginBottom: 'var(--spacing-md)' }}>
                        <p style={{ marginBottom: '0.5rem' }}>contact@microgrow.bio</p>
                    </div>
                    <a href="mailto:contact@microgrow.bio" className="btn btn-primary" style={{ borderRadius: '30px', padding: '1rem 2.5rem' }}>
                        Contact Us
                    </a>
                </div>
            </section>
        </div>
    );
};

export default Team;
