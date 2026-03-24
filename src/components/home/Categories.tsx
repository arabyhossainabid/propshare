"use client";

import React from "react";
import Link from "next/link";

interface Category {
    id: string;
    name: string;
    icon: string;
    count: number;
}

interface CategoriesProps {
    categories: Category[];
}

export default function Categories({ categories }: CategoriesProps) {
    return (
        <section className="py-20 bg-[#0a0f1d] relative overflow-hidden">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-linear-to-r from-transparent via-white/5 to-transparent" />
            <div className="max-w-7xl mx-auto px-8 md:px-12">
                <div className="text-center mb-16 space-y-4">
                    <h2 className="text-2xl md:text-3xl font-bold font-heading text-white tracking-tighter">Invest in Your Verticals</h2>
                    <p className="text-slate-500 max-w-xl mx-auto text-sm font-medium leading-relaxed">
                        Systematic institutional exposure across diverse high-precision property sectors mapping global wealth flows.
                    </p>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-6 gap-6 md:gap-8">
                    {categories.map((cat) => (
                        <Link
                            key={cat.id}
                            href={`/ideas?category=${cat.id}`}
                            className="group flex flex-col items-center p-5 rounded-2xl bg-white/2 border border-white/5 hover:bg-[#151c2e] hover:border-blue-500/30 hover:shadow-3xl transition-all duration-500 hover:-translate-y-2"
                        >
                            <div className="w-14 h-14 rounded-2xl bg-[#0a0f1d] flex items-center justify-center mb-4 group-hover:scale-110 transition-all duration-500 shadow-inner border border-white/5 group-hover:bg-blue-600 group-hover:text-white">
                                <span className="text-2xl group-hover:rotate-12 transition-transform duration-300">{cat.icon}</span>
                            </div>
                            <h3 className="font-bold text-white text-center text-sm mb-2 tracking-tight group-hover:text-blue-400 transition-colors uppercase">{cat.name}</h3>
                            <p className="text-[9px] text-slate-600 font-bold uppercase tracking-[0.2em]">{cat.count} Units</p>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
