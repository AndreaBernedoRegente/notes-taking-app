"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";
import api from "@/lib/api";
import { AuthResponse } from "@/types";
import PasswordInput from "@/components/auth/PasswordInput";

export default function LoginPage() {
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
    if (!password) {
      setError("Password is required.");
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
      const { data } = await api.post<AuthResponse>("/auth/login/", {
        email,
        password,
      });
      login(data.access, data.refresh, data.user);
      router.push("/");
    } catch {
      setError("Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="flex flex-col items-center w-full max-w-sm px-8">
        <Image
          src="/cactus.png"
          alt="Cactus"
          width={160}
          height={160}
          className="mb-4"
        />
        <h1 className="text-4xl font-serif mb-8 text-primary">
          Yay, You&apos;re Back!
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
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
        <Link href="/signup" className="text-xs mt-4 hover:underline text-primary">
          Oops! I&apos;ve never been here before
        </Link>
      </div>
    </div>
  );
}
