import { Router } from "express";
import { canvasService } from "../services/canvas.service.js";
import { ApiError, asyncHandler } from "../middlewares/error.middleware.js";

const router = Router();

// Status do módulo TopSongs
router.get("/", (req, res) => {
    res.json({
        message: "Módulo TopSongs online",
        layouts: ["vertical (1080x1920)", "horizontal (1920x1080)", "square (1080x1080)"],
        shapes: ["circle", "rounded", "square", "diamond", "hexagon"],
        patterns: "1 a 12",
    });
});

// Geração de Canvas TopSongs
router.post(
    "/canvas",
    asyncHandler(async (req, res) => {
        const { layout, orientation, artist, songs } = req.body || {};

        if (!artist || !Array.isArray(songs)) {
            throw new ApiError(400, "Formato inválido. 'artist' e 'songs' são obrigatórios.");
        }

        const selectedLayout = layout || orientation || "vertical";

        const buffer = await canvasService.generateTopSongsImage({
            layout: selectedLayout,
            artist,
            songs,
        });

        res.set("Content-Type", "image/png");
        res.send(buffer);
    })
);

export default router;
