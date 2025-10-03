"use client";

import { useSession } from "next-auth/react";
import PlaylistsSection from "@/app/sections/PlaylistsSection";
import ArtistsSection from "@/app/sections/ArtistsSection";
import TopTracksSection from "../sections/TopTracksSection";
import RecentlyPlayedSection from "../sections/RecentlyPlayedSection";
import RecommendationsSection from "../sections/RecommendationsSection";
import WeeklyDiscoveriesSection from "../sections/WeeklyDiscoveriesSection";
import WeeklyReleasesSection from "../sections/WeeklyReleasesSection";

export default function DashboardPage() {
    const { data: session } = useSession();
    const token = session?.accessToken;

    if (!token) {
        return (
            <p className="text-white p-8">
                Você precisa estar logado para acessar o dashboard.
            </p>
        );
    }

    return (
        <div className="text-white p-8">
            <h1 className="text-2xl font-bold mb-4">Bem-vindo ao Beatplay</h1>
            
                <PlaylistsSection />
                <ArtistsSection />
                <TopTracksSection />
                <RecentlyPlayedSection />
                <RecommendationsSection />
                <WeeklyDiscoveriesSection />
                <WeeklyReleasesSection />
        </div>
    );
}