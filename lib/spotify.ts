export async function getTopArtists(token: string, limit: number = 10) {
    const res = await fetch(`https://api.spotify.com/v1/me/top/artists?limit=${limit}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    if (!res.ok) throw new Error("Erro ao buscar artistas favoritos");
    return res.json();
}

export async function getUserPlaylists(token: string, limit: number = 10) {
    const res = await fetch(`https://api.spotify.com/v1/me/playlists?limit=${limit}`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error("Erro ao buscar playlists");
    return res.json();
}

export async function getUserTopTracks(token: string, limit: number = 10) {
    const res = await fetch(`https://api.spotify.com/v1/me/top/tracks?limit=${limit}`, {
        headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) {
        throw new Error("Erro ao buscar músicas mais ouvidas");
    }

    return res.json();
}

export async function getRecentlyPlayedTracks(token: string, limit: number = 10) {
    const res = await fetch(
        `https://api.spotify.com/v1/me/player/recently-played?limit=${limit}`,
        {
            headers: { Authorization: `Bearer ${token}` },
        }
    );

    if (!res.ok) {
        throw new Error("Erro ao buscar músicas reproduzidas recentemente");
    }

    return res.json();
}

export async function getUserTopArtists(token: string, limit: number = 5) {
    const res = await fetch(`https://api.spotify.com/v1/me/top/artists?limit=${limit}`, {
        headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) throw new Error("Erro ao buscar top artistas do usuário");
    

    return res.json();
}

export async function getRecommendationsFromTopArtists(token: string, artistSeeds: string[] = [], limit: number = 20) {
    const seeds = artistSeeds.slice(0, 5).join(",");

    const url = seeds 
    ? `https://api.spotify.com/v1/recommendations?limit=${limit}&seed_artists=${seeds}`
    : `https://api.spotify.com/v1/recommendations?limit=${limit}&seed_genres=trance`;
    
    const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}`},
    });

    if (!res.ok) throw new Error(`Erro ao buscar recomendações personalizadas: ${res.status}`);
    
    return res.json();
}