const MistakesList = ({ mistakes, patterns }) => {
  const patternSkillIds = new Set(patterns.map((p) => p.skill_id));

  return(
    <div className="mt-8 animate-in rounded-2xl border border-white/10 bg-white/3 p-6">
      <h2 className="mb-4 text-lg font-semibold">Recent Mistakes</h2>


      {patterns.length > 0 && (
        <div className="mb-5 rounded-xl border border-amber-500/20 bg-amber-500/5 px-4 py-3">
          <p className="text-xs text-amber-400">Recurring pattern detected:{" "}
            {patterns.map((p) => `${p.skill_name} (${p.mistake_count}x)`).join(", ")}
          </p>
        </div>
      )}


      <div className="space-y-3">
        {mistakes.map((mistake) => (
          <div
          key={mistake.id}
          className="rounded-xl border border-white/5 bg-white/2 px-4 py-3">

            <div className="flex items-center justify-between">
              <p className="text-sm font-medium">{mistake.title}</p>

              <span 
              className={`rounded-full px-2 py-0.5 text-[10px] ${mistake.status === "resolved" ? "bg-emerald-500/10 text-emerald-400" : "bg-rose-500/10 text-rose-400"}`}>{mistake.status}</span>
            </div>

            <p className="mt-1 text-xs text-zinc-500">{mistake.skill_name || "General"} {mistake.project_name ? ` . ${mistake.project_name}` : ""}</p>

            {mistake.description && (
              <p className="mt-2 text-xs text-zinc-400">{mistake.description}</p>
            )}
            </div>
        ))}
      </div>
    </div>
  );
};

export default MistakesList;