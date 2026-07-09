import React from 'react';
import { Link } from 'react-router-dom';
import { FaGoogle, FaGithub } from 'react-icons/fa';
import Logo from '../components/layout/Logo';

const Register = () => {
  return (
    <div className="min-h-screen bg-dark-900 bg-grid flex items-center justify-center px-4 pt-16 pb-8">
      {/* Background glows */}
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-accent-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-primary-500/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-md relative z-10 animate-slide-up">
        {/* Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-6">
            <Logo className="w-10 h-10 hover:rotate-12 hover:scale-110" />
            <span className="font-display font-bold text-2xl text-gradient">Where To?</span>
          </Link>
          <h1 className="font-display font-bold text-3xl text-white mb-2">Create your account</h1>
          <p className="text-white/40">Join your squad securely on Where To?</p>
        </div>

        {/* OAuth Buttons Card */}
        <div className="glass-card p-8 space-y-6">
          <p className="text-white/50 text-sm text-center leading-relaxed">
            Create an account instantly using your Google or GitHub profile. No passwords required.
          </p>

          <div className="space-y-3 pt-2">
            <a
              href={`${(import.meta.env.VITE_API_URL || 'http://localhost:5000/api').replace('/api', '')}/api/auth/google`}
              className="flex items-center justify-center gap-3 py-3.5 px-4 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition-all text-white text-base font-semibold hover:-translate-y-0.5 shadow-md"
            >
              <FaGoogle className="text-red-400" size={20} />
              Sign up with Google
            </a>
            <a
              href={`${(import.meta.env.VITE_API_URL || 'http://localhost:5000/api').replace('/api', '')}/api/auth/github`}
              className="flex items-center justify-center gap-3 py-3.5 px-4 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition-all text-white text-base font-semibold hover:-translate-y-0.5 shadow-md"
            >
              <FaGithub className="text-white" size={20} />
              Sign up with GitHub
            </a>
          </div>

          <div className="pt-4 text-center border-t border-white/5">
            <p className="text-white/35 text-xs leading-relaxed">
              By signing up, you agree to Where To's Terms of Service and Privacy Policy. Traditional email signups are disabled to prevent spam.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
