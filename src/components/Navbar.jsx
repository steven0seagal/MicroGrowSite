import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
// import './Navbar.css'; // Removed as we are using global/inline styles
// Let's stick to a simple inline style or module approach for simplicity, or just global classes.
// For now, I'll use inline styles for layout specific to this component to keep it self-contained or use the global classes.

const Navbar = () => {
    const location = useLocation();
    const [isVisible, setIsVisible] = useState(true);

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

    return (
        <nav style={navStyle}>
            <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                <Link to="/" style={logoStyle}>
                    MicroGrow
                </Link>

                <div className="nav-links">
                    <Link to="/" style={linkStyle('/')}>Home</Link>
                    <Link to="/products" style={linkStyle('/products')}>Products</Link>
                    <Link to="/team" style={linkStyle('/team')}>Team & Contact</Link>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
