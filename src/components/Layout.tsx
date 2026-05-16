import type { ReactNode } from "react";
import { useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { Home, LayoutGrid, BarChart3 } from "lucide-react";

interface LayoutProps {
  children: ReactNode;
  title?: string;
}

export function Layout({ children, title }: LayoutProps) {
  const [location, navigate] = useLocation();

  const navItems = [
    { path: "/", icon: Home, label: "本周" },
    { path: "/library", icon: LayoutGrid, label: "主题库" },
    { path: "/history", icon: BarChart3, label: "记录" },
  ];

  return (
    <div className="page-container">
      {title && (
        <header className="mb-4">
          <h1 className="text-xl font-bold text-[#1E293B]">{title}</h1>
        </header>
      )}
      <main>{children}</main>
      <nav className="bottom-nav">
        {navItems.map(({ path, icon: Icon, label }) => (
          <button
            key={path}
            onClick={() => navigate(path)}
            className={cn(
              "flex flex-col items-center gap-0.5 px-4 py-1 text-xs transition-colors",
              location === path
                ? "text-[#8B5CF6] font-medium"
                : "text-[#94A3B8] hover:text-[#64748B]",
            )}
          >
            <Icon className="h-5 w-5" />
            <span>{label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}
