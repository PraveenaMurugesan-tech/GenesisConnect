import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Zap, Lock, Mail, ArrowRight, ShieldCheck } from "lucide-react";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";
import { Card, CardContent } from "../../components/ui/Card";
import { Badge } from "../../components/common/Badge";

export const AdminLoginPage: React.FC = () => {
  const [email, setEmail] = useState("admin@genesispower.in");
  const [password, setPassword] = useState("••••••••");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Mock authentication transition for Phase 1 foundation
    setTimeout(() => {
      localStorage.setItem("genesis_access_token", "mock_phase1_token");
      setLoading(false);
      navigate("/admin/dashboard");
    }, 500);
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col justify-center items-center p-4 selection:bg-amber-500 selection:text-slate-950">
      <div className="w-full max-w-md space-y-8">
        {/* Brand */}
        <div className="text-center space-y-3">
          <Link to="/" className="inline-flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-amber-500 flex items-center justify-center text-slate-950 shadow-lg">
              <Zap className="w-7 h-7 fill-slate-950" />
            </div>
          </Link>
          <h1 className="font-heading text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Genesis Power Equipments
          </h1>
          <p className="text-xs uppercase tracking-widest text-slate-400 font-semibold">
            Enterprise Staff Authentication
          </p>
        </div>

        {/* Login Box */}
        <Card className="bg-white border-slate-200">
          <CardContent className="p-8 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Sign In to Console
              </span>
              <Badge variant="accent" size="sm" dot>Phase 1 Demo</Badge>
            </div>

            <form onSubmit={handleLogin} className="space-y-5">
              <Input
                label="Staff Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                leftIcon={<Mail className="w-4 h-4" />}
                required
              />

              <Input
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                leftIcon={<Lock className="w-4 h-4" />}
                required
              />

              <Button
                type="submit"
                variant="accent"
                size="lg"
                fullWidth
                isLoading={loading}
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                Access Admin Console
              </Button>
            </form>

            <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200 text-xs text-slate-600 space-y-1">
              <div className="flex items-center gap-1.5 font-semibold text-slate-800">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Phase 1 Authentication Shell</span>
              </div>
              <p className="text-[11px] text-slate-500">
                Clicking sign-in enters the admin dashboard in demo mode. Full JWT password hashing and database session verification is scheduled for Phase 4.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Back to public site */}
        <div className="text-center">
          <Link
            to="/"
            className="text-xs text-slate-400 hover:text-amber-400 transition-colors"
          >
            &larr; Return to Public Website
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminLoginPage;
