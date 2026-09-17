import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import SkillsList from "../components/SkillsList";
import MistakeList from "../components/MistakeList";
import TimelineFeed from "../components/TimelineFeed";
import { apiFetch } from "../utils/api";

const Dashboard = () => {
  const dashboardRef = useRef(null);
  const [dashboardData, setDashboardData] = useState({
    summary: null,
    mistakes: [],
    patterns: [],
    timeline: [],
  });
  const [loading, setLoading] = useState(true);

  const fetchAll = async () => {
    try {
      const [summaryData, mistakesData, patternsData, timelineData] = await Promise.all([
        apiFetch("/dashboard/summary"),
        apiFetch("/mistakes"),
        apiFetch("/mistakes/patterns"),
        apiFetch("/dashboard/timeline"),
      ]);

      setDashboardData({
        summary: summaryData,
        mistakes: mistakesData,
        patterns: patternsData,
        timeline: timelineData,
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        const [summaryData, mistakesData, patternsData, timelineData] = await Promise.all([
          apiFetch("/dashboard/summary"),
          apiFetch("/mistakes"),
          apiFetch("/mistakes/patterns"),
          apiFetch("/dashboard/timeline"),
        ]);

        if (cancelled) return;

        setDashboardData({
          summary: summaryData,
          mistakes: mistakesData,
          patterns: patternsData,
          timeline: timelineData,
        });
      } catch (err) {
        if (!cancelled) console.error(err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    void load();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (loading) return;

    const ctx = gsap.context(() => {
      const elements = dashboardRef.current.querySelectorAll(".animate-in");
      gsap.killTweensOf(elements);
      gsap.set(elements, { opacity: 0, y: 20 });
      gsap.to(elements, {
        opacity: 1,
        y: 0,
        duration: 0.6,
        stagger: 0.15,
        ease: "power3.out",
        overwrite: "auto",
      });
    }, dashboardRef);

    return () => ctx.revert();
  }, [loading]);

  const { summary, mistakes, patterns, timeline } = dashboardData;

  return (
    <main ref={dashboardRef} className="p-8">
      <div className="mb-8 animate-in">
        <p className="mb-2 text-sm text-zinc-500">Overview</p>
        <h1 className="text-3xl font-semibold tracking-tight">Developer Overview</h1>
        <p className="mt-2 text-sm text-zinc-500">Your development journey at a glance.</p>
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
        <div className="animate-in rounded-2xl border border-white/10 bg-white/3 p-6 transition duration-300 hover:-translate-y-1 hover:bg-white/5">
          <p className="text-sm text-zinc-500">Skills</p>
          <p className="mt-3 text-3xl font-semibold">
            {loading ? "--" : String(summary?.totalSkills ?? 0).padStart(2, "0")}
          </p>
          <p className="mt-2 text-xs text-zinc-600">Tracked skills</p>
        </div>

        <div className="animate-in rounded-2xl border border-white/10 bg-white/3 p-6 transition duration-300 hover:-translate-y-1 hover:bg-white/5">
          <p className="text-sm text-zinc-500">Projects</p>
          <p className="mt-3 text-3xl font-semibold">
            {loading ? "--" : String(summary?.totalProjects ?? 0).padStart(2, "0")}
          </p>
          <p className="mt-2 text-xs text-zinc-600">Active projects</p>
        </div>

        <div className="animate-in rounded-2xl border border-white/10 bg-white/3 p-6 transition duration-300 hover:-translate-y-1 hover:bg-white/5">
          <p className="text-sm text-zinc-500">Knowledge Strength</p>
          <p className="mt-3 text-3xl font-semibold">
            {loading ? "--" : `${summary?.knowledgeStrength ?? 0}%`}
          </p>
          <p className="mt-2 text-xs text-zinc-600">Decay-weighted average</p>
        </div>
      </div>

      {!loading && summary?.skills && (
        <SkillsList skills={summary.skills} onPracticed={fetchAll} />
      )}

      {!loading && (
        <MistakeList mistakes={mistakes} patterns={patterns} onResolved={fetchAll} />
      )}
      {!loading && timeline.length > 0 && (
        <TimelineFeed events={timeline} />
      )}
    </main>
  );
};

export default Dashboard;