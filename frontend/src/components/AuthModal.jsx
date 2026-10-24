// frontend/src/components/AuthModal.jsx
import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

export const AuthModal = ({ isOpen, onClose, onSuccess, initialMode = 'login' }) => {
  const [mode, setMode] = useState(initialMode); // 'login' | 'register'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { login, register } = useAuth();

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (mode === 'register') {
      const cleanPhone = phone.replace(/^(?:\+91|91|0)/, '').trim();
      if (!/^[6-9]\d{9}$/.test(cleanPhone)) {
        setErrorMsg('Please enter a valid 10-digit Indian mobile number (e.g. 9876543210)');
        return;
      }
      if (password.length < 8) {
        setErrorMsg('Password must be at least 8 characters');
        return;
      }
    }

    setSubmitting(true);

    try {
      if (mode === 'login') {
        await login(email.trim(), password);
      } else {
        const cleanPhone = phone.replace(/^(?:\+91|91|0)/, '').trim();
        await register({ name: name.trim(), email: email.trim(), password, phone: cleanPhone });
      }
      onSuccess?.();
      onClose();
    } catch (err) {
      setErrorMsg(err.message || 'Authentication failed. Please check your credentials.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-modal-overlay" onClick={onClose}>
      <div className="auth-modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="auth-modal-close" onClick={onClose} aria-label="Close modal">
          ✕
        </button>

        <div className="auth-modal-header">
          <span className="auth-modal-brand">Evoluir · Account</span>
          <h2 className="auth-modal-title">
            {mode === 'login' ? 'Welcome Back' : 'Create Your Account'}
          </h2>
          <p className="auth-modal-sub">
            {mode === 'login'
              ? 'Sign in to access your bag, saved preferences, and checkout.'
              : 'Join Evoluir for priority dispatch and personalized shade profiles.'}
          </p>
        </div>

        {errorMsg && <div className="auth-modal-error">{errorMsg}</div>}

        <form onSubmit={handleSubmit} className="auth-modal-form">
          {mode === 'register' && (
            <>
              <div className="auth-input-group">
                <label>Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Maya Lin"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={submitting}
                />
              </div>
              <div className="auth-input-group">
                <label>Mobile Phone (10 Digits)</label>
                <input
                  type="tel"
                  required
                  placeholder="e.g. 9876543210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  disabled={submitting}
                />
              </div>
            </>
          )}

          <div className="auth-input-group">
            <label>Email Address</label>
            <input
              type="email"
              required
              placeholder="you@domain.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={submitting}
            />
          </div>

          <div className="auth-input-group">
            <label>Password {mode === 'register' ? '(Min. 8 characters)' : ''}</label>
            <input
              type="password"
              required
              minLength={mode === 'register' ? 8 : 1}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={submitting}
            />
          </div>

          <button type="submit" className="auth-submit-btn" disabled={submitting}>
            {submitting
              ? 'Please wait...'
              : mode === 'login'
              ? 'Sign In to Continue'
              : 'Create Account'}
          </button>
        </form>

        <div className="auth-modal-footer">
          {mode === 'login' ? (
            <p>
              Don't have an account?{' '}
              <button
                type="button"
                className="auth-link-btn"
                onClick={() => {
                  setErrorMsg('');
                  setMode('register');
                }}
              >
                Create Account
              </button>
            </p>
          ) : (
            <p>
              Already registered?{' '}
              <button
                type="button"
                className="auth-link-btn"
                onClick={() => {
                  setErrorMsg('');
                  setMode('login');
                }}
              >
                Sign In
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export const AuthNavButton = ({ style = {} }) => {
  const { user, isAuthenticated, authReady, logout } = useAuth();
  const [modalOpen, setModalOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!authReady) {
    return null;
  }

  if (!isAuthenticated) {
    return (
      <>
        <button
          type="button"
          onClick={() => setModalOpen(true)}
          className="auth-nav-trigger"
          style={{
            background: 'transparent',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            color: '#f5f5f7',
            padding: '7px 16px',
            borderRadius: '999px',
            fontSize: '10px',
            fontWeight: 500,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            cursor: 'pointer',
            transition: 'all 0.2s',
            ...style,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = '#f24c27';
            e.currentTarget.style.color = '#f24c27';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
            e.currentTarget.style.color = '#f5f5f7';
          }}
        >
          Sign In
        </button>
        <AuthModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
      </>
    );
  }

  const initial = user?.name ? user.name.charAt(0).toUpperCase() : 'U';
  const displayName = user?.name ? user.name.split(' ')[0] : 'Account';

  return (
    <div ref={dropdownRef} style={{ position: 'relative', display: 'inline-block', ...style }}>
      <button
        type="button"
        onClick={() => setDropdownOpen(!dropdownOpen)}
        className="auth-user-pill"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          background: 'rgba(255, 255, 255, 0.05)',
          border: '1px solid rgba(255, 255, 255, 0.15)',
          color: '#f5f5f7',
          padding: '4px 12px 4px 5px',
          borderRadius: '999px',
          fontSize: '11px',
          cursor: 'pointer',
          transition: 'all 0.2s',
        }}
      >
        <span
          style={{
            width: '20px',
            height: '20px',
            borderRadius: '50%',
            background: 'var(--accent, #f24c27)',
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '10px',
            fontWeight: 600,
          }}
        >
          {initial}
        </span>
        <span style={{ fontWeight: 400 }}>{displayName}</span>
        <span style={{ fontSize: '9px', opacity: 0.6, transform: dropdownOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>▾</span>
      </button>

      {dropdownOpen && (
        <div
          style={{
            position: 'absolute',
            top: 'calc(100% + 8px)',
            right: 0,
            minWidth: '200px',
            background: '#09090b',
            border: '1px solid rgba(255, 255, 255, 0.14)',
            borderRadius: '14px',
            padding: '14px',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.8), 0 0 20px rgba(242, 76, 39, 0.1)',
            zIndex: 9999,
          }}
        >
          <div style={{ paddingBottom: '10px', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', marginBottom: '8px' }}>
            <div style={{ fontSize: '13px', fontWeight: 500, color: '#f5f5f7' }}>{user?.name}</div>
            <div style={{ fontSize: '11px', color: '#a0a0a5', textOverflow: 'ellipsis', overflow: 'hidden' }}>{user?.email}</div>
          </div>
          <button
            type="button"
            onClick={async () => {
              setDropdownOpen(false);
              await logout();
            }}
            style={{
              width: '100%',
              background: 'transparent',
              border: 'none',
              color: '#ff6b4a',
              textAlign: 'left',
              padding: '8px 4px',
              fontSize: '12px',
              cursor: 'pointer',
              borderRadius: '6px',
              fontWeight: 500,
            }}
          >
            Sign Out
          </button>
        </div>
      )}
    </div>
  );
};

export default AuthModal;
