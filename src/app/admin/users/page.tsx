"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Users, Shield, ShieldOff, Trash2, MoreVertical, Mail, Calendar } from "lucide-react";

const allUsers = [
    { id: 1, name: "Rahim Khan", email: "rahim@email.com", role: "member", status: "active", joined: "Jan 15, 2025", investments: 3, avatar: "RK" },
    { id: 2, name: "Fatima Akter", email: "fatima@email.com", role: "member", status: "active", joined: "Feb 20, 2025", investments: 7, avatar: "FA" },
    { id: 3, name: "Karim Uddin", email: "karim@email.com", role: "admin", status: "active", joined: "Dec 1, 2024", investments: 12, avatar: "KU" },
    { id: 4, name: "Nadia Islam", email: "nadia@email.com", role: "member", status: "suspended", joined: "Mar 5, 2025", investments: 0, avatar: "NI" },
    { id: 5, name: "Sakib Ahmed", email: "sakib@email.com", role: "member", status: "active", joined: "Mar 18, 2026", investments: 1, avatar: "SA" },
    { id: 6, name: "Tasnim Rahman", email: "tasnim@email.com", role: "member", status: "active", joined: "Feb 10, 2026", investments: 5, avatar: "TR" },
];

export default function AdminUsersPage() {
    const [search, setSearch] = useState("");
    const [roleFilter, setRoleFilter] = useState("all");
    const filtered = allUsers.filter((u) => {
        const matchSearch = u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase());
        const matchRole = roleFilter === "all" || u.role === roleFilter;
        return matchSearch && matchRole;
    });

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold font-heading">User Management</h1>
                <p className="text-sm text-white/40 mt-1">Manage platform users, roles, and access control.</p>
            </div>

            {/* Search + Filter */}
            <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                    <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search users..." className="bg-white/5 border-white/10 rounded-xl pl-10 py-5 text-white placeholder:text-white/20 focus-visible:ring-blue-500/30" />
                </div>
                <div className="flex gap-2">
                    {["all", "member", "admin"].map((r) => (
                        <button key={r} onClick={() => setRoleFilter(r)} className={`px-4 py-2 rounded-xl text-xs font-medium transition-all ${roleFilter === r ? "bg-blue-600 text-white" : "bg-white/5 text-white/40 hover:bg-white/10"}`}>
                            {r.charAt(0).toUpperCase() + r.slice(1)}
                        </button>
                    ))}
                </div>
            </div>

            {/* Users Table */}
            <div className="bg-white/[0.02] border border-white/5 rounded-2xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-white/5">
                                <th className="text-left text-xs text-white/30 uppercase tracking-wider font-medium px-6 py-4">User</th>
                                <th className="text-left text-xs text-white/30 uppercase tracking-wider font-medium px-6 py-4">Role</th>
                                <th className="text-left text-xs text-white/30 uppercase tracking-wider font-medium px-6 py-4">Status</th>
                                <th className="text-left text-xs text-white/30 uppercase tracking-wider font-medium px-6 py-4">Joined</th>
                                <th className="text-left text-xs text-white/30 uppercase tracking-wider font-medium px-6 py-4">Investments</th>
                                <th className="text-right text-xs text-white/30 uppercase tracking-wider font-medium px-6 py-4">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map((u) => (
                                <tr key={u.id} className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-all">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-9 h-9 rounded-lg bg-blue-500/10 flex items-center justify-center text-xs font-bold text-blue-400">{u.avatar}</div>
                                            <div><p className="text-sm font-medium text-white">{u.name}</p><p className="text-xs text-white/30">{u.email}</p></div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4"><Badge className={`text-[10px] ${u.role === "admin" ? "bg-purple-500/10 text-purple-400 border-purple-500/20" : "bg-white/5 text-white/40 border-white/10"}`}>{u.role}</Badge></td>
                                    <td className="px-6 py-4"><Badge className={`text-[10px] ${u.status === "active" ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : "bg-red-500/10 text-red-400 border-red-500/20"}`}>{u.status}</Badge></td>
                                    <td className="px-6 py-4 text-xs text-white/40">{u.joined}</td>
                                    <td className="px-6 py-4 text-sm text-white font-medium">{u.investments}</td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-1 justify-end">
                                            <Button variant="ghost" className="h-8 w-8 p-0 text-white/30 hover:text-blue-400 rounded-lg">{u.role === "admin" ? <ShieldOff className="w-3.5 h-3.5" /> : <Shield className="w-3.5 h-3.5" />}</Button>
                                            <Button variant="ghost" className="h-8 w-8 p-0 text-white/30 hover:text-red-400 rounded-lg"><Trash2 className="w-3.5 h-3.5" /></Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
