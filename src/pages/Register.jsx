import React, { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaGoogle, FaGithub } from 'react-icons/fa';
import { FiUser, FiMail, FiLock, FiArrowRight, FiCheck, FiSend, FiX } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/authService';
import { toast } from 'react-toastify';
import Logo from '../components/layout/Logo';

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  
  // Registration form state
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  // OTP Verification overlay state
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otpCode, setOtpCode] = useState(['', '', '', '', '', '']);
  const [verifying, setVerifying] = useState(false);
  const [devOtp, setDevOtp] = useState(''); // Stores code if returned in dev response
  const otpInputs = useRef([]);

  // Validations & OTP Dispatch
  const handleSendCode = async (e) => {
    e.preventDefault();

    if (!username.trim() || !email.trim() || !password || !confirmPassword) {
      toast.error('Please fill in all registration fields');
      return;
    }

    // Instagram format username validator
    const usernameRegex = /^[a-zA-Z0-9_](?:[a-zA-Z0-9_.]*[a-zA-Z0-9_])?$/;
    if (!usernameRegex.test(username.trim()) || username.includes('..')) {
      toast.error('Username can only contain alphanumeric characters, underscores, and single periods, and cannot start or end with a period');
      return;
    }

    // Enforce Google email domain
    if (!email.toLowerCase().endsWith('@gmail.com')) {
      toast.error('Only valid Google emails (@gmail.com) are allowed');
      return;
    }

    if (password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      const data = await authService.sendOTP(email);
      toast.success(data.message || 'Verification code sent!');
      
      // Store development verification code if returned in payload (no SMTP configured local dev)
      if (data.code) {
        setDevOtp(data.code);
        // Pre-fill otp inputs to make local verification frictionless!
        const digits = data.code.split('');
        const newOtp = [...otpCode];
        digits.forEach((d, i) => { newOtp[i] = d; });
        setOtpCode(newOtp);
      } else {
        setDevOtp('');
        setOtpCode(['', '', '', '', '', '']);
      }
      
      setShowOtpModal(true);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send verification email');
    } finally {
      setLoading(false);
    }
  };

  // OTP inputs handler
  const handleOtpChange = (index, value) => {
    const v = value.replace(/[^0-9]/g, '');
    if (!v && !otpCode[index]) return;

    const newOtp = [...otpCode];
    newOtp[index] = v.slice(-1);
    setOtpCode(newOtp);

    // Auto-advance cursor
    if (v && index < 5) otpInputs.current[index + 1]?.focus();
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace') {
      if (otpCode[index]) {
        const newOtp = [...otpCode];
        newOtp[index] = '';
        setOtpCode(newOtp);
      } else if (index > 0) {
        otpInputs.current[index - 1]?.focus();
      }
    }
  };

  const handleOtpPaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/[^0-9]/g, '').slice(0, 6);
    const newOtp = [...otpCode];
    pasted.split('').forEach((char, i) => { newOtp[i] = char; });
    setOtpCode(newOtp);
    otpInputs.current[Math.min(pasted.length, 5)]?.focus();
  };

  // Submit complete signup registration
  const handleVerifyAndSignup = async (e) => {
    e.preventDefault();
    const fullCode = otpCode.join('');
    if (fullCode.length < 6) {
      toast.error('Please enter the 6-digit verification code');
      return;
    }

    setVerifying(true);
    try {
      await register({
        username: username.trim(),
        email: email.toLowerCase().trim(),
        password,
        code: fullCode,
      });
      toast.success('Account created successfully! Welcome onboard 🚀');
      setShowOtpModal(false);
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Verification failed. Code might be invalid or expired.');
    } finally {
      setVerifying(false);
    }
  };

  const handleResendOtp = async () => {
    try {
      const data = await authService.sendOTP(email);
      toast.success(data.message || 'Verification code resent!');
      if (data.code) {
        setDevOtp(data.code);
        const digits = data.code.split('');
        const newOtp = [...otpCode];
        digits.forEach((d, i) => { newOtp[i] = d; });
        setOtpCode(newOtp);
      }
    } catch (err) {
      toast.error('Failed to resend code');
    }
  };

  return (
    <div className="min-h-screen bg-dark-900 bg-grid flex items-center justify-center px-4 pt-16 pb-8 text-left">
      {/* Background glows */}
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-accent-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-primary-500/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-md relative z-10 animate-slide-up">
        {/* Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-4">
            <Logo className="w-10 h-10 hover:rotate-12 hover:scale-110" />
            <span className="font-display font-bold text-2xl text-gradient">Where To?</span>
          </Link>
          <h1 className="font-display font-bold text-2xl sm:text-3xl text-white mb-2">Create account</h1>
          <p className="text-white/40 text-sm">Join the collaborative squad hubs</p>
        </div>

        {/* Card */}
        <div className="glass-card p-6 sm:p-8 space-y-6">
          <form onSubmit={handleSendCode} className="space-y-4">
            {/* Username Input */}
            <div>
              <label className="block text-[10px] font-semibold text-white/50 mb-1.5 uppercase tracking-wider">
                Username
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-white/30">
                  <FiUser size={16} />
                </div>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="e.g. yourname"
                  className="input-field pl-10 pr-4 py-3 text-sm"
                  required
                />
              </div>
            </div>

            {/* Email Input */}
            <div>
              <label className="block text-[10px] font-semibold text-white/50 mb-1.5 uppercase tracking-wider">
                Google Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-white/30">
                  <FiMail size={16} />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@gmail.com"
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
                  placeholder="•••••••• (min 6 chars)"
                  className="input-field pl-10 pr-4 py-3 text-sm"
                  required
                />
              </div>
            </div>

            {/* Confirm Password Input */}
            <div>
              <label className="block text-[10px] font-semibold text-white/50 mb-1.5 uppercase tracking-wider">
                Confirm Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-white/30">
                  <FiLock size={16} />
                </div>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="input-field pl-10 pr-4 py-3 text-sm"
                  required
                />
              </div>
            </div>

            {/* Submit / Trigger code modal */}
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-3 text-sm font-semibold flex items-center justify-center gap-2 cursor-pointer mt-6"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Send Verification Code
                  <FiSend size={15} />
                </>
              )}
            </button>
          </form>

          {/* Visual Divider */}
          <div className="relative flex items-center justify-center my-6">
            <div className="absolute w-full border-t border-white/5" />
            <span className="relative px-3 bg-dark-900 text-white/30 text-xs font-medium uppercase tracking-wider">
              or sign up with
            </span>
          </div>

          {/* OAuth options */}
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

          {/* Redirect back to Login */}
          <div className="pt-4 text-center border-t border-white/5">
            <p className="text-white/40 text-xs">
              Already have an account?{' '}
              <Link to="/login" className="text-primary-400 hover:text-primary-300 font-semibold hover:underline">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* OTP MODAL OVERLAY */}
      {showOtpModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-dark-950/80 backdrop-blur-md">
          <div className="glass-card w-full max-w-sm p-6 sm:p-8 animate-scale-in relative border border-white/10 shadow-2xl bg-dark-900 text-center">
            
            {/* Close button */}
            <button 
              onClick={() => setShowOtpModal(false)}
              className="absolute top-4 right-4 text-white/40 hover:text-white transition-colors cursor-pointer p-1"
            >
              <FiX size={18} />
            </button>

            <div className="text-3xl mb-3">✉️</div>
            <h3 className="font-display font-bold text-white text-lg">Verify your email</h3>
            <p className="text-white/40 text-xs mt-1 mb-6 leading-relaxed">
              We sent a 6-digit verification code to <br />
              <span className="text-primary-300 font-semibold">{email}</span>
            </p>

            <form onSubmit={handleVerifyAndSignup} className="space-y-6">
              {/* Digit code input row */}
              <div className="flex justify-center gap-2" onPaste={handleOtpPaste}>
                {otpCode.map((digit, i) => (
                  <input
                    key={i}
                    ref={(el) => (otpInputs.current[i] = el)}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(i, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(i, e)}
                    className={`w-10 h-12 rounded-xl text-center text-lg font-display font-bold
                      bg-dark-800 border-2 text-white outline-none transition-all duration-200
                      ${digit ? 'border-primary-500 text-primary-300' : 'border-white/10 focus:border-primary-500/50'}`}
                  />
                ))}
              </div>

              {/* Development warning badge */}
              {devOtp && (
                <div className="py-2.5 px-3 rounded-lg bg-primary-500/10 border border-primary-500/20 text-left">
                  <p className="text-[9px] font-semibold text-primary-400 uppercase tracking-wider mb-1">
                    💻 Development Mode Alert:
                  </p>
                  <p className="text-white/70 text-xs">
                    SMTP not configured. Verification code is: <span className="font-mono font-bold text-primary-300 tracking-wider text-sm">{devOtp}</span>
                  </p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="space-y-3 pt-2">
                <button
                  type="submit"
                  disabled={verifying}
                  className="btn-primary w-full py-2.5 text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  {verifying ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <FiCheck size={14} />
                      Verify & Complete Sign Up
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={handleResendOtp}
                  className="w-full text-center text-[11px] text-white/40 hover:text-white transition-colors py-1 cursor-pointer font-medium"
                >
                  Resend code
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Register;
