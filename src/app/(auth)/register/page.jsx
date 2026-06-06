"use client";

import { Suspense, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { showSuccess, showError } from "@/lib/alert";
import { FaGoogle } from "react-icons/fa";

function validatePassword(password) {
  if (password.length < 6) return "Password must be at least 6 characters";
  if (!/[A-Z]/.test(password)) return "Must contain at least one uppercase letter";
  if (!/[a-z]/.test(password)) return "Must contain at least one lowercase letter";
  return null;
}

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const getCallbackURL = () => {
    if (typeof window === "undefined") return "/";
    const redirect = new URLSearchParams(window.location.search).get("redirect") || "/";
    const safeRedirect = redirect.startsWith("/") && !redirect.startsWith("//") ? redirect : "/";
    return `${window.location.origin}${safeRedirect}`;
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    const name = form.fullname.value.trim();
    const email = form.email.value.trim();
    const image = form.image.value.trim();
    const password = form.password.value;

    const passwordError = validatePassword(password);
    if (passwordError) { showError(passwordError); return; }

    setLoading(true);
    await authClient.signUp.email(
      { name, email, password, image: image || undefined },
      {
        onSuccess: () => {
          showSuccess("Account created! Please login.");
          router.push("/login");
        },
        onError: (ctx) => {
          showError(ctx.error.message || "Registration failed. Try again.");
          setLoading(false);
        },
      }
    );
  };

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      console.log("Starting Google signup from:", window.location.origin);
      
      // Better-auth automatically handles state and redirects
      await authClient.signIn.social({ 
        provider: "google",
      });
      
    } catch (err) {
      console.error("[Register] Google sign-in error:", err);
      setLoading(false);
      showError(err?.message || "Google sign-in failed. Please try again.");
    }
  };

  return (
    <Suspense>
      <div className="min-h-screen flex items-center justify-center py-12 px-4 bg-gray-50 dark:bg-slate-950">
        <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-lg p-8 border border-slate-100 dark:border-slate-800">
          <div className="text-center mb-8">
            <h1 className="text-2xl sm:text-3xl font-extrabold mb-1.5 text-gray-900 dark:text-white">Create Account</h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm">Join SportFlow today</p>
          </div>

          <form onSubmit={handleRegister} className="space-y-4">
          {[
            { name: "fullname", label: "Full Name", type: "text", placeholder: "Your full name", required: true },
            { name: "email", label: "Email", type: "email", placeholder: "you@example.com", required: true },
            { name: "image", label: "Photo URL", type: "url", placeholder: "https://your-photo.com/image.png", required: false },
            { name: "password", label: "Password", type: "password", placeholder: "••••••••", required: true },
          ].map(({ name, label, type, placeholder, required }) => (
            <div key={name}>
              <label className="block text-sm font-semibold mb-1.5 text-gray-700 dark:text-gray-300">
                {label} {!required && <span className="font-normal text-gray-400">(optional)</span>}
              </label>
              <input
                name={name}
                type={type}
                required={required}
                placeholder={placeholder}
                className="w-full border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white text-sm"
              />
              {name === "password" && (
                <p className="text-xs text-gray-400 mt-1">Min 6 characters, 1 uppercase, 1 lowercase</p>
              )}
            </div>
          ))}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-bold transition disabled:opacity-60 cursor-pointer text-sm"
          >
            {loading ? "Creating account..." : "Register"}
          </button>
        </form>

        <div className="flex items-center gap-3 my-5">
          <hr className="flex-1 border-slate-200 dark:border-slate-700" />
          <span className="text-xs text-gray-400 font-medium">OR</span>
          <hr className="flex-1 border-slate-200 dark:border-slate-700" />
        </div>

        <button
          onClick={handleGoogleLogin}
          disabled={loading}
          className="w-full border border-slate-200 dark:border-slate-700 rounded-xl py-3 text-sm font-semibold flex items-center justify-center gap-3 hover:bg-slate-50 dark:hover:bg-slate-800 transition text-gray-700 dark:text-gray-200 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
        >
          <FaGoogle className="text-red-500" />
          {loading ? "Signing up..." : "Continue with Google"}
        </button>

        <p className="text-center mt-6 text-sm text-gray-500 dark:text-gray-400">
          Already have an account?{" "}
          <Link href="/login" className="text-blue-600 font-bold hover:underline">Login</Link>
        </p>
      </div>
    </div>
    </Suspense>
  );
}
