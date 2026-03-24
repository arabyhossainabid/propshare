"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import PropertyCard from "@/components/PropertyCard";

interface Property {
    id: string;
    title: string;
    location: string;
    price: number;
    minInvestment: number;
    totalShares: number;
    availableShares: number;
    upvotes: number;
    category: string;
    image: string;
}

interface FeaturedPropertiesProps {
    properties: Property[];
}

export default function FeaturedProperties({ properties }: FeaturedPropertiesProps) {
    return (
        <section className="py-20 bg-[#0a0f1d] relative overflow-hidden text-white">
            <div className="absolute top-1/2 left-0 w-[1000px] h-[1000px] bg-blue-600/5 rounded-full blur-[200px] -translate-y-1/2 -translate-x-1/2 pointer-events-none" />

            <div className="max-w-7xl mx-auto px-8 md:px-12 relative z-10">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-10 mb-16 border-b border-white/5 pb-8">
                    <div className="">
                        <h2 className="text-2xl md:text-4xl font-bold font-heading text-white tracking-tighter">Top Institutional Picks</h2>
                    </div>
                    <Link href="/ideas" className="group flex items-center gap-4 font-bold text-blue-500 text-[10px] uppercase tracking-[0.3em] hover:text-white transition-all bg-[#151c2e] px-10 py-5 rounded-xl border border-white/5 shadow-2xl active:scale-95">
                        Access Terminal
                        <ArrowRight size={20} className="group-hover:translate-x-3 transition-transform" />
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 md:gap-16">
                    {properties.map((prop) => (
                        <PropertyCard key={prop.id} property={prop} />
                    ))}
                </div>
            </div>
        </section>
    );
}
