import express from "express";
import cors from "cors";
import fs from "node:fs";
import path from "node:path";
import { GlobalFonts } from "@napi-rs/canvas";
import { initFonts, getColoredSVG } from "./utils/assets.js";

import deezerRoutes from "./routes/deezer.routes.js";
import topsongsRoutes from "./routes/topsongs.routes.js";
import { errorHandler } from "./middlewares/error.middleware.js";

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Rota de diagnóstico
app.get("/debug", (req, res) => {
    try {
        const fontInitSuccess = initFonts();
        const testSvg = getColoredSVG("2", "3498db", "25");
        res.json({
            hasMontserrat: GlobalFonts.has("Montserrat"),
            fontInitSuccess,
            hasSvg: Boolean(testSvg && testSvg.svgData),
            globalFonts: GlobalFonts.families || [],
        });
    } catch (e) {
        res.status(500).json({ error: e.message, stack: e.stack });
    }
});

// Rota raiz com documentação e catálogo de endpoints disponíveis
app.get("/", (req, res) => {
    res.json({
        status: "online",
        name: "TopSongs API",
        version: "1.0.0",
        endpoints: {
            deezer: {
                status: "GET /api",
                searchArtists: "GET /api/artists?q={nome}",
                artistInfo: "GET /api/artistinfo?q={id}",
                albums: "GET /api/albums?q={id}",
                tracks: "GET /api/tracks?q={nome}",
                tracklist: "GET /api/tracklist?q={id}",
            },
            topsongs: {
                status: "GET /topsongs",
                generateCanvas: "POST /topsongs/canvas (ou POST /api/canvas)",
            },
        },
    });
});

// Montagem dos módulos de rotas
app.use("/api", deezerRoutes);
app.use("/topsongs", topsongsRoutes);
// Alias conveniente para permitir POST /api/canvas também
app.use("/api", topsongsRoutes);

// Fallback para rotas não encontradas (404)
app.use("*", (req, res) => {
    res.status(404).json({ error: `Rota '${req.originalUrl}' não encontrada.` });
});

// Tratamento centralizado de erros
app.use(errorHandler);

export default app;
