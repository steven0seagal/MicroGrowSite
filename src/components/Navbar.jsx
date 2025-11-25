import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
    const location = useLocation();
    const [isVisible, setIsVisible] = useState(true);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleMouseMove = (e) => {
            if (e.clientY < 60 || window.scrollY < 50) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
        };

        const handleScroll = () => {
            if (window.scrollY < 50) {
                setIsVisible(true);
            }
        };

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    const isActive = (path) => location.pathname === path;

    const navStyle = {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '1.5rem 0',
        borderBottom: '1px solid var(--color-border)',
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        zIndex: 1000,
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        backdropFilter: 'blur(10px)',
        transition: 'transform 0.3s ease-in-out',
        transform: isVisible ? 'translateY(0)' : 'translateY(-100%)',
    };

    const logoStyle = {
        fontSize: '1.5rem',
        fontWeight: '700',
        color: 'var(--color-primary)',
        letterSpacing: '-0.5px',
    };

    const linkStyle = (path) => ({
        marginLeft: '2rem',
        fontWeight: isActive(path) ? '600' : '400',
        color: isActive(path) ? 'var(--color-primary)' : 'var(--color-text-main)',
    });

    const hamburgerStyle = {
        display: 'none',
        flexDirection: 'column',
        cursor: 'pointer',
        gap: '4px',
    };

    const hamburgerLineStyle = {
        width: '25px',
        height: '3px',
        backgroundColor: 'var(--color-primary)',
        borderRadius: '2px',
        transition: 'all 0.3s ease',
    };

    const mobileMenuStyle = {
        position: 'fixed',
        top: '80px',
        left: 0,
        width: '100%',
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(10px)',
        padding: '2rem',
        display: isMobileMenuOpen ? 'flex' : 'none',
        flexDirection: 'column',
        gap: '1.5rem',
        borderBottom: '1px solid var(--color-border)',
        zIndex: 999,
    };

    return (
        <>
            <style>{`
                @media (max-width: 768px) {
                    .nav-links {
                        display: none !important;
                    }
                    .hamburger {
                        display: flex !important;
                    }
                }
            `}</style>

            <nav style={navStyle}>
                <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                    <Link to="/" style={logoStyle} onClick={() => setIsMobileMenuOpen(false)}>
                        MicroGrow
                    </Link>

                    <div className="nav-links">
                        <Link to="/" style={linkStyle('/')}>Home</Link>
                        <Link to="/products" style={linkStyle('/products')}>Products</Link>
                        <Link to="/team" style={linkStyle('/team')}>Team & Contact</Link>
                    </div>

                    <div
                        className="hamburger"
                        style={hamburgerStyle}
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    >
                        <span style={hamburgerLineStyle}></span>
                        <span style={hamburgerLineStyle}></span>
                        <span style={hamburgerLineStyle}></span>
                    </div>
                </div>
            </nav>

            {/* Mobile Menu */}
            <div style={mobileMenuStyle}>
                <Link
                    to="/"
                    style={{
                        fontSize: '1.2rem',
                        fontWeight: isActive('/') ? '600' : '400',
                        color: isActive('/') ? 'var(--color-primary)' : 'var(--color-text-main)'
                    }}
                    onClick={() => setIsMobileMenuOpen(false)}
                >
                    Home
                </Link>
                <Link
                    to="/products"
                    style={{
                        fontSize: '1.2rem',
                        fontWeight: isActive('/products') ? '600' : '400',
                        color: isActive('/products') ? 'var(--color-primary)' : 'var(--color-text-main)'
                    }}
                    onClick={() => setIsMobileMenuOpen(false)}
                >
                    Products
                </Link>
                <Link
                    to="/team"
                    style={{
                        fontSize: '1.2rem',
                        fontWeight: isActive('/team') ? '600' : '400',
                        color: isActive('/team') ? 'var(--color-primary)' : 'var(--color-text-main)'
                    }}
                    onClick={() => setIsMobileMenuOpen(false)}
                >
                    Team & Contact
                </Link>
            </div>
        </>
    );
};

export default Navbar;
