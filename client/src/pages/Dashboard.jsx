import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import SkillsList from "../components/SkillsList";
import MistakeList from "../components/MistakeList";
import TimelineFeed from "../components/TimelineFeed";

const Dashboard = () => {
  const dashboardRef = useRef(null);
  const [summary, setSummary] = useState(null);
  const [mistakes, setMistakes] = useState([]);
  const [patterns, setPatterns] = useState([]);
  const [timeline, setTimeline] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAll = async () => {
    try {
      const [summaryRes, mistakesRes, patternsRes, timelineRes] = await Promise.all([
        fetch("http://localhost:5000/api/dashboard/summary"),
        fetch("http://localhost:5000/api/mistakes"),
        fetch("http://localhost:5000/api/mistakes/patterns"),
        fetch("http://localhost:5000/api/dashboard/timeline"),
      ]);

      if (!summaryRes.ok || !mistakesRes.ok || !patternsRes.ok || !timelineRes.ok) {
        throw new Error("Failed to fetch dashboard data");
      }

      const [summaryData, mistakesData, patternsData, timelineData] = await Promise.all([
        summaryRes.json(),
        mistakesRes.json(),
        patternsRes.json(),
        timelineRes.json(),
      ]);

      setSummary(summaryData);
      setMistakes(mistakesData);
      setPatterns(patternsData);
      setTimeline(timelineData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
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
        <MistakeList mistakes={mistakes} patterns={patterns} />
      )}

      {!loading && timeline.length > 0 && (
        <TimelineFeed events={timeline} />
      )}
    </main>
  );
};

action

export default Dashboard;