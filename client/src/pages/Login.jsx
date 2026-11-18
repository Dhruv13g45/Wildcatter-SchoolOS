import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setCredentials } from '../store/authSlice.js';
import { ThemeToggle } from '../components/ThemeToggle.jsx';
import api from '../api/client.js';
import { School, LogIn, ArrowLeft } from 'lucide-react';

export const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  // If already logged in, reroute immediately to home dashboard
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/app', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e?.preventDefault();
    if (!email || !password) {
      setError('Please provide both your registered email and password.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await api.post('/auth/login', {
        email: email.trim().toLowerCase(),
        password,
      });

      dispatch(setCredentials(res.data));
      navigate('/app', { replace: true });
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Login failed';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleCredentialResponse = async (response) => {
    setLoading(true);
    setError('');
    try {
      const res = await api.post('/auth/google', {
        credential: response.credential,
        role: 'Admin',
      });
      dispatch(setCredentials(res.data));
      navigate('/app', { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || 'Google authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = () => {
    const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

    if (window.google?.accounts?.id) {
      window.google.accounts.id.initialize({
        client_id: googleClientId,
        callback: handleGoogleCredentialResponse,
        auto_select: false,
      });

      // Prompt the real Google Account selection popup
      window.google.accounts.id.prompt((notification) => {
        if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
          // Fallback to OAuth 2.0 Token Client popup if One-Tap prompt is suppressed
          try {
            const tokenClient = window.google.accounts.oauth2.initTokenClient({
              client_id: googleClientId,
              scope: 'email profile openid',
              callback: async (tokenResponse) => {
                if (tokenResponse.access_token) {
                  setLoading(true);
                  try {
                    const userInfoRes = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
                      headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
                    });
                    const userInfo = await userInfoRes.json();
                    const res = await api.post('/auth/google', {
                      email: userInfo.email,
                      name: userInfo.name,
                      avatar: userInfo.picture,
                      role: 'Admin',
                    });
                    dispatch(setCredentials(res.data));
                    navigate('/app', { replace: true });
                  } catch (e) {
                    setError('Failed to fetch Google profile');
                  } finally {
                    setLoading(false);
                  }
                }
              },
            });
            tokenClient.requestAccessToken();
          } catch (oauthErr) {
            console.error('Google OAuth init error:', oauthErr);
          }
        }
      });
    } else {
      // Direct OAuth 2.0 Web Popup fallback if script is not yet initialized
      const redirectUri = window.location.origin;
      const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${encodeURIComponent(
        googleClientId
      )}&redirect_uri=${encodeURIComponent(
        redirectUri
      )}&response_type=token&scope=email%20profile%20openid&prompt=select_account`;
      
      const width = 500;
      const height = 600;
      const left = window.screenX + (window.outerWidth - width) / 2;
      const top = window.screenY + (window.outerHeight - height) / 2;
      
      const popup = window.open(authUrl, 'GoogleSignIn', `width=${width},height=${height},left=${left},top=${top}`);
      
      const pollTimer = setInterval(() => {
        try {
          if (!popup || popup.closed) {
            clearInterval(pollTimer);
          } else if (popup.location.href.includes('access_token')) {
            const hash = popup.location.hash.substring(1);
            const params = new URLSearchParams(hash);
            const accessToken = params.get('access_token');
            popup.close();
            clearInterval(pollTimer);
            if (accessToken) {
              setLoading(true);
              fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
                headers: { Authorization: `Bearer ${accessToken}` },
              })
                .then((r) => r.json())
                .then((u) =>
                  api.post('/auth/google', {
                    email: u.email,
                    name: u.name,
                    avatar: u.picture,
                    role: 'Admin',
                  })
                )
                .then((res) => {
                  dispatch(setCredentials(res.data));
                  navigate('/app', { replace: true });
                })
                .catch(() => setError('Google authentication failed'))
                .finally(() => setLoading(false));
            }
          }
        } catch (e) {
          // Cross-origin access until redirect back
        }
      }, 500);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 sm:p-10 bg-slate-50 dark:bg-zinc-950 transition-colors duration-200">
      <div className="w-full max-w-lg p-8 sm:p-12 rounded-3xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-xl space-y-8">
        {/* Back Link & Theme Toggle with Breathing Room */}
        <div className="flex items-center justify-between">
          <Link
            to="/"
            className="flex items-center space-x-2 text-xs font-medium text-slate-500 hover:text-indigo-600 dark:hover:text-white transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </Link>

          <div className="flex items-center space-x-3">
            <span className="text-xs font-semibold text-slate-500 dark:text-zinc-400">Secure Sign In</span>
            <ThemeToggle />
          </div>
        </div>

        {/* Brand Header */}
        <div className="text-center space-y-3">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-lg shadow-indigo-600/30">
            <School className="w-8 h-8" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Sign In to School<span className="text-indigo-600 dark:text-indigo-400">OS</span>
          </h1>
          <p className="text-sm text-slate-500 dark:text-zinc-400 max-w-sm mx-auto leading-relaxed">
            Enter your school email and password to access your dashboard.
          </p>
        </div>

        {error && (
          <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-300 text-xs text-center font-medium">
            {error}
          </div>
        )}

        {/* Traditional Form */}
        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="text-xs font-semibold text-slate-700 dark:text-zinc-300 block mb-1.5">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. principal@greenwood.edu"
              className="w-full bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-2xl px-4 py-3 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500 transition"
              required
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 dark:text-zinc-300 block mb-1.5">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-2xl px-4 py-3 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500 transition"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 px-6 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm rounded-2xl shadow-lg shadow-indigo-600/30 transition duration-200 flex items-center justify-center space-x-2 disabled:opacity-50"
          >
            <LogIn className="w-4 h-4" />
            <span>{loading ? 'Checking Credentials...' : 'Sign In'}</span>
          </button>
        </form>

        <div className="relative flex items-center justify-center pt-2">
          <div className="border-t border-slate-200 dark:border-zinc-800 w-full" />
          <span className="bg-white dark:bg-zinc-900 px-4 text-xs font-bold uppercase tracking-wider text-slate-400">
            or Single Sign-On
          </span>
          <div className="border-t border-slate-200 dark:border-zinc-800 w-full" />
        </div>

        {/* Google Authentication */}
        <button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={loading}
          className="w-full py-3 px-4 bg-slate-50 hover:bg-slate-100 dark:bg-zinc-950 dark:hover:bg-zinc-800 border border-slate-200 dark:border-zinc-800 text-slate-700 dark:text-zinc-200 font-semibold text-sm rounded-2xl shadow-sm transition duration-200 flex items-center justify-center space-x-3"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
          <span>Continue with Google</span>
        </button>

        <p className="text-center text-sm text-slate-500 dark:text-zinc-400">
          Don't have an account yet?{' '}
          <Link to="/register" className="text-indigo-600 dark:text-indigo-400 font-bold hover:underline">
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
};
