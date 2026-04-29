"use client";

import Link from "next/link";
import { LayoutDashboard, ShoppingCart, Cpu, LogOut, Menu } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

const navItems = [
  { title: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { title: "Data Penjualan", href: "/dashboard/sales", icon: ShoppingCart },
  { title: "Prediksi Produk", href: "/dashboard/predict", icon: Cpu },
];

export function Sidebar({ className = "" }: { className?: string }) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    document.cookie = "access_token=; max-age=0; path=/";
    router.push("/login");
  };

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
          <p className="px-4 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Menu</p>
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

      <div className="p-4">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 rounded-xl w-full text-destructive hover:bg-destructive/10 transition-colors duration-200 text-sm font-medium"
        >
          <LogOut className="w-5 h-5" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}
