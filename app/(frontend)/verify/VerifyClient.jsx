"use client";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function VerifyClient() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState("Verifying...");

  useEffect(() => {
    const token = searchParams.get("token");
    if (token) {
      fetch(`/api/emailVerification?token=${token}`)
        .then(res => res.json())
        .then(data => {
          if (data.message) {
            setStatus("✅ Email verified successfully! You can now log in.");
            // Optionally redirect after few seconds
            setTimeout(() => router.push("/signin"), 3000);
          } else {
            setStatus("❌ Verification failed: " + (data.error || "Unknown error"));
          }
        })
        .catch(err => setStatus("❌ Something went wrong."));
    }
  }, [searchParams]);

  return (
    <div className="h-[45vh] flex items-center justify-center flex-col">
        <div className="w-full max-w-md mx-auto">
            <div className="bg-white p-8 border border-gray-200">
                <div className="text-center mb-6">
                    <h1 className="text-2xl font-serif mb-2">Email Verification</h1>
                    <p className="text-sm text-gray-600">{status}</p>
                </div>   
            </div>
        </div>
    </div>
  );
}
