import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const [status, setStatus] = useState("verifying");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const verify = async () => {
      if (!token) {
        setStatus("error");
        setMessage("No verification token found.");
        return;
      }

      try {
        const res = await fetch(
          `http://localhost:5000/api/auth/verify-email?token=${token}`
        );
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || "Verification failed");
        }

        setStatus("success");
        setMessage(data.message);
      } catch (err) {
        setStatus("error");
        setMessage(err.message);
      }
    };

    verify();
  }, [token]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-950 text-white">
      <div className="w-full max-w-sm rounded-2xl border border-white/10 bg-white/3 p-8 text-center">
        {status === "verifying" && <p className="text-sm text-zinc-400">Verifying your email...</p>}

        {status === "success" && (
          <>
            <h1 className="mb-2 text-xl font-semibold text-emerald-400">Email Verified</h1>
            <p className="mb-6 text-sm text-zinc-500">{message}</p>
            <Link
              to="/login"
              className="inline-block rounded-lg bg-white px-4 py-2 text-sm font-medium text-zinc-950 hover:bg-zinc-200"
            >
              Go to Login
            </Link>
          </>
        )}

        {status === "error" && (
          <>
            <h1 className="mb-2 text-xl font-semibold text-rose-400">Verification Failed</h1>
            <p className="text-sm text-zinc-500">{message}</p>
          </>
        )}
      </div>
    </div>
  );
};

export default VerifyEmail;