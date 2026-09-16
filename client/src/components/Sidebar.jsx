import {
  LayoutDashboard,
  FolderKanban,
  Brain,
  BookOpen,
  Search,
  Settings,
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <aside className="fixed left-0 top-0 flex h-screen w-64 flex-col border-r border-white/10 bg-zinc-950 px-4 py-5 text-white">
      {/* Logo */}
      <div className="mb-10 flex items-center gap-3 px-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-sm font-bold text-black">
          N
        </div>

        <div>
          <h1 className="font-semibold tracking-wide">NEXUS</h1>
          <p className="text-[10px] text-zinc-500">Developer Intelligence</p>
        </div>
      </div>

      {/* Navigation Bar */}
      <nav className="space-y-1">
        <SidebarItem
          icon={<LayoutDashboard size={18} />}
          label="Overview"
          active={location.pathname === "/"}
          onClick={() => navigate("/")}
        />

        <SidebarItem icon={<FolderKanban size={18} />} label="Projects" />

        <SidebarItem icon={<Brain size={18} />} label="Knowledge" />

        <SidebarItem icon={<BookOpen size={18} />} label="Learning" />

        <SidebarItem icon={<Search size={18} />} label="NEXUS Search..." />
      </nav>

      <div className="mt-auto">
        <SidebarItem
          icon={<Settings size={18} />}
          label="Settings"
          active={location.pathname === "/settings"}
          onClick={() => navigate("/settings")}
        />
      </div>
    </aside>
  );
};

const SidebarItem = ({ icon, label, active = false, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-all duration-300 ${
        active ? "bg-white/10 text-white" : "text-zinc-500 hover:bg-white/5 hover:text-white"
      }`}
    >
      {icon} <span>{label}</span>
    </button>
  );
};

export default Sidebar;