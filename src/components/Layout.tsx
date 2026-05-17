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
        <header className="mb-6">
          <h1 className="text-xl font-semibold tracking-tight text-[#2C2A28]">
            {title}
          </h1>
        </header>
      )}
      <main>{children}</main>
      <nav className="bottom-nav">
        <div className="bottom-nav-inner">
          {navItems.map(({ path, icon: Icon, label }) => (
            <button
              key={path}
              onClick={() => navigate(path)}
              className={cn(
                "flex flex-col items-center gap-0.5 px-5 py-1 text-[11px] tracking-wide transition-colors",
                location === path
                  ? "text-[#8E7DBE] font-medium"
                  : "text-[#BFB8B0]",
              )}
            >
              <Icon className={cn(
                "h-5 w-5 transition-colors",
                location === path ? "text-[#8E7DBE]" : "text-[#C8C2BA]",
              )} />
              <span>{label}</span>
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
}
