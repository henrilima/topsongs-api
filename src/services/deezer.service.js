import axios from "axios";

const deezerClient = axios.create({
    baseURL: "https://api.deezer.com",
    timeout: 10000,
    headers: {
        "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
        "Accept": "*/*",
        "Accept-Language": "pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7",
        "Referer": "https://www.deezer.com/",
    },
});

export const deezerService = {
    // Busca artistas por nome
    async searchArtists(artistName) {
        const response = await deezerClient.get(`/search/artist`, {
            params: { q: artistName },
        });
        return response.data;
    },

    // Obtém informações detalhadas de um artista
    async getArtist(artistId) {
        const response = await deezerClient.get(`/artist/${encodeURIComponent(artistId)}`);
        return response.data;
    },

    // Busca faixas por nome
    async searchTracks(trackName) {
        const response = await deezerClient.get(`/search/track`, {
            params: { q: trackName },
        });
        return response.data;
    },

    // Obtém álbuns de um artista combinados com o nome do artista
    async getArtistAlbums(artistId) {
        const [responseAlbums, responseArtist] = await Promise.all([
            deezerClient.get(`/artist/${encodeURIComponent(artistId)}/albums`),
            deezerClient.get(`/artist/${encodeURIComponent(artistId)}`),
        ]);

        const albums = (responseAlbums.data?.data || []).map((album) => ({
            id: album.id,
            title: album.title,
            cover: album.cover_big,
            release_date: album.release_date || album.release_data,
            tracklist: album.tracklist,
        }));

        return {
            artist: {
                id: artistId,
                name: responseArtist.data?.name || "",
            },
            albums,
        };
    },

    // Obtém faixas de um álbum
    async getAlbumTracks(albumId) {
        const response = await deezerClient.get(`/album/${encodeURIComponent(albumId)}/tracks`);

        return (response.data?.data || []).map((song) => ({
            id: song.id,
            title: song.title,
            duration: song.duration,
            track_position: song.track_position,
            explicit_lyrics: song.explicit_lyrics,
            preview: song.preview,
        }));
    },
};
