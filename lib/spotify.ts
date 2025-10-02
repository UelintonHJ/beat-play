export async function getTopArtists(token: string, limit: number = 10) {
    const res  = await fetch(`https://api.spotify.com/v1/me/top/artists?limit=${limit}`, {
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
        headers: { Authorization: `Bearer ${token}`},
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

export async function getRecommendations(token: string, limit: number = 20) {
    const res = await fetch(`https://api.spotify.com/v1/recommendations?limit=${limit}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    if (!res.ok) throw new Error("Erro ao buscar recomendações personalizadas.");
    return res.json();
}