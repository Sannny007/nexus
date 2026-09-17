import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/Authcontext";
import { apiFetch } from "../utils/api";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const data = await apiFetch("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });

      login(data.user, data.token);
      navigate("/");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-950 text-white">
      <form
      onSubmit={handleSubmit}
      className="w-full max-w-sm rounded-2xl border border-white/10 bg-white/3 p-8" >
        <h1 className="mb-1 text-2xl font-semibold">Welcome back</h1>
        <p className="mb-6 text-sm text-zinc-500">Log in to NEXUS</p>

        {error && (
          <p className="mb-4 rounded-lg bg-rose-500/10 px-3 py-2 text-sm text-rose-400">{error}</p>
        )}

        <label className="mb-1 block text-sx text-zinc-500">Email</label>

        <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        className="mb-4 w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm outline-none focus:border-white/30"/>

        <label className="mb-1 block text-xs text-zinc-500">Password</label>

        <input 
        type="password"
        value={password}
         onChange={(e) => setPassword(e.target.value)}
         required
         className="mb-6 w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm outline-none focus:border-white/30"
        />

        <button type="submit" disabled={loading} className="w-full rounded-lg bg-white py-2 text-sm font-medium text-zinc-950 transition hover:bg-zinc-200 disabled:opacity-50">
          {loading ? "Logging in..." : "Log in"}
          </button>

          <p className="mt-4 text-center text-xs text-zinc-500">
            No Account?{" "}
            <Link to="/register" className="text-white underline">Register</Link>
          </p>
      </form>
    </div>
  );
};

export default Login;