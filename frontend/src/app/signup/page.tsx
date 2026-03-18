"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";
import api from "@/lib/api";
import { AuthResponse } from "@/types";
import PasswordInput from "@/components/auth/PasswordInput";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const validate = () => {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Enter a valid email address.");
      return false;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!validate()) return;
    setLoading(true);
    try {
      const { data } = await api.post<AuthResponse>("/auth/register/", {
        email,
        password,
      });
      login(data.access, data.refresh, data.user);
      router.push("/");
    } catch (err: unknown) {
      if (axios.isAxiosError(err) && err.response?.data) {
        const data = err.response.data;
        const firstError = Object.values(data)[0];
        if (Array.isArray(firstError) && typeof firstError[0] === "string") {
          setError(firstError[0]);
        } else {
          setError("Could not create account.");
        }
      } else {
        setError("Could not create account.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="flex flex-col items-center w-full max-w-sm px-8">
        <Image
          src="/cat.png"
          alt="Cat"
          width={160}
          height={160}
          className="mb-6"
        />
        <h1 className="text-4xl font-serif mb-8 text-primary">
          Yay, New Friend!
        </h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3 w-full">
          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-full px-4 py-2.5 text-sm bg-transparent outline-none border border-primary text-foreground"
            required
          />
          <PasswordInput value={password} onChange={setPassword} />
          {error && <p className="text-red-400 text-xs text-center">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="rounded-full py-2.5 text-sm font-medium transition-colors mt-2 border border-primary text-primary bg-transparent"
          >
            {loading ? "Creating account..." : "Sign Up"}
          </button>
        </form>
        <Link href="/login" className="text-xs mt-4 hover:underline text-primary">
          We&apos;re already friends
        </Link>
      </div>
    </div>
  );
}
