const formateRelativeTime = (isoString) => {
  const eventDate = new Date(isoString);
  const now = new Date();
  const diffMs = now.getTime() - eventDate.getTime();

  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));


  if (diffMinutes < 60) return `${diffMinutes}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  return `${diffDays}d ago`;
};


const eventIcons = {
  mistake: "⚠",
  practice: "●",
  project: "◆",
};


const eventLabels = {
  mistake: "Logged a mistake",
  practice: "Practiced",
  project: "started project",
};

const TimelineFeed = ({ events }) => {
  return (
    <div className="mt-8 animate-in rounded-2xl border border-white/10 bg-white/3 p-6">
      <h2 className="mb-4 text-lg font-semibold">Developer Timeline</h2>

      <div className="space-y-3">
        {events.map((event, index) => (
          <div
            key={`${event.event_type}-${event.title}-{index}`}
            className="flex items-center justify-between rounded-xl border border-white/5 bg-white/2 px-4 py-3"
          >
            <div className="flex items-center gap-3">
              <span className="text-sm text-zinc-500">{eventIcons[event.event_type]}</span>

              <div>
                <p className="text-sm font-medium">{event.title}</p>
                <p className="text-xs text-zinc-500">{eventLabels[event.event_type]}</p>
              </div>
            </div>
            <span className="text-xs text-zinc-600">{formateRelativeTime(event.event_time)}</span>
          </div>
        ))}
      </div>
    </div>
  );
};


export default TimelineFeed;