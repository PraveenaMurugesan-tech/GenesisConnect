import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { Zap, Lock, Mail, ArrowRight, AlertCircle, Shield } from "lucide-react";
import { useAuth } from "../../auth/AuthContext";

export const AdminLoginPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const destination = (location.state as { from?: { pathname: string } })?.from?.pathname || "/admin/dashboard";

  // If already authenticated, redirect immediately
  useEffect(() => {
    if (isAuthenticated) {
      navigate(destination, { replace: true });
    }
  }, [isAuthenticated, destination, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!email.trim() || !password) {
      setErrorMessage("Please enter both staff email and password.");
      return;
    }

    setLoading(true);

    try {
      await login({
        email: email.trim(),
        password,
      });
      navigate(destination, { replace: true });
    } catch (err: any) {
      if (err.response) {
        const detail = err.response.data?.detail;
        if (typeof detail === "string") {
          setErrorMessage(detail);
        } else if (Array.isArray(detail)) {
          setErrorMessage(detail.map((d: any) => d.msg || "Validation error").join(", "));
        } else {
          setErrorMessage("Invalid email or password. Please verify your credentials.");
        }
      } else if (err.request) {
        setErrorMessage("Unable to connect to the authentication server. Please check your network or backend service.");
      } else {
        setErrorMessage(err.message || "An unexpected error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center p-4 selection:bg-amber-500 selection:text-slate-950 relative overflow-hidden">
      {/* Background Subtle Gradient Accents */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md space-y-8 relative z-10">
        {/* Brand Header */}
        <div className="text-center space-y-3">
          <Link
            to="/"
            className="inline-flex items-center gap-3 group focus:outline-hidden focus:ring-2 focus:ring-amber-500 rounded-xl"
            aria-label="Genesis Power Equipments Homepage"
          >
            <div className="w-12 h-12 rounded-xl bg-amber-500 flex items-center justify-center text-slate-950 shadow-lg shadow-amber-500/20 group-hover:scale-105 transition-transform duration-200">
              <Zap className="w-7 h-7 fill-slate-950" />
            </div>
          </Link>
          <div>
            <h1 className="font-heading text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Genesis Power Equipments
            </h1>
            <p className="text-xs uppercase tracking-widest text-slate-400 font-semibold mt-1">
              Administrative Control Console
            </p>
          </div>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-2xl shadow-2xl border border-slate-200/80 overflow-hidden">
          <div className="p-8 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h2 className="text-base font-bold text-slate-900">
                  Staff Authentication
                </h2>
                <p className="text-xs text-slate-500">
                  Enter authorized credentials to proceed
                </p>
              </div>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200/60">
                <Shield className="w-3.5 h-3.5 text-amber-600" />
                Protected
              </span>
            </div>

            {/* Error Banner */}
            {errorMessage && (
              <div
                role="alert"
                className="flex items-start gap-3 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs animate-shake"
              >
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <div className="leading-relaxed">
                  <span className="font-semibold">Authentication failed: </span>
                  {errorMessage}
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5" noValidate>
              {/* Email Input */}
              <div className="space-y-1.5 text-left">
                <label
                  htmlFor="admin-email"
                  className="block text-xs font-semibold uppercase tracking-wider text-slate-700"
                >
                  Administrator Email
                </label>
                <div className="relative rounded-lg shadow-xs">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    id="admin-email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    disabled={loading}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@genesispower.in"
                    className="block w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-900 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-amber-500 focus:border-amber-500 focus:bg-white transition-all disabled:opacity-50"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="space-y-1.5 text-left">
                <label
                  htmlFor="admin-password"
                  className="block text-xs font-semibold uppercase tracking-wider text-slate-700"
                >
                  Password
                </label>
                <div className="relative rounded-lg shadow-xs">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    id="admin-password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    disabled={loading}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="block w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-900 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-amber-500 focus:border-amber-500 focus:bg-white transition-all disabled:opacity-50"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-lg text-sm font-bold text-slate-950 bg-amber-500 hover:bg-amber-400 active:bg-amber-600 focus:outline-hidden focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 transition-all shadow-md shadow-amber-500/20 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
              >
                {loading ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-slate-950"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v8H4z"
                      />
                    </svg>
                    <span>Verifying Credentials...</span>
                  </>
                ) : (
                  <>
                    <span>Sign In to Admin Console</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-xs text-slate-600 space-y-1 text-left">
              <div className="flex items-center gap-1.5 font-semibold text-slate-800">
                <Shield className="w-3.5 h-3.5 text-amber-600" />
                <span>Authorized Genesis Personnel Only</span>
              </div>
              <p className="text-[11px] text-slate-500 leading-normal">
                Access is restricted to verified administrators. All administrative sessions are authenticated and protected by signed JWT tokens.
              </p>
            </div>
          </div>
        </div>

        {/* Return to Public Website */}
        <div className="text-center">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-amber-400 transition-colors focus:outline-hidden focus:underline"
          >
            &larr; Return to Genesis Public Website
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminLoginPage;
