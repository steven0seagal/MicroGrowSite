import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import NavbarLogo from '../assets/navbar_logo.jpg';
import '../index.css';
const Navbar = () => {
    const location = useLocation();
    const { t, i18n } = useTranslation();
    const [isVisible, setIsVisible] = useState(true);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const toggleLanguage = () => {
        const newLang = i18n.language === 'en' ? 'pl' : 'en';
        i18n.changeLanguage(newLang);
    };

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
        padding: '1rem 0',
        borderBottom: '1px solid var(--color-border)',
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        zIndex: 1000,
        backgroundColor: '#FFFFFF',
        transition: 'transform 0.3s ease-in-out',
        transform: isVisible ? 'translateY(0)' : 'translateY(-100%)',
    };

    const linkStyle = (path) => ({
        marginLeft: '2rem',
        fontWeight: isActive(path) ? '600' : '400',
        color: isActive(path) ? 'var(--color-primary)' : 'var(--color-text-main)',
        fontSize: '1.1rem',
    });

    const hamburgerStyle = {
        display: 'none',
        flexDirection: 'column',
        cursor: 'pointer',
        gap: '6px',
    };

    const hamburgerLineStyle = {
        width: '30px',
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
        backgroundColor: 'rgba(255, 255, 255, 0.98)',
        backdropFilter: 'blur(10px)',
        padding: '2rem',
        display: isMobileMenuOpen ? 'flex' : 'none',
        flexDirection: 'column',
        gap: '2rem',
        borderBottom: '1px solid var(--color-border)',
        zIndex: 999,
        alignItems: 'center',
    };

    return (
        <>
            <nav style={navStyle}>
                <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                    <Link to="/" onClick={() => setIsMobileMenuOpen(false)} style={{ display: 'flex', alignItems: 'center' }}>
                        <img src={NavbarLogo} alt="MicroGrow" className="navbar-logo" />
                    </Link>

                    <div className="nav-links">
                        <Link to="/" style={linkStyle('/')}>{t('nav.home')}</Link>
                        <Link to="/products" style={linkStyle('/products')}>{t('nav.products')}</Link>
                        <Link to="/team" style={linkStyle('/team')}>{t('nav.team')}</Link>
                        <button
                            onClick={toggleLanguage}
                            className="btn btn-outline"
                            style={{
                                marginLeft: '2rem',
                                padding: '0.5rem 1rem',
                                fontSize: '0.9rem',
                                borderRadius: '20px'
                            }}
                        >
                            {i18n.language === 'en' ? 'PL' : 'EN'}
                        </button>
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
                        fontSize: '1.5rem',
                        fontWeight: isActive('/') ? '600' : '400',
                        color: isActive('/') ? 'var(--color-primary)' : 'var(--color-text-main)'
                    }}
                    onClick={() => setIsMobileMenuOpen(false)}
                >
                    {t('nav.home')}
                </Link>
                <Link
                    to="/products"
                    style={{
                        fontSize: '1.5rem',
                        fontWeight: isActive('/products') ? '600' : '400',
                        color: isActive('/products') ? 'var(--color-primary)' : 'var(--color-text-main)'
                    }}
                    onClick={() => setIsMobileMenuOpen(false)}
                >
                    {t('nav.products')}
                </Link>
                <Link
                    to="/team"
                    style={{
                        fontSize: '1.5rem',
                        fontWeight: isActive('/team') ? '600' : '400',
                        color: isActive('/team') ? 'var(--color-primary)' : 'var(--color-text-main)'
                    }}
                    onClick={() => setIsMobileMenuOpen(false)}
                >
                    {t('nav.team')}
                </Link>
                <button
                    onClick={() => { toggleLanguage(); setIsMobileMenuOpen(false); }}
                    className="btn btn-outline"
                    style={{
                        padding: '0.75rem 2rem',
                        fontSize: '1.2rem',
                        borderRadius: '30px',
                        marginTop: '1rem'
                    }}
                >
                    {i18n.language === 'en' ? 'Polski' : 'English'}
                </button>
            </div>
        </>
    );
};

export default Navbar;
