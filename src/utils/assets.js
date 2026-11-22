import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { GlobalFonts } from "@napi-rs/canvas";
import { MONTSERRAT_BASE64 } from "../assets/font-data.js";
import { SVG_PATTERNS, NUMBERS_BASE64 } from "../assets/svg-patterns.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Retorna o buffer da imagem de números com fallback embutido
export function getNumbersBuffer() {
    try {
        const localPath = path.join(process.cwd(), "images", "numbers.png");
        if (fs.existsSync(localPath)) {
            return fs.readFileSync(localPath);
        }
    } catch {
        // Usa buffer embutido
    }
    return Buffer.from(NUMBERS_BASE64, "base64");
}

// Inicializa a fonte Montserrat de forma 100% à prova de falhas
export function initFonts() {
    try {
        if (GlobalFonts.has("Montserrat")) {
            return true;
        }

        // 1. Tenta carregar do disco local se disponível
        const localPaths = [
            path.join(process.cwd(), "fonts", "Montserrat.ttf"),
            path.join(__dirname, "..", "..", "fonts", "Montserrat.ttf"),
        ];

        for (const fontPath of localPaths) {
            try {
                if (fs.existsSync(fontPath)) {
                    const buf = fs.readFileSync(fontPath);
                    GlobalFonts.register(buf, "Montserrat");
                    return true;
                }
            } catch {
                // Tenta próximo
            }
        }

        // 2. Fallback INFALÍVEL embutido (Base64 compilado no código)
        if (MONTSERRAT_BASE64) {
            const fontBuffer = Buffer.from(MONTSERRAT_BASE64, "base64");
            GlobalFonts.register(fontBuffer, "Montserrat");
            return true;
        }
    } catch (err) {
        console.warn("Aviso ao inicializar fontes:", err.message);
    }
    return false;
}

// Carrega o arquivo SVG correspondente ao padrão (1 a 12) e aplica as cores/opacidade
export function getColoredSVG(svgType = "1", colorHex = "b22222", opacity = "20") {
    const svgFillList = ["3", "4"];
    let typeStr = String(svgType || "1");

    // 1. Tenta ler do disco local
    let svg = null;
    try {
        const svgFileName = `tipo${typeStr === "1" ? "" : `_${typeStr}`}.svg`;
        const localPath = path.join(process.cwd(), "images", svgFileName);
        if (fs.existsSync(localPath)) {
            svg = fs.readFileSync(localPath, "utf8");
        }
    } catch {
        // Fallback para embutido
    }

    // 2. Fallback INFALÍVEL embutido (Strings de SVG compiladas no bundle)
    if (!svg) {
        svg = SVG_PATTERNS[typeStr] || SVG_PATTERNS["1"] || null;
    }

    if (!svg) {
        return null;
    }

    const cleanColor = (colorHex || "b22222").replace("#", "");
    const opacityValue = opacity ? Number(opacity) / 100 : 0.2;
    const hasFill = svgFillList.includes(typeStr);

    // Remove atributos de opacidade pré-existentes para evitar duplicações no XML
    svg = svg.replace(/\s+stroke-opacity="[^"]*"/g, "");
    svg = svg.replace(/\s+fill-opacity="[^"]*"/g, "");

    if (hasFill) {
        svg = svg.replace(/fill="[^"]*"/g, `fill="#${cleanColor}" fill-opacity="${opacityValue}"`);
        svg = svg.replace(/stroke="[^"]*"/g, `stroke="#${cleanColor}" stroke-opacity="${opacityValue}"`);
    } else {
        svg = svg.replace(/stroke="[^"]*"/g, `stroke="#${cleanColor}" stroke-opacity="${opacityValue}"`);
    }

    return {
        svgData: svg,
        isType1: typeStr === "1",
        patternType: typeStr,
    };
}
