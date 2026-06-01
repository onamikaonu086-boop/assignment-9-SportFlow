"use client";

import { authClient } from "@/lib/auth-client";
import { Button, Input, Form } from "@heroui/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";

const getCallbackURL = (path = "/") => {
  if (typeof window === "undefined") return path;
  return new URL(path, window.location.origin).toString();
};

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const name = String(formData.get("name") || "").trim();
    const email = String(formData.get("email") || "").trim();
    const photoUrl = String(formData.get("photoUrl") || "").trim();
    const password = String(formData.get("password") || "");

    if (!name || !email || !password) {
      toast.error("Name, email, and password are required.");
      setLoading(false);
      return;
    }

    
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z]).{6,}$/;
    if (!passwordRegex.test(password)) {
      toast.error(
        "Password must be at least 6 characters long, contain at least one uppercase letter, and one lowercase letter."
      );
      setLoading(false);
      return;
    }

    try {
      const { error } = await authClient.signUp.email({
        email,
        password,
        name,
        image: photoUrl || undefined,
        callbackURL: getCallbackURL("/login"), 
      });

      if (error) {
        toast.error(error.message || "Registration failed!");
        setLoading(false);
        return;
      }

      toast.success("Registration successful! Redirecting to login...");
      
      setTimeout(() => {
        router.push("/login");
      }, 1500);

    } catch (err) {
      console.error(err);
      toast.error("Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    if (googleLoading) return;
    setGoogleLoading(true);

    try {
      await authClient.signIn.social({
        provider: "google",
        callbackURL: getCallbackURL("/"), 
      });
    } catch (err) {
      console.error(err);
      toast.error("Google login failed!");
      setGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 px-4 py-12">
      <div className="w-full max-w-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-2xl shadow-xl p-8">
        
        {/* Title Section */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Create Account</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
            Join SportNest to list or book world-class sports facilities
          </p>
        </div>

        {/* Registration Form */}
        <Form onSubmit={handleRegister} className="space-y-4">
          <div className="w-full space-y-4">
            
            {/* Full Name */}
            <div className="w-full">
              <label className="block mb-1 text-sm font-medium text-slate-700 dark:text-slate-300">
                Full Name
              </label>
              <Input
                name="name"
                type="text"
                placeholder="John Doe"
                autoComplete="name"
                isRequired
                className="w-full"
              />
            </div>

            {/* Email Address */}
            <div className="w-full">
              <label className="block mb-1 text-sm font-medium text-slate-700 dark:text-slate-300">
                Email Address
              </label>
              <Input
                name="email"
                type="email"
                placeholder="john@example.com"
                autoComplete="email"
                isRequired
                className="w-full"
              />
            </div>

            {/* Photo URL */}
            <div className="w-full">
              <label className="block mb-1 text-sm font-medium text-slate-700 dark:text-slate-300">
                Photo URL
              </label>
              <Input
                name="photoUrl"
                type="url"
                placeholder="https://example.com/photo.jpg"
                className="w-full"
              />
            </div>

            {/* Password */}
            <div className="w-full">
              <label className="block mb-1 text-sm font-medium text-slate-700 dark:text-slate-300">
                Password
              </label>
              <Input
                name="password"
                type="password"
                placeholder="Password"
                autoComplete="new-password"
                isRequired
                className="w-full"
              />
            </div>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            isLoading={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl transition mt-4 shadow-md"
          >
            {loading ? "Registering..." : "Register"}
          </Button>
        </Form>

        {/* Divider */}
        <div className="relative flex py-5 items-center">
          <div className="flex-grow border-t border-slate-200 dark:border-slate-800"></div>
          <span className="flex-shrink mx-4 text-slate-400 text-xs uppercase">Or register with</span>
          <div className="flex-grow border-t border-slate-200 dark:border-slate-800"></div>
        </div>

        {/* Google Login Button */}
        <Button
          onClick={handleGoogleLogin}
          isLoading={googleLoading}
          variant="bordered"
          className="w-full border-slate-200 dark:border-slate-700 font-medium text-slate-700 dark:text-slate-300 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition flex items-center justify-center gap-2"
        >
          {/* Google Icon SVG */}
          <svg className="h-5 w-5" viewBox="0 0 24 24">
            <path
              fill="#EA4335"
              d="M5.266 9.765A7.077 7.077 0 0 1 12 4.909c1.69 0 3.218.6 4.418 1.582L19.91 3C17.782 1.145 15.055 0 12 0 7.27 0 3.198 2.698 1.24 6.65l4.026 3.115Z"
            />
            <path
              fill="#4285F4"
              d="M16.04 15.345c-1.077.733-2.436 1.145-4.04 1.145a7.089 7.089 0 0 1-6.734-4.855L1.24 14.75C3.198 18.702 7.27 21.4 12 21.4c2.99 0 5.704-1 7.79-2.722l-3.75-3.333Z"
            />
            <path
              fill="#FBBC05"
              d="M5.266 14.235A7.141 7.141 0 0 1 4.91 12c0-.79.13-1.555.356-2.265L1.24 6.62A11.94 11.94 0 0 0 0 12c0 1.92.454 3.736 1.24 5.38l4.026-3.145Z"
            />
            <path
              fill="#34A853"
              d="M23.49 12.275c0-.818-.073-1.609-.21-2.373H12v4.491h6.445c-.277 1.482-1.113 2.736-2.37 3.582l3.75 3.332c2.195-2.027 3.664-5.014 3.664-8.757Z"
            />
          </svg>
          Register with Google
        </Button>

        {/* Login Redirect Link */}
        <p className="text-center text-sm text-slate-600 dark:text-slate-400 mt-6">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline"
          >
            Login here
          </Link>
        </p>

      </div>
    </div>
  );
}
