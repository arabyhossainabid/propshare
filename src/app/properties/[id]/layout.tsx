import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Property Details",
    description: "View detailed information about this investment property on PropShare.",
};

export default function PropertyDetailLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
