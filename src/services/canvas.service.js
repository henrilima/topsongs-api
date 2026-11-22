import fs from "node:fs";
import { createCanvas, loadImage } from "@napi-rs/canvas";
import { initFonts, getAssetPath, getColoredSVG } from "../utils/assets.js";
import {
    drawTextWithEllipsis,
    drawAvatarShape,
    drawRoundedImage,
    fetchImageBuffer,
    drawSVG,
} from "../utils/canvas-helpers.js";

// Inicializa a fonte Montserrat
initFonts();

export const canvasService = {
    async generateTopSongsImage({ layout = "vertical", artist = {}, songs = [] }) {
        const normalizedLayout = String(layout || "vertical").toLowerCase();

        // 1. Download paralelo dos assets remotos (ícone do artista e capas das músicas)
        const songsList = (songs || []).slice(0, 5);

        const [artistBuffer, ...songBuffers] = await Promise.all([
            fetchImageBuffer(artist.icon),
            ...songsList.map((song) => fetchImageBuffer(song?.coverAlbum)),
        ]);

        const [artistImage, songImages] = await Promise.all([
            artistBuffer ? loadImage(artistBuffer).catch(() => null) : null,
            Promise.all(
                songBuffers.map((buf) => (buf ? loadImage(buf).catch(() => null) : null))
            ),
        ]);

        // 2. Processa o SVG de fundo selecionado (padrões 1 a 12)
        const svgInfo = getColoredSVG(artist.pattern, artist.color, artist.opacity);

        // 3. Renderiza no layout escolhido
        if (normalizedLayout === "horizontal" || normalizedLayout === "landscape") {
            return await renderHorizontalLayout(artist, songsList, artistImage, songImages, svgInfo);
        } else if (normalizedLayout === "square" || normalizedLayout === "feed") {
            return await renderSquareLayout(artist, songsList, artistImage, songImages, svgInfo);
        } else {
            // Padrão: Vertical (Story 9:16 - 1080x1920)
            return await renderVerticalLayout(artist, songsList, artistImage, songImages, svgInfo);
        }
    },
};

// =========================================================================
// LAYOUT 1: VERTICAL (STORY / 9:16 - 1080 x 1920)
// =========================================================================
async function renderVerticalLayout(artist, songsList, artistImage, songImages, svgInfo) {
    const canvas = createCanvas(1080, 1920);
    const ctx = canvas.getContext("2d");

    // Cor de fundo
    ctx.fillStyle = artist.bodyColor || "#0E131F";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Padrão SVG
    if (svgInfo) {
        if (svgInfo.isType1) {
            await drawSVG(ctx, svgInfo.svgData, 0, 433, 1080, 1700);
        } else {
            await drawSVG(ctx, svgInfo.svgData, 0, 0, 1080, 1920);
        }
    }

    // Numeração original da esquerda se o padrão for tipo 1 ou legado
    const numbersPath = getAssetPath("images", "numbers.png");
    if (fs.existsSync(numbersPath)) {
        try {
            const numbersBuffer = fs.readFileSync(numbersPath);
            const numbersImage = await loadImage(numbersBuffer);
            ctx.drawImage(numbersImage, 85, 1025, 80, 700);
        } catch {
            // Silencioso se numbers.png não puder ser lido
        }
    }

    // Watermark
    ctx.font = "48px Montserrat";
    ctx.fillStyle = "#FFFFFF33";
    ctx.textAlign = "start";
    ctx.fillText("topSongs", 820, 1890);

    // Avatar do artista com shape selecionado
    if (artistImage) {
        drawAvatarShape(ctx, artistImage, 235, 120, 610, {
            shape: artist.shape || "square",
            borderWidth: Number(artist.borderWidth) || 0,
            borderColor: artist.borderColor || "#FFFFFF",
            borderRadius: 48,
        });
    }

    // Nome do Artista: NEGRITO e MAIOR, com suporte a artist.nameColor
    const artistNameColor = artist.nameColor
        ? (artist.nameColor.startsWith("#") ? artist.nameColor : `#${artist.nameColor}`)
        : "#FFFFFF";

    drawTextWithEllipsis(ctx, artist.name || "", canvas.width / 2, 840, 960, {
        font: "bold 76px Montserrat",
        color: artistNameColor,
        align: "center",
    });

    // Lista de músicas
    const Y_POSITIONS = [980, 1146, 1314, 1478, 1644];

    for (let i = 0; i < songsList.length; i++) {
        const y = Y_POSITIONS[i];
        const song = songsList[i];
        const songImg = songImages[i];

        if (songImg) {
            drawRoundedImage(ctx, songImg, 205, y, 126, 126, 16);
        }

        drawTextWithEllipsis(ctx, song?.title || "", 372, y + 50, 590, {
            font: "bold 40px Montserrat",
            color: "white",
        });

        drawTextWithEllipsis(ctx, song?.albumTitle || "", 372, y + 100, 590, {
            font: "32px Montserrat",
            color: "#A0A0A0",
        });
    }

    return canvas.toBuffer("image/png");
}

// =========================================================================
// LAYOUT 2: HORIZONTAL (WIDESCREEN / 16:9 - 1920 x 1080)
// =========================================================================
async function renderHorizontalLayout(artist, songsList, artistImage, songImages, svgInfo) {
    const canvas = createCanvas(1920, 1080);
    const ctx = canvas.getContext("2d");

    // Cor de fundo
    ctx.fillStyle = artist.bodyColor || "#0E131F";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // SVG esticado para o canvas horizontal
    if (svgInfo) {
        await drawSVG(ctx, svgInfo.svgData, 0, 0, 1920, 1080);
    }

    // ---------------------------------------------------------------------
    // COLUNA DA ESQUERDA (ARTISTA: x = 0 a 760)
    // ---------------------------------------------------------------------
    const leftCenterX = 380;

    // Avatar do Artista
    if (artistImage) {
        drawAvatarShape(ctx, artistImage, 150, 130, 460, {
            shape: artist.shape || "rounded",
            borderWidth: Number(artist.borderWidth) || 0,
            borderColor: artist.borderColor || "#FFFFFF",
            borderRadius: 40,
        });
    }

    // Nome do Artista
    const artistNameColor = artist.nameColor
        ? (artist.nameColor.startsWith("#") ? artist.nameColor : `#${artist.nameColor}`)
        : "#FFFFFF";

    drawTextWithEllipsis(ctx, artist.name || "", leftCenterX, 680, 680, {
        font: "bold 64px Montserrat",
        color: artistNameColor,
        align: "center",
    });

    // Tag / Selo decorativo
    const tagColor = artist.color
        ? (artist.color.startsWith("#") ? artist.color : `#${artist.color}`)
        : "#FEB029";

    drawTextWithEllipsis(ctx, "TOP 5 SELECTIONS", leftCenterX, 740, 400, {
        font: "24px Montserrat",
        color: tagColor,
        align: "center",
    });

    // Watermark
    ctx.font = "38px Montserrat";
    ctx.fillStyle = "#FFFFFF33";
    ctx.textAlign = "center";
    ctx.fillText("topSongs", leftCenterX, 980);

    // Divisor sutil
    ctx.strokeStyle = "rgba(255, 255, 255, 0.1)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(760, 90);
    ctx.lineTo(760, 990);
    ctx.stroke();

    // ---------------------------------------------------------------------
    // COLUNA DA DIREITA (5 MÚSICAS: x = 790 a 1880)
    // ---------------------------------------------------------------------
    const Y_POSITIONS = [110, 280, 450, 620, 790];

    for (let i = 0; i < songsList.length; i++) {
        const y = Y_POSITIONS[i];
        const song = songsList[i];
        const songImg = songImages[i];

        // Número da faixa
        ctx.font = "bold 44px Montserrat";
        ctx.fillStyle = "#FFFFFF44";
        ctx.textAlign = "center";
        ctx.fillText(String(i + 1), 820, y + 70);

        // Capa do álbum
        if (songImg) {
            drawRoundedImage(ctx, songImg, 870, y, 110, 110, 14);
        }

        // Título e Álbum
        drawTextWithEllipsis(ctx, song?.title || "", 1010, y + 48, 860, {
            font: "bold 38px Montserrat",
            color: "white",
        });

        drawTextWithEllipsis(ctx, song?.albumTitle || "", 1010, y + 92, 860, {
            font: "30px Montserrat",
            color: "#A0A0A0",
        });
    }

    return canvas.toBuffer("image/png");
}

// =========================================================================
// LAYOUT 3: QUADRADO (FEED / 1:1 - 1080 x 1080)
// =========================================================================
async function renderSquareLayout(artist, songsList, artistImage, songImages, svgInfo) {
    const canvas = createCanvas(1080, 1080);
    const ctx = canvas.getContext("2d");

    // Cor de fundo
    ctx.fillStyle = artist.bodyColor || "#0E131F";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Padrão SVG
    if (svgInfo) {
        await drawSVG(ctx, svgInfo.svgData, 0, 0, 1080, 1080);
    }

    // ---------------------------------------------------------------------
    // CABEÇALHO DO FEED (x = 70 a 1010, y = 60 a 270)
    // ---------------------------------------------------------------------
    if (artistImage) {
        drawAvatarShape(ctx, artistImage, 70, 60, 190, {
            shape: artist.shape || "circle",
            borderWidth: Number(artist.borderWidth) || 0,
            borderColor: artist.borderColor || "#FFFFFF",
            borderRadius: 36,
        });
    }

    const tagColor = artist.color
        ? (artist.color.startsWith("#") ? artist.color : `#${artist.color}`)
        : "#FEB029";

    // Tag
    drawTextWithEllipsis(ctx, "TOP 5 ARTIST TRACKS", 290, 105, 500, {
        font: "20px Montserrat",
        color: tagColor,
    });

    // Nome do Artista em destaque
    const artistNameColor = artist.nameColor
        ? (artist.nameColor.startsWith("#") ? artist.nameColor : `#${artist.nameColor}`)
        : "#FFFFFF";

    drawTextWithEllipsis(ctx, artist.name || "", 290, 165, 720, {
        font: "bold 58px Montserrat",
        color: artistNameColor,
    });

    // Subtítulo
    drawTextWithEllipsis(ctx, "As faixas mais tocadas", 290, 215, 600, {
        font: "24px Montserrat",
        color: "rgba(255, 255, 255, 0.6)",
    });

    // Linha divisória
    ctx.strokeStyle = "rgba(255, 255, 255, 0.12)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(70, 285);
    ctx.lineTo(1010, 285);
    ctx.stroke();

    // ---------------------------------------------------------------------
    // LISTA DAS 5 MÚSICAS
    // ---------------------------------------------------------------------
    const Y_POSITIONS = [320, 460, 600, 740, 880];

    for (let i = 0; i < songsList.length; i++) {
        const y = Y_POSITIONS[i];
        const song = songsList[i];
        const songImg = songImages[i];

        // Número da posição
        ctx.font = "bold 34px Montserrat";
        ctx.fillStyle = "#FFFFFF44";
        ctx.textAlign = "center";
        ctx.fillText(String(i + 1), 100, y + 54);

        // Capa
        if (songImg) {
            drawRoundedImage(ctx, songImg, 140, y, 86, 86, 12);
        }

        // Título e Álbum
        drawTextWithEllipsis(ctx, song?.title || "", 250, y + 36, 750, {
            font: "bold 32px Montserrat",
            color: "white",
        });

        drawTextWithEllipsis(ctx, song?.albumTitle || "", 250, y + 74, 750, {
            font: "26px Montserrat",
            color: "#A0A0A0",
        });
    }

    // Watermark
    ctx.font = "28px Montserrat";
    ctx.fillStyle = "#FFFFFF33";
    ctx.textAlign = "end";
    ctx.fillText("topSongs", 1010, 1045);

    return canvas.toBuffer("image/png");
}
