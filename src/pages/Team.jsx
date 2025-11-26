import React from 'react';

const teamMembers = [
    {
        id: 1,
        name: 'Dr. Sarah Jenkins, PhD',
        role: 'CEO & Founder',
        bio: 'Former Professor of Bioengineering at Stanford University. Dr. Jenkins has over 15 years of experience in microfluidics and tissue engineering. Her research has been published in Nature and Science.',
        email: 'sarah.jenkins@microgrow.com',
        image: 'https://via.placeholder.com/300x300/367588/FFFFFF?text=Dr.+Jenkins'
    },
    {
        id: 2,
        name: 'Dr. Michael Chen, PhD',
        role: 'Head of R&D',
        bio: 'Postdoctoral Fellow at MIT Media Lab. Dr. Chen specializes in sensor integration and biocompatible materials. He holds 5 patents in micro-sensor technology.',
        email: 'michael.chen@microgrow.com',
        image: 'https://via.placeholder.com/300x300/89CFF0/FFFFFF?text=Dr.+Chen'
    },
    {
        id: 3,
        name: 'Emily Rodriguez, MSc',
        role: 'Lead Engineer',
        bio: 'Research Fellow at the Wyss Institute. Emily leads the product design team, translating complex biological requirements into manufacturable micro-devices.',
        email: 'emily.rodriguez@microgrow.com',
        image: 'https://via.placeholder.com/300x300/E0F7FA/333333?text=E.+Rodriguez'
    }
];

const Team = () => {
    return (
        <div className="fade-in-up">
            {/* Section 1: Our Team (Intro) */}
            <section className="section-fullscreen" style={{ backgroundColor: '#F5F5F7' }}>
                <div className="container text-center">
                    <h1 style={{ fontSize: 'var(--font-size-h1)', color: 'var(--color-primary)', marginBottom: 'var(--spacing-sm)' }}>
                        Our Team
                    </h1>
                    <p className="text-large" style={{ maxWidth: '700px', margin: '0 auto', color: 'var(--color-text-light)' }}>
                        Driven by science. United by innovation. Our team comprises world-class researchers and engineers dedicated to advancing biotechnology.
                    </p>
                </div>
            </section>

            {/* Section 2: Photos (Team Grid) */}
            <section className="section-fullscreen" style={{ backgroundColor: 'white' }}>
                <div className="container">
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 'var(--spacing-lg)' }}>
                        {teamMembers.map((member, index) => (
                            <div key={member.id} className={`fade-in-up delay-${index + 1}`} style={{ textAlign: 'center' }}>
                                <img
                                    src={member.image}
                                    alt={member.name}
                                    style={{
                                        width: '200px',
                                        height: '200px',
                                        borderRadius: '50%',
                                        margin: '0 auto var(--spacing-md)',
                                        objectFit: 'cover',
                                        boxShadow: '0 10px 20px rgba(0,0,0,0.1)'
                                    }}
                                />
                                <h3 style={{ fontSize: '1.75rem', marginBottom: '0.5rem', color: 'var(--color-text-main)' }}>{member.name}</h3>
                                <p style={{ color: 'var(--color-primary)', fontWeight: '600', marginBottom: '1rem', fontSize: '1.1rem' }}>{member.role}</p>
                                <p style={{ color: 'var(--color-text-light)', lineHeight: '1.6' }}>{member.bio}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Section 3: Get in Touch */}
            <section className="section-fullscreen" style={{ backgroundColor: '#1d1d1f', color: 'white' }}>
                <div className="container text-center">
                    <h2 style={{ fontSize: 'var(--font-size-h2)', marginBottom: 'var(--spacing-md)', color: 'white' }}>Get in Touch</h2>
                    <p className="text-large" style={{ marginBottom: 'var(--spacing-md)', color: '#a1a1a6' }}>
                        Collaborate with us on your next breakthrough.
                    </p>
                    <div style={{ fontSize: '1.2rem', marginBottom: 'var(--spacing-md)' }}>
                        <p style={{ marginBottom: '0.5rem' }}>info@microgrow.com</p>
                        <p>+1 (555) 123-4567</p>
                    </div>
                    <a href="mailto:info@microgrow.com" className="btn btn-primary" style={{ borderRadius: '30px', padding: '1rem 2.5rem' }}>
                        Contact Us
                    </a>
                </div>
            </section>
        </div>
    );
};

export default Team;
