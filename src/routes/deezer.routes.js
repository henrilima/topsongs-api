import { Router } from "express";
import { deezerService } from "../services/deezer.service.js";
import { ApiError, asyncHandler } from "../middlewares/error.middleware.js";

const router = Router();

// Status da API Deezer
router.get("/", (req, res) => {
    res.json({ message: "Módulo Deezer online" });
});

// Busca artistas
router.get(
    "/artists",
    asyncHandler(async (req, res) => {
        const { q } = req.query;
        if (!q) {
            throw new ApiError(400, "Você deve fornecer um nome de artista na consulta.");
        }
        const data = await deezerService.searchArtists(q);
        res.json(data);
    })
);

// Informações detalhadas do artista
router.get(
    "/artistinfo",
    asyncHandler(async (req, res) => {
        const { q } = req.query;
        if (!q) {
            throw new ApiError(400, "Você deve fornecer um ID de artista na consulta.");
        }
        const data = await deezerService.getArtist(q);
        res.json(data);
    })
);

// Busca faixas por nome
router.get(
    "/tracks",
    asyncHandler(async (req, res) => {
        const { q } = req.query;
        if (!q) {
            throw new ApiError(400, "Você deve fornecer um nome de faixa na consulta.");
        }
        const data = await deezerService.searchTracks(q);
        res.json(data);
    })
);

// Busca álbuns do artista
router.get(
    "/albums",
    asyncHandler(async (req, res) => {
        const { q } = req.query;
        if (!q) {
            throw new ApiError(400, "Você deve fornecer um ID de artista na consulta.");
        }
        const data = await deezerService.getArtistAlbums(q);
        res.json(data);
    })
);

// Faixas de um álbum
router.get(
    "/tracklist",
    asyncHandler(async (req, res) => {
        const { q } = req.query;
        if (!q) {
            throw new ApiError(400, "Você deve fornecer o ID do álbum na consulta.");
        }
        const data = await deezerService.getAlbumTracks(q);
        res.json(data);
    })
);

export default router;
