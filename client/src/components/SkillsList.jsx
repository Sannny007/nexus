import { useState } from "react";
import { apiFetch } from "../utils/api";

const SkillsList = ({ skills, onPracticed }) => {
  const [updatingSkill, setUpdatingSkill] = useState(null);

  const handlePractice = async (skillId, skillName) => {
    try {
      setUpdatingSkill(skillName);

      await apiFetch(`/skills/${skillId}/practice`, { method: "PUT" });

      onPracticed();
    } catch (err) {
      console.error(err);
    } finally {
      setUpdatingSkill(null);
    }
  };

  return (
    <div className="mt-8 animate-in rounded-2xl border border-white/10 bg-white/3 p-6">
      <h2 className="mb-4 text-lg font-semibold">Skill Decay</h2>
      <div className="space-y-3">
        {skills.map((skill) => (
          <div
            key={skill.skill_id}
            className="flex items-center justify-between rounded-xl border border-white/5 bg-white/2 px-4 py-3"
          >
            <div>
              <p className="text-sm font-medium">{skill.name}</p>
              <p className="text-xs text-zinc-500">
                {skill.level} · {skill.decayScore}% strength
              </p>
            </div>
            <button
              onClick={() => handlePractice(skill.skill_id, skill.name)}
              disabled={updatingSkill === skill.name}
              className="rounded-lg border border-white/10 px-3 py-1.5 text-xs text-zinc-300 transition hover:bg-white/10 disabled:opacity-50"
            >
              {updatingSkill === skill.name ? "Updating..." : "Mark practiced"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SkillsList;