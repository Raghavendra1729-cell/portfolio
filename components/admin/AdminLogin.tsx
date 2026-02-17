"use client";

import { useState } from "react";

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
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-lg w-96 border">
        <h1 className="text-2xl font-bold mb-2 text-center text-gray-800">Portfolio Admin</h1>
        <p className="text-sm text-gray-500 text-center mb-6">Enter your secure key to continue</p>
        
        <div className="mb-4">
          <input
            type="password"
            placeholder="Admin Secret Key"
            className={`w-full p-3 border rounded-lg focus:ring-2 outline-none transition ${
              error ? "border-red-500 focus:ring-red-200" : "border-gray-300 focus:ring-blue-200"
            }`}
            value={secret}
            onChange={(e) => {
              setSecret(e.target.value);
              setError("");
            }}
            disabled={loading}
          />
          {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
        </div>

        <button 
          type="submit" 
          disabled={loading}
          className="w-full bg-black text-white p-3 rounded-lg font-medium hover:bg-gray-800 transition shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Verifying..." : "Access Dashboard"}
        </button>
      </form>
    </div>
  );
}