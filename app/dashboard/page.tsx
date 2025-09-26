"use client";

import { useSession } from "next-auth/react";
import PlaylistsSection from "@/components/PlaylistsSection";
import ArtistsSection from "@/components/ArtistsSection";
import { useUserPlaylists } from "@/hooks/useUserPlaylists";
import { useTopArtists } from "@/hooks/useTopArtists";

export default function DashboardPage() {
    const { data: session } = useSession();
    const token = session?.accessToken;

    const {
        playlists,
        loading: playlistsLoading,
        error: playlistsError
    } = useUserPlaylists(token ?? "");

    const {
        artists,
        loading: artistsLoading,
        error: artistsError
    } = useTopArtists(token ?? "");

    if(!token) {
        return <p className="text-white p-8">Você precisa estar logado para acessar o dashboard.</p>
    }

    return (
        <div className="text-white p-8">
            <h1 className="text-2xl font-bold mb-4">Bem-vindo ao Beatplay</h1>
            
            {playlistsError ? (
                <p className="text-red-500 mb-4">Erro ao carregar playlists.</p>
            ) : (
                <PlaylistsSection token={token} />
            )}

            {artistsError ? (
                <p className="text-red-500 mt-4">Erro ao carregar artistas favoritos.</p>
            ) : (
                <ArtistsSection token={token} />
            )}
        </div>
    );
}