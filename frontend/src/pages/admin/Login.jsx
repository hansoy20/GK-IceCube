import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function AdminLogin() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      const user = await login(email, password);
      if (user.role !== "ADMIN") {
        setError("This account doesn't have staff access.");
        return;
      }
      navigate("/admin");
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-arctic px-6">
      <div className="w-full max-w-sm rounded-xl bg-white p-8 shadow-frost">
        <p className="text-xs uppercase tracking-wide text-glacier">Staff Console</p>
        <h1 className="mt-1 font-display text-2xl font-600 text-arctic">GK Ice Cube Co.</h1>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="text-sm font-medium text-ink/70">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full rounded-lg border border-glacier/20 px-4 py-2.5 outline-none focus:border-glacier"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-ink/70">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full rounded-lg border border-glacier/20 px-4 py-2.5 outline-none focus:border-glacier"
            />
          </div>

          {error && <p className="text-sm text-coral">{error}</p>}

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-full bg-glacier py-2.5 font-medium text-white hover:bg-glacier-dark disabled:opacity-60"
          >
            {submitting ? "Signing in…" : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  );
}
