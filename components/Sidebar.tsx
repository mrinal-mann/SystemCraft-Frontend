"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FolderKanban, ChevronLeft, LogOut, User } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Logo } from "@/components/ui/Logo";

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const navItems = [
    { label: "Projects", href: "/dashboard", icon: FolderKanban },
  ];

  return (
    <aside
      className={`flex flex-col h-screen bg-[#0B1220] border-r border-slate-800 transition-all duration-200 ${
        collapsed ? "w-14" : "w-60"
      }`}
    >
      {/* Logo Toggle */}
      <div
        onClick={() => setCollapsed(!collapsed)}
        className="flex items-center justify-between h-16 px-4 border-b border-slate-800 cursor-pointer hover:bg-slate-800/30 transition-colors group"
      >
        {!collapsed ? (
          <div className="flex items-center gap-3">
            <Logo size={28} showText={true} />
          </div>
        ) : (
          <div className="mx-auto">
            <Logo size={24} showText={false} />
          </div>
        )}
        {!collapsed && (
          <div className="p-1 text-gray-500 group-hover:text-gray-300 rounded transition-colors">
            <ChevronLeft className="w-4 h-4" />
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 p-2 space-y-1">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href || pathname.startsWith("/projects");
          const Icon = item.icon;
          return (
            <Link
              key={item.label}
              href={item.href}
              className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                isActive
                  ? "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20"
                  : "text-gray-400 hover:bg-slate-800/50 hover:text-gray-200"
              } ${collapsed ? "justify-center px-0" : ""}`}
              title={collapsed ? item.label : undefined}
            >
              <Icon
                className={`w-4 h-4 shrink-0 ${isActive ? "text-indigo-400" : ""}`}
              />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* User */}
      <div className="p-2 border-t border-slate-800 bg-[#0B1220]">
        {!collapsed && user && (
          <div className="flex items-center gap-2 px-3 py-2 mb-1">
            <div className="w-6 h-6 bg-slate-800 rounded-full flex items-center justify-center border border-slate-700">
              <User className="w-3 h-3 text-gray-400" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-gray-200 truncate">
                {user.full_name || "User"}
              </p>
              <p className="text-[10px] text-gray-500 truncate">{user.email}</p>
            </div>
          </div>
        )}
        <button
          onClick={logout}
          className={`flex items-center gap-2.5 w-full px-3 py-2 rounded-lg text-sm font-medium text-gray-400 hover:bg-red-500/10 hover:text-red-400 transition-colors ${
            collapsed ? "justify-center" : ""
          }`}
          title={collapsed ? "Logout" : undefined}
        >
          <LogOut className="w-4 h-4 shrink-0" />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
}
