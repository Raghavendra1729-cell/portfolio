"use client";

import { useState } from "react";
import { Lock, Loader2, ArrowRight } from "lucide-react";

interface AdminLoginProps {
  onLogin: (secret: string) => void;
}

export default function AdminLogin({ onLogin }: AdminLoginProps) {
  const [secret, setSecret] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // 1. Verify with the server
      const res = await fetch("/api/admin", {
        method: "GET",
        headers: {
          "x-admin-secret": secret,
        },
      });

      // 2. If server says 200 OK, let them in
      if (res.ok) {
        onLogin(secret);
      } else {
        setError("Invalid secret key");
      }
    } catch (err) {
      setError("Connection failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background bg-grid-subtle relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl -z-10 animate-pulse-glow" />
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-secondary/20 rounded-full blur-3xl -z-10" />

      <form onSubmit={handleSubmit} className="bg-card w-full max-w-md p-8 rounded-2xl border shadow-xl animate-fade-up relative z-10 glass-panel">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary mb-4">
            <Lock className="w-6 h-6" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Admin Access</h1>
          <p className="text-muted-foreground mt-2">Enter your credentials to manage portfolio content.</p>
        </div>
        
        <div className="mb-6 space-y-2">
          <label className="text-sm font-medium text-foreground ml-1">Secret Key</label>
          <input
            type="password"
            placeholder="••••••••••••••••"
            className={`w-full p-4 bg-background border rounded-xl focus:ring-2 outline-none transition-all shadow-sm ${
              error 
                ? "border-destructive focus:ring-destructive/20" 
                : "border-input focus:ring-primary/20 focus:border-primary"
            }`}
            value={secret}
            onChange={(e) => {
              setSecret(e.target.value);
              setError("");
            }}
            disabled={loading}
          />
          {error && <p className="text-destructive text-sm font-medium animate-fade-up">{error}</p>}
        </div>

        <button 
          type="submit" 
          disabled={loading || !secret}
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