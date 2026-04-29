"use client";

import Link from "next/link";
import { LayoutDashboard, Users, Settings, LogIn, Menu } from "lucide-react";
import { usePathname } from "next/navigation";

const navItems = [
  { title: "Dashboard", href: "/", icon: LayoutDashboard },
  { title: "Users", href: "/users", icon: Users },
  { title: "Settings", href: "/settings", icon: Settings },
  { title: "Login", href: "/login", icon: LogIn },
];

export function Sidebar({ className = "" }: { className?: string }) {
  const pathname = usePathname();

  return (
    <aside className={`w-64 bg-sidebar border-r border-sidebar-border h-screen sticky top-0 flex flex-col ${className}`}>
      <div className="p-6 flex items-center gap-2">
        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
          <Menu className="text-white w-5 h-5" />
        </div>
        <span className="text-2xl font-bold text-sidebar-foreground">Modernize</span>
      </div>

      <div className="flex-1 px-4 overflow-y-auto">
        <nav className="space-y-1">
          <p className="px-4 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Home</p>
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors duration-200 ${
                  isActive 
                    ? "bg-primary text-primary-foreground font-medium" 
                    : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{item.title}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="p-4 m-4 bg-sidebar-accent rounded-xl">
        <div className="flex flex-col items-center text-center">
          <div className="font-semibold text-sm mb-1">Upgrade to Pro</div>
          <p className="text-xs text-muted-foreground mb-3">Get advanced features and priority support.</p>
          <button className="bg-primary text-primary-foreground text-xs font-semibold py-2 px-4 rounded-lg w-full hover:bg-primary/90 transition-colors">
            Upgrade Now
          </button>
        </div>
      </div>
    </aside>
  );
}
