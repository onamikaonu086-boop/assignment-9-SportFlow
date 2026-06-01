"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { showSuccess, showError } from "@/lib/alert";
import { FaGoogle } from "react-icons/fa";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);

  const getCallbackURL = () => {
    const redirect = searchParams.get("redirect") || "/";
    const safeRedirect = redirect.startsWith("/") && !redirect.startsWith("//") ? redirect : "/";
    return `${window.location.origin}${safeRedirect}`;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    const callbackURL = getCallbackURL();
    setLoading(true);
    await authClient.signIn.email(
      { email: form.email.value, password: form.password.value, callbackURL },
      {
        onSuccess: () => {
          showSuccess("Logged in successfully!");
          router.push(new URL(callbackURL).pathname);
        },
        onError: (ctx) => {
          showError(ctx.error.message || "Invalid email or password.");
          setLoading(false);
        },
      }
    );
  };

  const handleGoogleLogin = async () => {
    try {
      const callbackURL = getCallbackURL();
      console.log("[Login] Google callbackURL:", callbackURL);
      await authClient.signIn.social({ provider: "google", callbackURL });
    } catch (err) {
      console.error("[Login] Google sign-in error:", err);
      showError(err?.message || "Google sign-in failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 bg-gray-50 dark:bg-slate-950">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-lg p-8 border border-slate-100 dark:border-slate-800">
        <div className="text-center mb-8">
          <h1 className="text-2xl sm:text-3xl font-extrabold mb-1.5 text-gray-900 dark:text-white">Welcome Back</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm">Sign in to your SportFlow account</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold mb-1.5 text-gray-700 dark:text-gray-300">Email</label>
            <input
              name="email"
              type="email"
              required
              placeholder="you@example.com"
              className="w-full border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1.5 text-gray-700 dark:text-gray-300">Password</label>
            <input
              name="password"
              type="password"
              required
              placeholder="••••••••"
              className="w-full border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white text-sm"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-bold transition disabled:opacity-60 cursor-pointer text-sm"
          >
            {loading ? "Signing in..." : "Login"}
          </button>
        </form>

        <div className="flex items-center gap-3 my-5">
          <hr className="flex-1 border-slate-200 dark:border-slate-700" />
          <span className="text-xs text-gray-400 font-medium">OR</span>
          <hr className="flex-1 border-slate-200 dark:border-slate-700" />
        </div>

        <button
          onClick={handleGoogleLogin}
          className="w-full border border-slate-200 dark:border-slate-700 rounded-xl py-3 text-sm font-semibold flex items-center justify-center gap-3 hover:bg-slate-50 dark:hover:bg-slate-800 transition text-gray-700 dark:text-gray-200 cursor-pointer"
        >
          <FaGoogle className="text-red-500" />
          Continue with Google
        </button>

        <p className="text-center mt-6 text-sm text-gray-500 dark:text-gray-400">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="text-blue-600 font-bold hover:underline">Register</Link>
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
