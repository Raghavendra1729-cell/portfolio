"use client";

import { useState } from "react";
import { AlertCircle, ArrowRight, Loader2, Lock } from "lucide-react";

interface AdminLoginProps {
  onLogin: () => void;
  statusMessage?: string | null;
}

type LoginErrorType = "auth" | "validation" | "server";

const DEFAULT_ERROR_COPY: Record<LoginErrorType, string> = {
  auth: "Your admin credentials were rejected. Check the secret and try again.",
  validation: "Enter the admin secret before submitting.",
  server: "We could not verify your session right now. Please try again in a moment.",
};

export default function AdminLogin({ onLogin, statusMessage }: AdminLoginProps) {
  const [secret, setSecret] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [errorType, setErrorType] = useState<LoginErrorType | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedSecret = secret.trim();
    if (!trimmedSecret) {
      setErrorType("validation");
      setError(DEFAULT_ERROR_COPY.validation);
      return;
    }

    setError(null);
    setErrorType(null);
    setLoading(true);

    try {
      const res = await fetch("/api/admin", {
        method: "GET",
        headers: {
          "x-admin-secret": trimmedSecret,
        },
      });

      const payload = await res.json().catch(() => null);

      if (res.ok && payload?.authenticated) {
        setSecret("");
        onLogin();
        return;
      }

      const nextErrorType = (payload?.errorType as LoginErrorType | undefined) ?? (res.status === 401 ? "auth" : "server");
      setErrorType(nextErrorType);
      setError(payload?.message || DEFAULT_ERROR_COPY[nextErrorType]);
    } catch {
      setErrorType("server");
      setError(DEFAULT_ERROR_COPY.server);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background bg-grid-subtle relative overflow-hidden">
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl -z-10 animate-pulse-glow" />
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-secondary/20 rounded-full blur-3xl -z-10" />

      <form onSubmit={handleSubmit} className="bg-card w-full max-w-md p-8 rounded-2xl border shadow-xl animate-fade-up relative z-10 glass-panel">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary mb-4">
            <Lock className="w-6 h-6" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Admin Access</h1>
          <p className="text-muted-foreground mt-2">Enter your admin secret to establish a secure session for portfolio content management.</p>
        </div>

        <div className="mb-6 space-y-2">
          <label className="text-sm font-medium text-foreground ml-1">Secret Key</label>
          <input
            type="password"
            autoComplete="current-password"
            placeholder="••••••••••••••••"
            aria-invalid={Boolean(error)}
            aria-describedby={error ? "admin-login-error" : undefined}
            className={`w-full p-4 bg-background border rounded-xl focus:ring-2 outline-none transition-all shadow-sm ${
              error ? "border-destructive focus:ring-destructive/20" : "border-input focus:ring-primary/20 focus:border-primary"
            }`}
            value={secret}
            onChange={(e) => {
              setSecret(e.target.value);
              if (error) {
                setError(null);
                setErrorType(null);
              }
            }}
            disabled={loading}
          />
          <p className="text-xs text-muted-foreground ml-1">The secret is verified server-side and never stored in browser-accessible storage.</p>
          {statusMessage && !error && (
            <div className="rounded-lg border border-border bg-muted/40 px-3 py-2 text-sm text-muted-foreground animate-fade-up">
              {statusMessage}
            </div>
          )}
          {error && (
            <div
              id="admin-login-error"
              className="rounded-lg border border-destructive/30 bg-destructive/5 px-3 py-2 text-sm text-destructive flex items-start gap-2 animate-fade-up"
            >
              <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
              <div>
                <p className="font-medium capitalize">{errorType || "Login"} issue</p>
                <p>{error}</p>
              </div>
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={loading || !secret.trim()}
          className="w-full bg-primary text-primary-foreground p-4 rounded-xl font-medium hover:opacity-90 transition-all shadow-lg hover:shadow-primary/25 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" /> Verifying...
            </>
          ) : (
            <>
              Access Dashboard <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>
    </div>
  );
}
