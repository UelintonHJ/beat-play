"use client";

import { useSession } from "next-auth/react";
import PlaylistsSection from "@/components/PlaylistsSection";
import ArtistsSection from "@/components/ArtistsSection";

export default function DashboardPage() {
    const { data: session } = useSession();
    const token = session?.accessToken;

    if(!token) {
        return <p className="text-white p-8">Você precisa estar logado para acessar o dashboard.</p>
    }

    return (
        <div className="text-white p-8">
            <h1 className="text-2xl font-bold mb-4">Bem-vindo ao Beatplay</h1>
            
                <PlaylistsSection token={token} />
           
                <ArtistsSection token={token} />
            
        </div>
    );
}