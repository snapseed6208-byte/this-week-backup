import { useLocation } from "wouter";
import type { ThemeTemplate } from "@/lib/types";
import { getIconComponent } from "@/lib/icon-map";

interface ThemeCardProps {
  theme: ThemeTemplate;
  compact?: boolean;
}

export function ThemeCard({ theme }: ThemeCardProps) {
  const [, navigate] = useLocation();
  const IconComponent = getIconComponent(theme.icon);

  return (
    <div
      className="card cursor-pointer active:opacity-80 transition-opacity"
      onClick={() => navigate(`/theme/${theme.id}`)}
    >
      <div className="flex items-start gap-4">
        {/* Icon */}
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center text-base shrink-0"
          style={{ backgroundColor: `${theme.color}14` }}
        >
          <IconComponent className="h-5 w-5" style={{ color: theme.color }} />
        </div>

        <div className="flex-1 min-w-0">
          {/* Title — prominent */}
          <h3 className="text-[16px] font-semibold text-[#2F2D28] leading-tight mb-1">
            {theme.title}
          </h3>

          {/* Description — the hook */}
          <p className="text-sm text-[#8B867D] leading-relaxed line-clamp-2">
            {theme.description}
          </p>
        </div>
      </div>
    </div>
  );
}
