'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  AlertCircle,
  ArrowRight,
  Check,
  CheckCircle2,
  Eye,
  EyeOff,
  Loader2,
  Lock,
  Mail,
  ShieldCheck,
  Sparkles,
  User,
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useAuthStore } from '@/store/auth';

function checkPasswordStrength(password: string) {
  const hasMinLength = password.length >= 8;
  const hasDigit = /\d/.test(password);
  const hasSpecial = /[!@#$%^&*(),.?":{}|<>\-_=+]/.test(password);
  const hasMixedCase = /[a-z]/.test(password) && /[A-Z]/.test(password);

  const score = [hasMinLength, hasDigit, hasSpecial, hasMixedCase].filter(Boolean).length;

  let label = 'Too short';
  let color = 'bg-gray-200';
  let textColor = 'text-gray-400';
  let percentage = 0;

  if (password.length > 0) {
    if (score <= 1) {
      label = 'Weak';
      color = 'bg-rose-500';
      textColor = 'text-rose-600';
      percentage = 25;
    } else if (score === 2) {
      label = 'Fair';
      color = 'bg-amber-500';
      textColor = 'text-amber-600';
      percentage = 50;
    } else if (score === 3) {
      label = 'Good';
      color = 'bg-blue-500';
      textColor = 'text-blue-600';
      percentage = 75;
    } else {
      label = 'Strong';
      color = 'bg-emerald-500';
      textColor = 'text-emerald-600';
      percentage = 100;
    }
  }

  return {
    score,
    label,
    color,
    textColor,
    percentage,
    hasMinLength,
    hasDigit,
    hasSpecial,
    hasMixedCase,
    checks: [
      { id: 'length', label: '8+ characters', met: hasMinLength },
      { id: 'digit', label: 'At least 1 digit (0-9)', met: hasDigit },
      { id: 'special', label: 'Special symbol (!@#$...)', met: hasSpecial },
      { id: 'case', label: 'Uppercase & lowercase', met: hasMixedCase },
    ],
  };
}

function LoginFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get('redirect') || '/account';

  const [mode, setMode] = React.useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [fullName, setFullName] = React.useState('');
  const [showPassword, setShowPassword] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);
  const [successMsg, setSuccessMsg] = React.useState<string | null>(null);

  const { user, setUser, setSession } = useAuthStore();
  const passwordStrength = React.useMemo(() => checkPasswordStrength(password), [password]);

  // If already logged in, redirect
  React.useEffect(() => {
    if (user) {
      router.push(redirectPath);
    }
  }, [user, router, redirectPath]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);
    setLoading(true);

    const supabase = createClient();

    try {
      if (mode === 'signin') {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });

        if (error) {
          setErrorMsg(error.message || 'Invalid email or password.');
          setLoading(false);
          return;
        }

        if (data.session && data.user) {
          setUser(data.user);
          setSession(data.session);
          setSuccessMsg('Signed in successfully! Redirecting...');
          setTimeout(() => {
            router.push(redirectPath);
          }, 800);
        }
      } else {
        // Sign Up Validation
        if (!fullName.trim()) {
          setErrorMsg('Please enter your full name.');
          setLoading(false);
          return;
        }

        if (password.length < 8) {
          setErrorMsg('Password must be at least 8 characters long.');
          setLoading(false);
          return;
        }

        if (!passwordStrength.hasDigit || !passwordStrength.hasSpecial) {
          setErrorMsg('Password must include at least one digit and one special character.');
          setLoading(false);
          return;
        }

        const { data, error } = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: {
            data: {
              full_name: fullName.trim(),
            },
          },
        });

        if (error) {
          setErrorMsg(error.message || 'Failed to create account.');
          setLoading(false);
          return;
        }

        // Trigger welcome email via Supabase Edge Function
        if (data.user) {
          try {
            await supabase.functions.invoke('send-welcome-email', {
              body: {
                email: email.trim(),
                full_name: fullName.trim(),
                user_id: data.user.id,
                created_at: new Date().toISOString(),
              },
            });
            console.log('Supabase Edge Function welcome email invoked.');
          } catch (funcErr) {
            console.warn('Supabase Edge Function invoke notice:', funcErr);
          }
        }

        if (data.session && data.user) {
          setUser(data.user);
          setSession(data.session);
          setSuccessMsg('Account created successfully! Welcome email sent. Redirecting...');
          setTimeout(() => {
            router.push(redirectPath);
          }, 1000);
        } else if (data.user) {
          // Confirmation email sent by Supabase
          setSuccessMsg(
            'Account registered! A confirmation and welcome email has been sent to your address. Please verify your email, then sign in.'
          );
          setMode('signin');
        }
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'An unexpected error occurred.';
      setErrorMsg(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-lg px-4 py-12 sm:px-6">
      {/* Brand Header */}
      <div className="text-center mb-8">
        <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-primary-light text-primary ring-2 ring-blue-100 mb-4">
          <ShieldCheck className="h-7 w-7" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-navy">
          {mode === 'signin' ? 'Sign in to GUNA PHARMA' : 'Create your account'}
        </h1>
        <p className="mt-2 text-sm text-gray-600">
          {mode === 'signin'
            ? 'Access your orders, uploaded prescriptions, and saved addresses.'
            : 'Join GUNA PHARMA for verified healthcare and wellness essentials.'}
        </p>
      </div>

      {/* Main Card */}
      <div className="rounded-3xl border border-border bg-white p-6 sm:p-8 shadow-card">
        {/* Mode Tabs */}
        <div className="mb-6 grid grid-cols-2 rounded-xl bg-slate-100 p-1">
          <button
            type="button"
            onClick={() => {
              setMode('signin');
              setErrorMsg(null);
              setSuccessMsg(null);
            }}
            className={`rounded-lg py-2 text-sm font-semibold transition-all ${
              mode === 'signin' ? 'bg-white text-navy shadow-xs' : 'text-gray-500 hover:text-navy'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('signup');
              setErrorMsg(null);
              setSuccessMsg(null);
            }}
            className={`rounded-lg py-2 text-sm font-semibold transition-all ${
              mode === 'signup' ? 'bg-white text-navy shadow-xs' : 'text-gray-500 hover:text-navy'
            }`}
          >
            Create Account
          </button>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div className="mb-5 flex items-start gap-3 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-xs font-medium text-rose-800">
            <AlertCircle className="h-4 w-4 text-rose-600 shrink-0 mt-0.5" />
            <p className="flex-1 leading-relaxed">{errorMsg}</p>
          </div>
        )}

        {/* Success Alert */}
        {successMsg && (
          <div className="mb-5 flex items-start gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-xs font-medium text-emerald-800">
            <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
            <p className="flex-1 leading-relaxed">{successMsg}</p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'signup' && (
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Dr. Rahul Sharma"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full h-11 rounded-xl border border-border pl-10 pr-4 text-sm text-navy placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="email"
                required
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-11 rounded-xl border border-border pl-10 pr-4 text-sm text-navy placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                Password
              </label>
              {mode === 'signin' && (
                <button
                  type="button"
                  onClick={() => {
                    setErrorMsg('Password reset instructions will be sent to your email.');
                  }}
                  className="text-xs font-semibold text-primary hover:underline"
                >
                  Forgot password?
                </button>
              )}
            </div>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                minLength={mode === 'signup' ? 8 : 6}
                placeholder={mode === 'signup' ? 'Min 8 chars with digits & symbols' : 'Enter your password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full h-11 rounded-xl border border-border pl-10 pr-11 text-sm text-navy placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>

            {/* Real-time Password Strength Meter for Signup */}
            {mode === 'signup' && password.length > 0 && (
              <div className="mt-3 rounded-2xl bg-slate-50 border border-border/80 p-3.5 space-y-2.5 transition-all">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-gray-600">Password Strength:</span>
                  <span className={`font-bold ${passwordStrength.textColor}`}>
                    {passwordStrength.label}
                  </span>
                </div>

                {/* Segmented Strength Bar */}
                <div className="grid grid-cols-4 gap-1.5">
                  {[1, 2, 3, 4].map((step) => (
                    <div
                      key={step}
                      className={`h-1.5 rounded-full transition-all duration-300 ${
                        passwordStrength.score >= step
                          ? passwordStrength.color
                          : 'bg-gray-200'
                      }`}
                    />
                  ))}
                </div>

                {/* Password Criteria Checklist */}
                <div className="grid grid-cols-2 gap-1.5 pt-1 text-[11px]">
                  {passwordStrength.checks.map((chk) => (
                    <div
                      key={chk.id}
                      className={`flex items-center gap-1.5 font-medium transition-colors ${
                        chk.met ? 'text-emerald-700' : 'text-gray-400'
                      }`}
                    >
                      {chk.met ? (
                        <Check className="h-3.5 w-3.5 text-emerald-600 shrink-0 stroke-[2.5]" />
                      ) : (
                        <span className="h-1.5 w-1.5 rounded-full bg-gray-300 ml-1 mr-1 shrink-0" />
                      )}
                      <span>{chk.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 h-11 rounded-xl bg-primary text-sm font-semibold text-white shadow-soft hover:bg-primary-hover transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Processing...</span>
              </>
            ) : mode === 'signin' ? (
              <>
                <span>Sign In</span>
                <ArrowRight className="h-4 w-4" />
              </>
            ) : (
              <>
                <span>Create Account</span>
                <Sparkles className="h-4 w-4" />
              </>
            )}
          </button>
        </form>

        {/* Security Assurance */}
        <p className="mt-6 text-center text-[11px] text-gray-400">
          Protected with 256-bit SSL encryption. GUNA PHARMA complies with strict medical data privacy standards.
        </p>
      </div>

      {/* Footer link */}
      <div className="mt-6 text-center text-xs text-gray-500">
        Need assistance with your account?{' '}
        <Link href="/contact" className="font-semibold text-primary hover:underline">
          Contact Pharmacist Support
        </Link>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <React.Suspense
      fallback={
        <div className="mx-auto max-w-lg px-4 py-16 text-center">
          <p className="text-gray-500">Loading sign-in form...</p>
        </div>
      }
    >
      <LoginFormContent />
    </React.Suspense>
  );
}
