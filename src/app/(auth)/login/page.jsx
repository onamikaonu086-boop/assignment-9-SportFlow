"use client";

import { authClient } from "@/lib/auth-client";
import { syncAuthAfterLogin } from "@/lib/api";
import { Card, Form, Button, Input } from "@heroui/react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { toast } from "react-toastify";
import PageTitle from "@/components/PageTitle";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get("redirect") || "/";

  const [isShowPassword, setIsShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    
    const form = e.currentTarget;
    if (!form.checkValidity()) return;

    setLoading(true);
    const formData = new FormData(form);
    const email = String(formData.get("email") || "").trim();
    const password = String(formData.get("password") || "");

    try {
      const { data, error } = await authClient.signIn.email({ email, password });

      if (error) {
        toast.error(error.message || "Login failed.");
        setLoading(false);
        return;
      }

      if (data) {
        await syncAuthAfterLogin(authClient);
        toast.success("Welcome back to IdeaVault");
        router.push(redirectPath);
        router.refresh();
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const callbackURL = `${window.location.origin}${redirectPath}`;
      await authClient.signIn.social({
        provider: "google",
        callbackURL,
      });
    } catch (err) {
      console.error(err);
      toast.error("Google sign-in failed");
    }
  };

  return (
    <div className="container mx-auto max-w-md md:mb-20 my-10 p-6 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-lg bg-white dark:bg-slate-900">
      <PageTitle title="Login" />

      <div className="text-center mb-6">
        <h1 className="text-2xl md:text-4xl font-bold">Welcome Back</h1>
        <p className="text-gray-500 mt-2">Sign in to share and validate startup ideas</p>
      </div>
      
      <Card className="p-4 shadow-none border-0 bg-transparent">
        <Form className="flex flex-col gap-4" onSubmit={onSubmit} validationBehavior="native">
          
          {/* Email Input */}
          <div className="w-full">
            <label className="block mb-1 text-sm font-medium text-slate-700 dark:text-slate-300">Email</label>
            <Input 
              name="email" 
              type="email" 
              placeholder="you@example.com" 
              isRequired 
              className="w-full" 
            />
          </div>

          {/* Password Input */}
          <div className="w-full">
            <label className="block mb-1 text-sm font-medium text-slate-700 dark:text-slate-300">Password</label>
            <Input
              name="password"
              type={isShowPassword ? "text" : "password"}
              placeholder="Enter your password"
              isRequired
              className="w-full"
            />
          </div>

          {/* Password Toggle & Forgot Password */}
          <div className="flex items-center justify-between mt-1">
            <button
              type="button"
              onClick={() => setIsShowPassword(!isShowPassword)}
              className="text-sm text-indigo-600 flex items-center gap-1 hover:underline font-medium"
            >
              {isShowPassword ? (
                <>Hide Password <FaEye /></>
              ) : (
                <>Show Password <FaEyeSlash /></>
              )}
            </button>

            <Link href="#" className="text-sm text-indigo-600 hover:underline font-medium">
              Forgot Password?
            </Link>
          </div>

          {/* Submit Button */}
          <Button type="submit" isLoading={loading} className="w-full bg-indigo-600 text-white font-semibold py-2 rounded-xl mt-2 shadow-md">
            Login
          </Button>

          <p className="text-center text-sm text-slate-600 dark:text-slate-400 mt-2">
            New here?{" "}
            <Link href={`/register?redirect=${encodeURIComponent(redirectPath)}`} className="text-indigo-600 font-semibold hover:underline">
              Create an account
            </Link>
          </p>

          {/* Divider */}
          <div className="relative flex py-2 items-center">
            <div className="flex-grow border-t border-slate-200 dark:border-slate-800"></div>
            <span className="flex-shrink mx-4 text-slate-400 text-xs uppercase">Or</span>
            <div className="flex-grow border-t border-slate-200 dark:border-slate-800"></div>
          </div>

          {/* Google Sign-In */}
          <Button
            type="button"
            variant="bordered"
            className="w-full border-slate-200 dark:border-slate-700 font-medium text-slate-700 dark:text-slate-300 rounded-xl"
            onClick={handleGoogleSignIn}
          >
            <FcGoogle className="text-xl" /> Continue with Google
          </Button>
        </Form>
      </Card>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<p className="text-center py-20 text-slate-500">Loading Login Form...</p>}>
      <LoginForm />
    </Suspense>
  );
}