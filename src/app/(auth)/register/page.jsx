"use client";

import { authClient } from "@/lib/auth-client";
import { syncAuthAfterLogin } from "@/lib/api";
import { validatePassword } from "@/lib/password";
import { Card, Form, Button, Input } from "@heroui/react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { toast } from "react-toastify";
import PageTitle from "@/components/PageTitle";

function RegisterForm() {
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
    const name = String(formData.get("name") || "").trim();
    const email = String(formData.get("email") || "").trim();
    const password = String(formData.get("password") || "");
    const image = String(formData.get("image") || "").trim();

    // পাসওয়ার্ড ভ্যালিডেশন চেক
    const passwordError = validatePassword(password);
    if (passwordError) {
      toast.error(passwordError);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await authClient.signUp.email({
        name,
        email,
        password,
        image: image || undefined
      });

      if (error) {
        const msg = error.message || "";
        if (msg.toLowerCase().includes("database") || msg.includes("503")) {
          toast.error("Something went wrong with the database connection.");
        } else { // 💡 এখানে কোলন এররটি ফিক্স করা হয়েছে (} else {)
          toast.error(msg || "Registration failed.");
        }
        setLoading(false);
        return;
      }

      if (data) {
        await syncAuthAfterLogin(authClient);
        toast.success("Account created successfully!");
        router.push(redirectPath);
        router.refresh();
      }
    } catch (err) {
      console.error(err);
      toast.error("An unexpected error occurred.");
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
      <PageTitle title="Register" />
      
      <div className="text-center mb-6">
        <h1 className="text-2xl md:text-4xl font-bold">Create Account</h1>
        <p className="text-gray-500 mt-2">Join IdeaVault and start sharing ideas</p>
      </div>

      <Card className="p-4 shadow-none border-0 bg-transparent">
        <Form className="flex flex-col gap-4" onSubmit={onSubmit} validationBehavior="native">
          
          {/* Name Field */}
          <div className="w-full">
            <label className="block mb-1 text-sm font-medium text-slate-700 dark:text-slate-300">Name</label>
            <Input 
              name="name" 
              placeholder="Your full name" 
              isRequired 
              className="w-full" 
            />
          </div>

          {/* Email Field */}
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

          {/* Photo URL Field */}
          <div className="w-full">
            <label className="block mb-1 text-sm font-medium text-slate-700 dark:text-slate-300">Photo URL</label>
            <Input 
              name="image" 
              type="url" 
              placeholder="https://example.com/photo.jpg" 
              className="w-full" 
            />
          </div>

          {/* Password Field */}
          <div className="w-full">
            <label className="block mb-1 text-sm font-medium text-slate-700 dark:text-slate-300">Password</label>
            <Input
              name="password"
              type={isShowPassword ? "text" : "password"}
              placeholder="Min 6 chars, upper & lower case"
              isRequired
              className="w-full"
            />
          </div>

          {/* Password Toggle */}
          <button
            type="button"
            onClick={() => setIsShowPassword(!isShowPassword)}
            className="text-sm text-indigo-600 flex items-center gap-1 hover:underline font-medium mt-1 self-start"
          >
            {isShowPassword ? (
              <>Hide Password <FaEye /></>
            ) : (
              <>Show Password <FaEyeSlash /></>
            )}
          </button>

          {/* Submit Button */}
          <Button type="submit" isLoading={loading} className="w-full bg-indigo-600 text-white font-semibold py-2 rounded-xl mt-2 shadow-md">
            Register
          </Button>

          <p className="text-center text-sm text-slate-600 dark:text-slate-400 mt-2">
            Already have an account?{" "}
            <Link href={`/login?redirect=${encodeURIComponent(redirectPath)}`} className="text-indigo-600 font-semibold hover:underline">
              Login
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

export default function RegisterPage() {
  return (
    <Suspense fallback={<p className="text-center py-20 text-slate-500">Loading Register Form...</p>}>
      <RegisterForm />
    </Suspense>
  );
}