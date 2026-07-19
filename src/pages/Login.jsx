import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaGoogle, FaGithub } from 'react-icons/fa';
import { FiMail, FiLock, FiArrowRight } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import Logo from '../components/layout/Logo';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!identifier.trim() || !password) {
      toast.error('Please enter both email/username and password');
      return;
    }

    setLoading(true);
    try {
      await login({ identifier: identifier.trim(), password });
      toast.success('Successfully logged in! Welcome back 🎉');
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid username/email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark-900 bg-grid flex items-center justify-center px-4 pt-16 pb-8 text-left">
      {/* Background glows */}
      <div className="absolute top-1/3 left-1/3 w-96 h-96 bg-primary-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/3 right-1/3 w-96 h-96 bg-accent-500/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-md relative z-10 animate-slide-up">
        {/* Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-4">
            <Logo className="w-10 h-10 hover:rotate-12 hover:scale-110" />
            <span className="font-display font-bold text-2xl text-gradient">Where To?</span>
          </Link>
          <h1 className="font-display font-bold text-2xl sm:text-3xl text-white mb-2">Welcome back</h1>
          <p className="text-white/40 text-sm">Sign in to sync with your squad</p>
        </div>

        {/* Card */}
        <div className="glass-card p-6 sm:p-8 space-y-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Username/Email Input */}
            <div>
              <label className="block text-[10px] font-semibold text-white/50 mb-1.5 uppercase tracking-wider">
                Username or Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-white/30">
                  <FiMail size={16} />
                </div>
                <input
                  type="text"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="enter username or email"
                  className="input-field pl-10 pr-4 py-3 text-sm"
                  required
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-[10px] font-semibold text-white/50 mb-1.5 uppercase tracking-wider">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-white/30">
                  <FiLock size={16} />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="input-field pl-10 pr-4 py-3 text-sm"
                  required
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-3 text-sm font-semibold flex items-center justify-center gap-2 cursor-pointer mt-6"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Sign In
                  <FiArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          {/* Visual Divider */}
          <div className="relative flex items-center justify-center my-6">
            <div className="absolute w-full border-t border-white/5" />
            <span className="relative px-3 bg-[#0d1527] text-white/30 text-xs font-medium uppercase tracking-wider">
              or continue with
            </span>
          </div>

          {/* Social OAuth Buttons */}
          <div className="grid grid-cols-2 gap-3">
            <a
              href={`${(import.meta.env.VITE_API_URL || 'http://localhost:5000/api').replace('/api', '')}/api/auth/google`}
              className="flex items-center justify-center gap-2.5 py-3 px-4 rounded-xl border border-white/10 bg-white/3 hover:bg-white/5 transition-all text-white text-xs font-bold shadow-md cursor-pointer"
            >
              <FaGoogle className="text-red-400" size={16} />
              Google
            </a>
            <a
              href={`${(import.meta.env.VITE_API_URL || 'http://localhost:5000/api').replace('/api', '')}/api/auth/github`}
              className="flex items-center justify-center gap-2.5 py-3 px-4 rounded-xl border border-white/10 bg-white/3 hover:bg-white/5 transition-all text-white text-xs font-bold shadow-md cursor-pointer"
            >
              <FaGithub className="text-white" size={16} />
              GitHub
            </a>
          </div>

          {/* Redirect to Signup */}
          <div className="pt-4 text-center border-t border-white/5">
            <p className="text-white/40 text-xs">
              New to Where To?{' '}
              <Link to="/register" className="text-primary-400 hover:text-primary-300 font-semibold hover:underline">
                Create an account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
