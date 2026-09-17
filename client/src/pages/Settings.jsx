import { useEffect, useState } from "react";
import { apiFetch } from "../utils/api";
import { useAuth } from "../context/Authcontext";

const Settings = () => {
  const { login, token } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [profileMsg, setProfileMsg] = useState("");
  const [profileLoading, setProfileLoading] = useState(false);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [passwordMsg, setPasswordMsg] = useState("");
  const [passwordLoading, setPasswordLoading] = useState(false);

  useEffect(() => {
    const loadProfile = async () => {
      const data = await apiFetch("/users/me");
      setName(data.name);
      setEmail(data.email);
    };
    loadProfile();
  }, []);

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setProfileMsg("");
    setProfileLoading(true);

    try {
      const updated = await apiFetch("/users/me", {
        method: "PUT",
        body: JSON.stringify({ name, email }),
      });

      login(updated, token);
      setProfileMsg("Profile updated successfully");
    } catch (err) {
      setProfileMsg(err.message);
    } finally {
      setProfileLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordMsg("");
    setPasswordLoading(true);

    try {
      await apiFetch("/users/me/password", {
        method: "PUT",
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      setPasswordMsg("Password updated successfully.");
      setCurrentPassword("");
      setNewPassword("");
    } catch (err) {
      setPasswordMsg(err.message);
    } finally {
      setPasswordLoading(false);
    }
  };

  return (
    <main className="p-8">
      <div className="mb-8">
        <p className="mb-2 text-sm text-zinc-500">Settings</p>
        <h1 className="text-3xl font-semibold tracking-tight">Account Settings</h1>
        <p className="mt-2 text-sm text-zinc-500">Manange your profile and security.</p>
      </div>

      <div className="grid max-w-xl gap-8">
        <form
        onSubmit={handleProfileSubmit}
        className="rounded-2xl border border-white/10 bg-white/3 p-6"
        >
          <h2 className="mb-4 text-lg font-semibold">Profile</h2>

          {profileMsg && (
            <p className="mb-4 rounded-lg bg-white/5 px-3 py-2 text-sm text-zinc-300">{profileMsg}</p>
          )}

          <label className="mb-1 block text-xs text-zinc-500">Name</label>
          <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="mb-4 w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm outline-none focus:border-white/30"/>

          <label className="mb-1 block text-xs text-zinc-500">Email</label>
          <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="mb-6 w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm outline-none focus:border-white/30"/>

          <button
          type="submit"
          disabled={profileLoading}
          className="rounded-lg bg-white px-4 py-2 text-sm font-medium text-zinc-950 hover:bg-zinc-200 disabled:opacity-50">
            {profileLoading ? "Saving..." : "Save Profile"}
          </button>
        </form>

        <form
        onSubmit={handlePasswordSubmit}
        className="rounded-2xl border border-white/10 bg-white/3 p-6">
          <h2 className="mb-4 text-lg font-semibold">Change Password</h2>

          {passwordMsg && (
            <p className="mb-4 rounded-lg bg-white/5 px-3 py-2 text-sm text-zinc-300">
              {passwordMsg}
            </p>
          )}

          <label className="mb-1 block text-xs text-zinc-500">Current Password</label>
          <input
          type="password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          required
          className="mb-4 w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm outline-none focus:border-white/30"
          />

          <label className="mb-1 block text-xs text-zinc-500">New Password</label>
          <input
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
          className="mb-6 w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm outline-none focus:border-white/30"
          />

          <button
          type="submit"
          disabled={passwordLoading}
          className="rounded-lg bg-white px-4 py-2 text-sm font-medium text-zinc-950 transition hover:bg-zinc-200 disabled:opacity-50"
          >
            {passwordLoading ? "Updating..." : "Update Password"}
          </button>
        </form>
      </div>
    </main>
  );

};

export default Settings;