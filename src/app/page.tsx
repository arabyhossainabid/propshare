"use client";

import React from "react";
import Hero from "@/components/home/Hero";
import Categories from "@/components/home/Categories";
import FeaturedProperties from "@/components/home/FeaturedProperties";
import CTA from "@/components/home/CTA";

// Mock data based on API descriptions
const featuredProperties = [
    {
        id: "1",
        title: "Luxury Waterfront Apartment",
        location: "Gulshan, Dhaka",
        price: 150000,
        minInvestment: 5000,
        totalShares: 30,
        availableShares: 12,
        upvotes: 42,
        category: "Residential",
        image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?q=80&w=1200&auto=format&fit=crop"
    },
    {
        id: "2",
        title: "Commercial Office Tower",
        location: "Banani, Dhaka",
        price: 500000,
        minInvestment: 10000,
        totalShares: 50,
        availableShares: 5,
        upvotes: 89,
        category: "Commercial",
        image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1200&auto=format&fit=crop"
    },
    {
        id: "3",
        title: "Modern Tech Hub Space",
        location: "Uttara, Dhaka",
        price: 320000,
        minInvestment: 2500,
        totalShares: 128,
        availableShares: 45,
        upvotes: 56,
        category: "Tech Office",
        image: "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1200&auto=format&fit=crop"
    }
];

const categoriesData = [
    { id: "1", name: "Residential", icon: "🏠", count: 12 },
    { id: "2", name: "Commercial", icon: "🏢", count: 8 },
    { id: "3", name: "Industrial", icon: "🏭", count: 5 },
    { id: "4", name: "Retail", icon: "🛒", count: 4 },
    { id: "5", name: "Co-working", icon: "💻", count: 15 },
    { id: "6", name: "Vacation Home", icon: "🏖️", count: 7 }
];

export default function HomePage() {
    return (
        <div className="flex flex-col gap-0 overflow-x-hidden bg-[#0a0f1d]">
            <Hero />
            <Categories categories={categoriesData} />
            <FeaturedProperties properties={featuredProperties} />
            <CTA />
        </div>
    );
}
