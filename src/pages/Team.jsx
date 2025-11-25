import React from 'react';

const teamMembers = [
    {
        id: 1,
        name: 'Dr. Sarah Jenkins',
        role: 'CEO & Founder',
        email: 'sarah.jenkins@microgrow.com',
        image: 'https://via.placeholder.com/150/367588/FFFFFF?text=SJ'
    },
    {
        id: 2,
        name: 'Michael Chen',
        role: 'Head of R&D',
        email: 'michael.chen@microgrow.com',
        image: 'https://via.placeholder.com/150/89CFF0/FFFFFF?text=MC'
    },
    {
        id: 3,
        name: 'Emily Rodriguez',
        role: 'Lead Engineer',
        email: 'emily.rodriguez@microgrow.com',
        image: 'https://via.placeholder.com/150/E0F7FA/333333?text=ER'
    }
];

const Team = () => {
    return (
        <div className="fade-in container section">
            <h1 style={{ color: 'var(--color-primary)', textAlign: 'center', marginBottom: 'var(--spacing-md)' }}>Meet Our Team</h1>

            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                gap: 'var(--spacing-md)',
                marginBottom: 'var(--spacing-lg)'
            }}>
                {teamMembers.map(member => (
                    <div key={member.id} style={{
                        textAlign: 'center',
                        padding: '2rem',
                        border: '1px solid var(--color-border)',
                        borderRadius: '8px',
                        backgroundColor: 'white'
                    }}>
                        <img
                            src={member.image}
                            alt={member.name}
                            style={{
                                width: '120px',
                                height: '120px',
                                borderRadius: '50%',
                                margin: '0 auto var(--spacing-sm)',
                                objectFit: 'cover'
                            }}
                        />
                        <h3 style={{ color: 'var(--color-text-main)', marginBottom: '0.25rem' }}>{member.name}</h3>
                        <p style={{ color: 'var(--color-primary)', fontWeight: '500', marginBottom: '0.5rem' }}>{member.role}</p>
                        <a href={`mailto:${member.email}`} style={{ fontSize: '0.9rem', color: 'var(--color-text-light)' }}>
                            {member.email}
                        </a>
                    </div>
                ))}
            </div>

            <div style={{
                backgroundColor: 'var(--color-accent)',
                padding: 'var(--spacing-md)',
                borderRadius: '8px',
                textAlign: 'center'
            }}>
                <h2 style={{ color: 'var(--color-primary)', marginBottom: 'var(--spacing-sm)' }}>Contact Us</h2>
                <p style={{ marginBottom: 'var(--spacing-sm)', color: 'var(--color-text-light)' }}>
                    Interested in our technology? Get in touch with us.
                </p>
                <p style={{ fontWeight: '500' }}>
                    Email: <a href="mailto:info@microgrow.com">info@microgrow.com</a>
                </p>
                <p style={{ fontWeight: '500' }}>
                    Phone: +1 (555) 123-4567
                </p>
                <div style={{ marginTop: 'var(--spacing-sm)' }}>
                    <p>Headquarters:</p>
                    <p style={{ color: 'var(--color-text-light)' }}>123 Biotech Avenue, Innovation Park, CA 94000</p>
                </div>
            </div>
        </div>
    );
};

export default Team;
