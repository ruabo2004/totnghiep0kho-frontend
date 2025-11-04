import { Link, useLocation } from "react-router-dom";
import { cn } from "@/utils/cn";
import type { LucideIcon } from "lucide-react";

interface SidebarItem {
  title: string;
  href: string;
  icon: LucideIcon;
}

interface SidebarProps {
  items: SidebarItem[];
}

export const Sidebar = ({ items }: SidebarProps) => {
  const location = useLocation();

  return (
    <div className="w-64 border-r bg-muted/40 min-h-screen">
      <nav className="space-y-1 p-4">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.href || 
                          location.pathname.startsWith(item.href + '/');

          return (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                "flex items-center space-x-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <Icon className="h-5 w-5" />
              <span>{item.title}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
};


