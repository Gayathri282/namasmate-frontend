"use client";

import React, { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Moon, Lock, Mail, Loader2, AlertCircle } from "lucide-react";
import Link from "next/link";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    if (!email || !password) {
      setErrorMsg("Please fill in all fields.");
      setLoading(false);
      return;
    }

    try {
      const res = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if (res?.error) {
        setErrorMsg(res.error || "Invalid login credentials.");
      } else {
        router.push("/admin");
        router.refresh();
      }
    } catch (err: any) {
      setErrorMsg("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-islamic-pattern min-h-screen flex flex-col justify-center items-center px-4">
      {/* Back to Site */}
      <div className="mb-6">
        <Link
          href="/"
          className="text-xs uppercase font-bold tracking-widest text-primary hover:text-gold transition-colors flex items-center space-x-1"
        >
          <span>← Back to main site</span>
        </Link>
      </div>

      {/* Login Card */}
      <div className="w-full max-w-md bg-white border border-primary/10 shadow-2xl rounded-3xl p-8 space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex p-3 bg-primary text-gold rounded-full mb-2">
            <Moon className="w-6 h-6 fill-gold stroke-gold" />
          </div>
          <h1 className="font-serif text-3xl font-bold text-primary">Admin Portal</h1>
          <p className="text-primary-light/70 text-xs font-semibold uppercase tracking-wider">
            Sujood Mate Management
          </p>
        </div>

        {errorMsg && (
          <div className="bg-red-50 text-red-700 p-4 rounded-xl border border-red-200 flex items-start space-x-2 text-sm">
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1">
            <label
              htmlFor="email"
              className="block text-xs font-bold text-primary uppercase"
            >
              Admin Email
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-primary-light/40">
                <Mail className="w-4 h-4" />
              </span>
              <input
                type="email"
                id="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@sujoodmate.com"
                className="w-full pl-10 pr-4 py-3 border border-primary/20 rounded-xl focus:outline-none focus:border-gold text-primary font-medium text-sm bg-cream/10"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label
              htmlFor="password"
              className="block text-xs font-bold text-primary uppercase"
            >
              Password
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-primary-light/40">
                <Lock className="w-4 h-4" />
              </span>
              <input
                type="password"
                id="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-3 border border-primary/20 rounded-xl focus:outline-none focus:border-gold text-primary font-medium text-sm bg-cream/10"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-3.5 rounded-xl shadow-md transition-all flex items-center justify-center space-x-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Signing in...</span>
              </>
            ) : (
              <span>Sign In</span>
            )}
          </button>
        </form>

        <div className="text-center pt-2 text-[10px] text-primary-light/50 font-serif leading-relaxed">
          Default seeded credentials:<br />
          Email: <span className="font-semibold text-primary">admin@sujoodmate.com</span><br />
          Password: <span className="font-semibold text-primary">AdminPassword123</span>
        </div>
      </div>
    </div>
  );
}
