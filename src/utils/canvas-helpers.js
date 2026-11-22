import axios from "axios";
import { loadImage } from "@napi-rs/canvas";

// Desenha texto com limite de largura, alinhamento e reticências automáticas
export function drawTextWithEllipsis(
    ctx,
    text,
    x,
    y,
    maxWidth,
    { font = "32px Montserrat", color = "white", align = "start" } = {}
) {
    if (!text && text !== 0) return;

    ctx.save();
    ctx.font = font;
    ctx.fillStyle = color;
    ctx.textAlign = align;

    const ellipsis = "...";
    const ellipsisWidth = ctx.measureText(ellipsis).width;
    let textWidth = ctx.measureText(String(text)).width;

    let outputText = String(text);
    if (textWidth > maxWidth) {
        while (
            outputText.length > 0 &&
            ctx.measureText(outputText).width + ellipsisWidth > maxWidth
        ) {
            outputText = outputText.slice(0, -1);
        }
        outputText = outputText + ellipsis;
    }

    ctx.fillText(outputText, x, y);
    ctx.restore();
}

// Desenha a imagem do avatar com diferentes formas geométricas e bordas
export function drawAvatarShape(
    ctx,
    img,
    x,
    y,
    size,
    {
        shape = "square",
        borderWidth = 0,
        borderColor = "#FFFFFF",
        borderRadius = 40,
        shadow = true,
    } = {}
) {
    if (!img) return;

    const normalizedShape = String(shape || "square").toLowerCase();
    const half = size / 2;
    const cx = x + half;
    const cy = y + half;

    ctx.save();

    // Sombra suave destacando o avatar do fundo
    if (shadow) {
        ctx.shadowColor = "rgba(0, 0, 0, 0.45)";
        ctx.shadowBlur = 32;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 16;
    }

    // Cria o path do formato geométrico
    ctx.beginPath();
    if (normalizedShape === "circle" || normalizedShape === "round") {
        ctx.arc(cx, cy, half, 0, Math.PI * 2);
    } else if (normalizedShape === "rounded" || normalizedShape === "squircle") {
        if (typeof ctx.roundRect === "function") {
            ctx.roundRect(x, y, size, size, borderRadius);
        } else {
            ctx.rect(x, y, size, size);
        }
    } else if (normalizedShape === "diamond" || normalizedShape === "rhombus") {
        ctx.moveTo(cx, y);
        ctx.lineTo(x + size, cy);
        ctx.lineTo(cx, y + size);
        ctx.lineTo(x, cy);
        ctx.closePath();
    } else if (normalizedShape === "hexagon") {
        for (let i = 0; i < 6; i++) {
            const angle = (Math.PI / 3) * i - Math.PI / 6;
            const px = cx + half * Math.cos(angle);
            const py = cy + half * Math.sin(angle);
            if (i === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
        }
        ctx.closePath();
    } else {
        // square padrão
        ctx.rect(x, y, size, size);
    }

    // Salva antes de aplicar o clip para desenhar borda depois
    ctx.save();
    ctx.clip();
    ctx.shadowColor = "transparent"; // remove sombra do interior da imagem
    ctx.drawImage(img, x, y, size, size);
    ctx.restore();

    // Aplica a borda decorativa
    if (borderWidth > 0 && borderColor) {
        ctx.lineWidth = borderWidth;
        ctx.strokeStyle = borderColor.startsWith("#") ? borderColor : `#${borderColor}`;
        ctx.stroke();
    }

    ctx.restore();
}

// Desenha uma imagem com cantos arredondados (ex: capas de música)
export function drawRoundedImage(ctx, img, x, y, width, height, radius = 12) {
    if (!img) return;

    ctx.save();
    ctx.beginPath();
    if (typeof ctx.roundRect === "function") {
        ctx.roundRect(x, y, width, height, radius);
    } else {
        ctx.rect(x, y, width, height);
    }
    ctx.clip();
    ctx.drawImage(img, x, y, width, height);
    ctx.restore();
}

// Faz o download assíncrono de imagem externa com timeout e tratamento de falhas
export async function fetchImageBuffer(url) {
    if (!url) return null;
    try {
        const response = await axios.get(url, {
            responseType: "arraybuffer",
            timeout: 8000,
        });
        return Buffer.from(response.data);
    } catch {
        return null;
    }
}

// Renderiza um SVG diretamente no canvas com escala customizada
export async function drawSVG(ctx, svgString, x, y, width, height) {
    if (!svgString) return;
    try {
        const img = await loadImage(Buffer.from(svgString));
        ctx.drawImage(img, x, y, width, height);
    } catch (e) {
        console.warn("Aviso ao carregar SVG no canvas:", e.message);
    }
}
