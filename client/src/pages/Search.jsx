import { useState } from "react";
import { apiFetch } from "../utils/api";

const Search = () => {
  const [query, setQuery] = useState("");
  const [history, setHistory] = useState([]);
  const [answer, setAnswer] = useState("");
  const [citations, setCitations] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!query.trim() || loading) return;

    setLoading(true);
    setAnswer("");
    setCitations([]);

    try {
      const newHistory = [...history, { role: "user", content: query }];
      const data = await apiFetch("/search", {
        method: "POST",
        body: JSON.stringify({
          message: query,
          history,
        }),
      });

      setHistory(newHistory);
      setAnswer(data.answer);
      setCitations(data.citations || []);
      setQuery("");
    } catch (err) {
      const newHistory = [...history, { role: "user", content: query }];
      setHistory(newHistory);
      setAnswer(
        err.message || "Failed to get a response. Please try again.",
      );
      setCitations([]);
      setQuery(query);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex flex-col gap-6 p-8">
      <div className="mb-2">
        <p className="mb-2 text-sm text-zinc-500">Search</p>
        <h1 className="text-3xl font-semibold tracking-tight">NEXUS Search</h1>
        <p className="mt-2 text-sm text-zinc-500">
          Ask anything — answers are grounded with live web results.
        </p>
      </div>

      <div className="flex flex-col gap-4">
        {history.length > 0 && (
          <div className="space-y-4">
            {history.map((turn, idx) => (
              <div
                key={idx}
                className={`rounded-2xl border border-white/10 bg-white/3 px-4 py-3 text-sm ${
                  turn.role === "user"
                    ? "ml-auto max-w-[70%] border-white/20"
                    : "mr-auto max-w-[70%]"
                }`}
              >
                {turn.content}
              </div>
            ))}
          </div>
        )}

        {answer && (
          <div className="rounded-2xl border border-white/10 bg-white/3 px-4 py-4 text-sm whitespace-pre-wrap">
            {answer}
          </div>
        )}

        {citations.length > 0 && (
          <div className="rounded-2xl border border-white/10 bg-white/3 px-4 py-3">
            <p className="mb-2 text-xs text-zinc-500">Sources</p>
            <ul className="space-y-1 text-xs">
              {citations.map((c, idx) => (
                <li key={idx}>
                  <a
                    href={c.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-zinc-300 break-all hover:text-white hover:underline"
                  >
                    {c.title || c.url}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ask a question..."
            disabled={loading}
            className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white outline-none placeholder:text-zinc-600 focus:border-white/30 disabled:opacity-50"
          />
        </form>
      </div>
    </main>
  );
};

export default Search;
