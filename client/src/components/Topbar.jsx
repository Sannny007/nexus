import { Bell, Search, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Topbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="flex h-16 items-center justify-between border-b border-white/10 px-8">
      <div className="relative w-80">
        <Search
          size={17}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500"
        />

        <input
          type="text"
          placeholder="Search Nexus...."
          className="w-full rounded-xl border border-white/10 bg-white/3 py-2 pl-10 pr-4 text-sm text-white outline-none placeholder:text-zinc-600 transition focus:border-white/20 focus:bg-white/5"
        />
      </div>

      <div className="flex items-center gap-4">
        <button className="flex h-9 w-9 items-center justify-center rounded-xl text-zinc-500 transition hover:bg-white/5 hover:text-white">
          <Bell size={18} />
        </button>

        <button
          onClick={handleLogout}
          title="Log out"
          className="flex h-9 w-9 items-center justify-center rounded-xl text-zinc-500 transition hover:bg-white/5 hover:text-rose-400"
        >
          <LogOut size={18} />
        </button>

        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-sm font-medium text-black">
          {user?.name ? user.name.charAt(0).toUpperCase() : "S"}
        </div>
      </div>
    </header>
  );
};

export default Topbar;