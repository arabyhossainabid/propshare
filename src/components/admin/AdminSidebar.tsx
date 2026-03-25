"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    Users,
    Building2,
    FolderTree,
    Wallet,
    Star,
    LogOut,
    ChevronRight,
    ShieldCheck,
} from "lucide-react";

const adminLinks = [
    { name: "Overview", href: "/admin", icon: LayoutDashboard },
    { name: "Users", href: "/admin/users", icon: Users },
    { name: "Properties", href: "/admin/properties", icon: Building2 },
    { name: "Categories", href: "/admin/categories", icon: FolderTree },
    { name: "Investments", href: "/admin/investments", icon: Wallet },
    { name: "Featured", href: "/admin/featured", icon: Star },
];

export default function AdminSidebar() {
    const pathname = usePathname();

    return (
        <aside className="w-64 shrink-0 hidden lg:block">
            <div className="sticky top-28 space-y-2">
                {/* Admin Badge */}
                <div className="bg-gradient-to-br from-blue-600/10 to-purple-600/10 border border-blue-500/20 rounded-2xl p-4 mb-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-purple-500 flex items-center justify-center">
                            <ShieldCheck className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-white">Admin Panel</p>
                            <p className="text-xs text-white/30">Super Admin</p>
                        </div>
                    </div>
                </div>

                <nav className="space-y-1">
                    {adminLinks.map((link) => {
                        const Icon = link.icon;
                        const isActive = pathname === link.href || (link.href !== "/admin" && pathname.startsWith(link.href));
                        return (
                            <Link key={link.name} href={link.href} className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group ${isActive ? "bg-blue-600/10 text-blue-400 border border-blue-500/20" : "text-white/50 hover:text-white hover:bg-white/5"}`}>
                                <Icon className={`w-4 h-4 ${isActive ? "text-blue-400" : "text-white/30 group-hover:text-white/60"}`} />
                                <span className="flex-1">{link.name}</span>
                                {isActive && <ChevronRight className="w-3 h-3 text-blue-400/50" />}
                            </Link>
                        );
                    })}
                </nav>

                <div className="border-t border-white/5 pt-4 mt-4">
                    <Link href="/dashboard" className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-white/40 hover:text-white hover:bg-white/5 transition-all w-full">
                        <LayoutDashboard className="w-4 h-4" /> Member Dashboard
                    </Link>
                    <button className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-red-400/60 hover:text-red-400 hover:bg-red-500/5 transition-all w-full">
                        <LogOut className="w-4 h-4" /> Sign Out
                    </button>
                </div>
            </div>
        </aside>
    );
}
