import { useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

const OAuthSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { loginWithToken } = useAuth();
  const hasLogged = useRef(false);

  useEffect(() => {
    if (hasLogged.current) return;

    const token = searchParams.get('token');
    if (token) {
      hasLogged.current = true;
      loginWithToken(token);
      toast.success('Successfully logged in!');
      navigate('/');
    } else {
      hasLogged.current = true;
      toast.error('Authentication failed');
      navigate('/login');
    }
  }, [searchParams, navigate, loginWithToken]);

  return (
    <div className="min-h-screen bg-dark-900 flex items-center justify-center">
      <div className="text-center">
        <div className="w-10 h-10 border-2 border-primary-500/30 border-t-primary-500 rounded-full animate-spin mx-auto mb-4" />
        <p className="text-white/40">Completing login...</p>
      </div>
    </div>
  );
};

export default OAuthSuccess;
