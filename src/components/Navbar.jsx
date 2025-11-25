import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
// import './Navbar.css'; // Removed as we are using global/inline styles
// Let's stick to a simple inline style or module approach for simplicity, or just global classes.
// For now, I'll use inline styles for layout specific to this component to keep it self-contained or use the global classes.

const Navbar = () => {
    const location = useLocation();
    const [isOpen, setIsOpen] = useState(false);

    const isActive = (path) => location.pathname === path;

    const navStyle = {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '1.5rem 0',
        borderBottom: '1px solid var(--color-border)',
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
        <nav className="container" style={navStyle}>
            <Link to="/" style={logoStyle}>
                MicroGrow
            </Link>

            <div className="nav-links">
                <Link to="/" style={linkStyle('/')}>Home</Link>
                <Link to="/products" style={linkStyle('/products')}>Products</Link>
                <Link to="/team" style={linkStyle('/team')}>Team & Contact</Link>
            </div>
        </nav>
    );
};

export default Navbar;
