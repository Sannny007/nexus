import { useState, useEffect, useRef } from "react";
import { Send } from "lucide-react";
import { apiFetch } from "../utils/api";

const STORAGE_KEY = "nexus_search_history";

const NexusSearch = () => {
  const [messages, setMessages] = useState(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  });
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = { role: "user", content: input };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput("");
    setLoading(true);

    try {
      const data = await apiFetch("/search", {
        method: "POST",
        body: JSON.stringify({
          message: userMessage.content,
          history: messages,
        }),
      });

      setMessages([
        ...updatedMessages,
        { role: "assistant", content: data.answer },
      ]);
    } catch (err) {
      setMessages([
        ...updatedMessages,
        { role: "assistant", content: `Error: ${err.message}` },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex h-screen flex-col p-8">
      <div className="mb-6">
        <p className="mb-2 text-sm text-zinc-500">NEXUS Search</p>
        <h1 className="text-3xl font-semibold tracking-tight">Ask NEXUS</h1>
      </div>

      <div className="flex-1 space-y-4 overflow-y-auto rounded-2xl border border-white/10 bg-white/3 p-6">
        {messages.length === 0 && (
          <p className="text-sm text-zinc-500">Ask anything to get started.</p>
        )}

        {messages.map((msg, i) => (
          <div
            key={i}
            className={`max-w-2xl rounded-xl px-4 py-3 text-sm ${
              msg.role === "user"
                ? "ml-auto bg-white text-zinc-950"
                : "bg-white/5 text-zinc-200"
            }`}
          >
            {msg.content}
          </div>
        ))}

        {loading && (
          <div className="max-w-2xl rounded-xl bg-white/5 px-4 py-3 text-sm text-zinc-500">
            Thinking...
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      <form onSubmit={handleSend} className="mt-4 flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask NEXUS anything..."
          className="flex-1 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm outline-none focus:border-white/30"
        />
        <button
          type="submit"
          disabled={loading}
          className="flex items-center justify-center rounded-xl bg-white px-4 text-zinc-950 transition hover:bg-zinc-200 disabled:opacity-50"
        >
          <Send size={18} />
        </button>
      </form>
    </main>
  );
};

export default NexusSearch;