import React from 'react';

const Footer = () => {
    const footerStyle = {
        backgroundColor: 'var(--color-accent)',
        padding: '3rem 0',
        marginTop: 'auto', // Push to bottom if flex container
        scrollSnapAlign: 'start',
    };

    const contentStyle = {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
    };

    return (
        <footer style={footerStyle}>
            <div className="container" style={contentStyle}>
                <div>
                    <h4 style={{ color: 'var(--color-primary)', marginBottom: '0.5rem' }}>MicroGrow</h4>
                    <p style={{ fontSize: '0.9rem', color: 'var(--color-text-light)' }}>
                        Innovating cell culture technology.
                    </p>
                </div>

                <div style={{ display: 'flex', gap: '1rem' }}>
                    {/* Social Media Placeholders */}
                    <a href="#" aria-label="LinkedIn">LinkedIn</a>
                    <a href="#" aria-label="Twitter">Twitter</a>
                    <a href="#" aria-label="Instagram">Instagram</a>
                </div>

                <div style={{ width: '100%', marginTop: '2rem', textAlign: 'center', fontSize: '0.8rem', color: 'var(--color-text-light)' }}>
                    &copy; {new Date().getFullYear()} MicroGrow. All rights reserved.
                </div>
            </div>
        </footer>
    );
};

export default Footer;
