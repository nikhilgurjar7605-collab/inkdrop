"use client";

import React, { useState } from 'react';
import { X, Send, Mail, User, Eye, EyeOff, Lock, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';

interface LoginModalProps {
  open: boolean;
  onClose: () => void;
}

export function LoginModal({ open, onClose }: LoginModalProps) {
  const [mode, setMode] = useState<'landing' | 'signup' | 'login'>('landing');
  const [showPass, setShowPass] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const { login, signup, loginAsGuest } = useAuthStore();

  const resetForm = () => {
    setName('');
    setEmail('');
    setPassword('');
    setError('');
    setSuccess('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (mode === 'signup') {
      if (!name.trim() || !email.trim() || !password.trim()) {
        setError('Please fill in all fields');
        return;
      }
      if (password.length < 4) {
        setError('Password must be at least 4 characters');
        return;
      }
      const ok = signup(name.trim(), email.trim(), password);
      if (!ok) {
        setError('An account with this email already exists');
        return;
      }
      setSuccess('Account created! Welcome to INKDROP 🎉');
      setTimeout(() => { resetForm(); onClose(); }, 1200);
    } else {
      if (!email.trim() || !password.trim()) {
        setError('Please fill in all fields');
        return;
      }
      const ok = login(email.trim(), password);
      if (!ok) {
        setError('Invalid email or password');
        return;
      }
      setSuccess('Welcome back! 🎉');
      setTimeout(() => { resetForm(); onClose(); }, 800);
    }
  };

  const handleGuest = () => {
    loginAsGuest();
    resetForm();
    onClose();
  };

  const handleClose = () => {
    resetForm();
    setMode('landing');
    onClose();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="relative w-full max-w-md bg-background-surface border border-border-subtle rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">

        {/* Top accent bar */}
        <div className="h-1 w-full bg-accent" />

        <div className="p-6">
          <button onClick={handleClose} className="absolute top-6 right-6 text-text-secondary hover:text-text-primary transition-colors">
            <X className="w-5 h-5" />
          </button>

          <div className="text-center mb-8">
            <h2 className="font-heading text-3xl font-bold mb-1">
              INK<span className="text-accent">DROP</span>
            </h2>
            <p className="text-text-secondary text-sm">
              {mode === 'landing' && 'Your infinite manga universe awaits'}
              {mode === 'signup' && 'Create your free account'}
              {mode === 'login' && 'Welcome back, reader'}
            </p>
          </div>

          {/* Error / Success messages */}
          {error && (
            <div className="mb-4 flex items-center gap-2 bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-md px-3 py-2.5">
              <AlertCircle className="w-4 h-4 shrink-0" /> {error}
            </div>
          )}
          {success && (
            <div className="mb-4 flex items-center gap-2 bg-green-500/10 border border-green-500/30 text-green-400 text-sm rounded-md px-3 py-2.5">
              <CheckCircle2 className="w-4 h-4 shrink-0" /> {success}
            </div>
          )}

          {mode === 'landing' && (
            <div className="flex flex-col gap-3">
              {/* Telegram */}
              <button
                onClick={() => alert('Telegram OAuth — integrate with your Telegram bot token')}
                className="w-full flex items-center gap-3 bg-[#2AABEE]/10 border border-[#2AABEE]/30 text-text-primary font-medium h-12 rounded-md px-4 hover:bg-[#2AABEE]/20 transition-colors"
              >
                <Send className="w-5 h-5 text-[#2AABEE]" />
                <span className="flex-1 text-left">Continue with Telegram</span>
              </button>

              {/* Google */}
              <button
                onClick={() => alert('Google OAuth — integrate with Google Cloud credentials')}
                className="w-full flex items-center gap-3 bg-background-elevated border border-border text-text-primary font-medium h-12 rounded-md px-4 hover:bg-background-hover transition-colors"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                <span className="flex-1 text-left">Continue with Google</span>
              </button>

              <div className="relative flex items-center py-3">
                <div className="flex-grow border-t border-border-subtle" />
                <span className="flex-shrink-0 mx-4 text-text-muted text-xs uppercase tracking-widest font-bold">Or</span>
                <div className="flex-grow border-t border-border-subtle" />
              </div>

              <button
                onClick={() => { resetForm(); setMode('signup'); }}
                className="w-full bg-accent text-black font-bold h-12 rounded-md hover:bg-accent-hover transition-colors"
              >
                Sign Up with Email
              </button>
              <button
                onClick={() => { resetForm(); setMode('login'); }}
                className="w-full bg-transparent border border-border text-text-primary font-medium h-12 rounded-md hover:bg-background-elevated transition-colors"
              >
                Log In
              </button>

              <div className="relative flex items-center py-1">
                <div className="flex-grow border-t border-border-subtle" />
                <span className="flex-shrink-0 mx-4 text-text-muted text-xs uppercase tracking-widest font-bold">Or</span>
                <div className="flex-grow border-t border-border-subtle" />
              </div>

              <button
                onClick={handleGuest}
                className="w-full flex items-center justify-center gap-2 text-text-secondary text-sm hover:text-text-primary transition-colors py-2"
              >
                <User className="w-4 h-4" /> Continue as Guest
              </button>
            </div>
          )}

          {(mode === 'signup' || mode === 'login') && (
            <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
              {mode === 'signup' && (
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-text-secondary uppercase tracking-wider">Username</label>
                  <div className="flex items-center gap-2 bg-background-elevated border border-border rounded-md px-3 h-11 focus-within:ring-2 focus-within:ring-accent">
                    <User className="w-4 h-4 text-text-muted" />
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="mangareader99"
                      className="flex-1 bg-transparent text-text-primary text-sm outline-none placeholder:text-text-muted"
                    />
                  </div>
                </div>
              )}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-text-secondary uppercase tracking-wider">Email</label>
                <div className="flex items-center gap-2 bg-background-elevated border border-border rounded-md px-3 h-11 focus-within:ring-2 focus-within:ring-accent">
                  <Mail className="w-4 h-4 text-text-muted" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@email.com"
                    className="flex-1 bg-transparent text-text-primary text-sm outline-none placeholder:text-text-muted"
                  />
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-text-secondary uppercase tracking-wider">Password</label>
                <div className="flex items-center gap-2 bg-background-elevated border border-border rounded-md px-3 h-11 focus-within:ring-2 focus-within:ring-accent">
                  <Lock className="w-4 h-4 text-text-muted" />
                  <input
                    type={showPass ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="flex-1 bg-transparent text-text-primary text-sm outline-none placeholder:text-text-muted"
                  />
                  <button type="button" onClick={() => setShowPass(v => !v)} className="text-text-muted hover:text-text-primary">
                    {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <button type="submit" className="w-full bg-accent text-black font-bold h-12 rounded-md hover:bg-accent-hover transition-colors mt-2">
                {mode === 'signup' ? 'Create Account' : 'Sign In'}
              </button>

              <p className="text-center text-sm text-text-muted">
                {mode === 'signup' ? (
                  <>Already have an account? <button type="button" onClick={() => { resetForm(); setMode('login'); }} className="text-accent hover:underline">Log In</button></>
                ) : (
                  <>Don&apos;t have an account? <button type="button" onClick={() => { resetForm(); setMode('signup'); }} className="text-accent hover:underline">Sign Up</button></>
                )}
              </p>

              <button type="button" onClick={() => { resetForm(); setMode('landing'); }} className="text-text-secondary text-sm hover:text-text-primary transition-colors text-center">
                ← Back
              </button>
            </form>
          )}

          <p className="text-xs text-text-muted text-center mt-6">
            By continuing, you agree to our Terms of Service and Privacy Policy.
          </p>
        </div>
      </div>
    </div>
  );
}
