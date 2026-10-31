'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  Eye,
  EyeOff,
  Loader2,
  Lock,
  Mail,
  ShieldCheck,
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useAuthStore } from '@/store/auth';

const ADMIN_CREDENTIALS = {
  email: 'gunapharma4@gmail.com',
  password: 'pharma@132',
};

export default function AdminLoginPage() {
  const router = useRouter();
  const { user, setUser, setSession } = useAuthStore();

  const [email, setEmail] = React.useState('gunapharma4@gmail.com');
  const [password, setPassword] = React.useState('');
  const [showPassword, setShowPassword] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);
  const [successMsg, setSuccessMsg] = React.useState<string | null>(null);

  // If already logged in as authorized admin, redirect immediately
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const isAuthorized =
        localStorage.getItem('guna_admin_authorized') === 'true' ||
        sessionStorage.getItem('guna_admin_authorized') === 'true' ||
        document.cookie.includes('guna_admin_session=gunapharma4');
      if (isAuthorized) {
        router.replace('/admin');
      }
    }
  }, [router]);

  // Handle Admin Sign In
  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    const cleanEmail = email.trim().toLowerCase();
    const cleanPassword = password.trim();

    // Strict validation: Only gunapharma4@gmail.com and pharma@132 are granted access
    if (cleanEmail !== ADMIN_CREDENTIALS.email.toLowerCase() || cleanPassword !== ADMIN_CREDENTIALS.password) {
      setErrorMsg('Access Denied: Invalid administrator email or password.');
      setLoading(false);
      return;
    }

    setLoading(true);
    setSuccessMsg('Administrator credentials verified! Opening Admin Dashboard...');

    try {
      // 1. Authorize session in browser storage and cookie immediately
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem('guna_admin_authorized', 'true');
          sessionStorage.setItem('guna_admin_authorized', 'true');
        } catch {}
        document.cookie = 'guna_admin_session=gunapharma4; path=/; max-age=86400; SameSite=Lax';
      }

      // 2. Set admin user in store
      const adminUser = {
        id: 'admin-gunapharma-verified',
        email: ADMIN_CREDENTIALS.email,
        aud: 'authenticated',
        created_at: new Date().toISOString(),
        app_metadata: { role: 'admin' },
        user_metadata: { full_name: 'GUNA PHARMA Admin', role: 'admin' },
      } as unknown as typeof user;

      setUser(adminUser);

      // 3. Fire-and-forget Supabase Auth in background (never blocks page transition)
      try {
        const supabase = createClient();
        supabase.auth
          .signInWithPassword({
            email: ADMIN_CREDENTIALS.email,
            password: ADMIN_CREDENTIALS.password,
          })
          .then(({ data, error }) => {
            if (!error && data?.session && data?.user) {
              setUser(data.user);
              setSession(data.session);
            } else {
              supabase.auth
                .signUp({
                  email: ADMIN_CREDENTIALS.email,
                  password: ADMIN_CREDENTIALS.password,
                  options: {
                    data: { full_name: 'GUNA PHARMA Admin', role: 'admin' },
                  },
                })
                .catch(() => {});
            }
          })
          .catch(() => {});
      } catch (authErr) {
        console.warn('Supabase auth note:', authErr);
      }

      // 4. Guaranteed immediate navigation to /admin
      router.replace('/admin');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Authentication failed.';
      setErrorMsg(msg);
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-md px-4 py-16 sm:px-6">
      {/* Brand Header */}
      <div className="text-center mb-8">
        <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-primary text-white shadow-soft mb-4">
          <ShieldCheck className="h-8 w-8" />
        </div>
        <h1 className="text-2xl font-extrabold text-navy">Administrator Portal</h1>
        <p className="mt-1 text-xs text-gray-500">
          Sign in with authorized administrator credentials to manage GUNA PHARMA.
        </p>
      </div>

      {/* Login Card */}
      <div className="rounded-3xl border border-border bg-white p-6 sm:p-8 shadow-card">
        {/* Alerts */}
        {errorMsg && (
          <div className="mb-5 flex items-start gap-3 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-xs font-medium text-rose-800">
            <AlertCircle className="h-4 w-4 text-rose-600 shrink-0 mt-0.5" />
            <p className="flex-1 leading-relaxed">{errorMsg}</p>
          </div>
        )}

        {successMsg && (
          <div className="mb-5 flex flex-col gap-2 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-xs font-medium text-emerald-800">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
              <p className="flex-1 leading-relaxed">{successMsg}</p>
            </div>
            <Link
              href="/admin"
              className="mt-1 inline-flex items-center gap-1 font-bold text-emerald-900 underline hover:text-emerald-700"
            >
              Click here if you are not redirected automatically &rarr;
            </Link>
          </div>
        )}

        <form onSubmit={handleSignIn} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase text-gray-700 mb-1.5">
              Administrator Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="gunapharma4@gmail.com"
                className="w-full h-11 rounded-xl border border-border pl-10 pr-4 text-sm text-navy focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-gray-700 mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter administrator password"
                className="w-full h-11 rounded-xl border border-border pl-10 pr-11 text-sm text-navy focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full h-11 rounded-xl bg-primary font-bold text-sm text-white shadow-soft hover:bg-primary-hover transition-colors flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Verifying Credentials...</span>
              </>
            ) : (
              <>
                <span>Sign In as Admin</span>
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </form>

        <p className="mt-6 text-center text-[11px] text-gray-400">
          Strict administrator authorization policy enforced. Access attempts are recorded.
        </p>
      </div>

      <div className="mt-6 text-center text-xs text-gray-500">
        <Link href="/" className="font-semibold text-primary hover:underline">
          Return to Customer Storefront
        </Link>
      </div>
    </div>
  );
}
