import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { KeyRound, Mail, User as UserIcon, LogIn, UserPlus } from 'lucide-react';

export default function Auth() {
  const navigate = useNavigate();
  const { login, signup, user, loading, error, setError } = useAuth();
  const { redirectAfterAuth, setRedirectAfterAuth } = useCart();

  const [isLogin, setIsLogin] = useState(true);
  const [usernameInput, setUsernameInput] = useState('');
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [formError, setFormError] = useState(null);

  // If user is already logged in, redirect them away
  React.useEffect(() => {
    if (user) {
      const destination = redirectAfterAuth || '/';
      setRedirectAfterAuth(null);
      navigate(destination, { replace: true });
    }
  }, [user, navigate, redirectAfterAuth, setRedirectAfterAuth]);

  const handleTabChange = (loginTab) => {
    setIsLogin(loginTab);
    setFormError(null);
    setError(null); // clear AuthContext error
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError(null);

    // Basic Validation
    if (!emailInput || !passwordInput) {
      setFormError('Please fill in email and password credentials.');
      return;
    }
    if (!isLogin && !usernameInput) {
      setFormError('Please provide a ledger username.');
      return;
    }

    try {
      if (isLogin) {
        await login(emailInput, passwordInput);
      } else {
        await signup(usernameInput, emailInput, passwordInput);
      }
      
      // Success will trigger the useEffect redirect above
    } catch (err) {
      // Error is already managed in context, but let's handle or log
      console.error('Authentication attempt failed:', err.message);
    }
  };

  return (
    <div className="max-w-md mx-auto">
      {/* Outer Ledger frame */}
      <div className="bg-paperWhite border-2 border-ledgerInk shadow-vintage rounded-sm overflow-hidden">
        
        {/* Vintage Tab Headers */}
        <div className="flex border-b-2 border-ledgerInk bg-paperWhite-dark font-ledger text-xs font-bold text-center">
          <button
            onClick={() => handleTabChange(true)}
            className={`flex-1 py-3 border-r border-ledgerInk transition-colors flex items-center justify-center gap-1.5 ${
              isLogin ? 'bg-paperWhite text-vintageRed' : 'text-ledgerInk-light hover:bg-kraft-light'
            }`}
          >
            <LogIn className="w-3.5 h-3.5" />
            LOG IN
          </button>
          <button
            onClick={() => handleTabChange(false)}
            className={`flex-1 py-3 transition-colors flex items-center justify-center gap-1.5 ${
              !isLogin ? 'bg-paperWhite text-vintageRed' : 'text-ledgerInk-light hover:bg-kraft-light'
            }`}
          >
            <UserPlus className="w-3.5 h-3.5" />
            CREATE ACCOUNT
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6 md:p-8">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold font-display text-ledgerInk">
              {isLogin ? 'ACCOUNT SIGN-IN' : 'LEDGER REGISTRY'}
            </h2>
            <p className="text-xs font-ledger text-ledgerInk-light mt-1">
              {isLogin 
                ? 'Enter your registered credentials to authorize orders.'
                : 'Create an account to track purchases and historical orders.'}
            </p>
          </div>

          {/* Error notifications */}
          {(formError || error) && (
            <div className="mb-6 border border-vintageRed bg-paperWhite-light text-vintageRed p-3 font-ledger text-xs font-bold leading-normal rounded-sm">
              {formError || error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 font-ledger text-xs">
            
            {/* Username (Register only) */}
            {!isLogin && (
              <div>
                <label htmlFor="auth-username" className="block font-bold mb-1 uppercase text-ledgerInk-light">Ledger Username</label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-ledgerInk-light/60">
                    <UserIcon className="w-4 h-4" />
                  </span>
                  <input
                    id="auth-username"
                    type="text"
                    required
                    className="w-full bg-paperWhite-light border border-ledgerInk px-3 py-2.5 pl-10 text-sm focus:outline-none focus:ring-1 focus:ring-vintageRed"
                    placeholder="e.g. john_doe"
                    value={usernameInput}
                    onChange={(e) => setUsernameInput(e.target.value)}
                  />
                </div>
              </div>
            )}

            {/* Email */}
            <div>
              <label htmlFor="auth-email" className="block font-bold mb-1 uppercase text-ledgerInk-light">Email Address</label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-ledgerInk-light/60">
                  <Mail className="w-4 h-4" />
                </span>
                <input
                  id="auth-email"
                  type="email"
                  required
                  className="w-full bg-paperWhite-light border border-ledgerInk px-3 py-2.5 pl-10 text-sm focus:outline-none focus:ring-1 focus:ring-vintageRed"
                  placeholder="e.g. customer@example.com"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label htmlFor="auth-password" className="block font-bold mb-1 uppercase text-ledgerInk-light">Security Password</label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-ledgerInk-light/60">
                  <KeyRound className="w-4 h-4" />
                </span>
                <input
                  id="auth-password"
                  type="password"
                  required
                  className="w-full bg-paperWhite-light border border-ledgerInk px-3 py-2.5 pl-10 text-sm focus:outline-none focus:ring-1 focus:ring-vintageRed"
                  placeholder="••••••••"
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full border border-ledgerInk bg-vintageRed text-paperWhite hover:bg-vintageRed-dark disabled:bg-paperWhite-dark/60 font-bold py-3 text-sm tracking-wider shadow-vintage-sm hover:shadow-none transition-all flex items-center justify-center gap-2 rounded-sm"
              >
                {loading ? 'PROCESSING CREDENTIALS...' : (isLogin ? 'SIGN IN TO LEDGER' : 'REGISTER NEW ACCOUNT')}
              </button>
            </div>

          </form>

          {/* Quick toggle label */}
          <p className="mt-6 text-center text-[10px] font-ledger text-ledgerInk-light">
            {isLogin 
              ? "New client? Select 'Create Account' above to start a register."
              : "Already have a register? Select 'Log In' above."}
          </p>
        </div>
      </div>
    </div>
  );
}
