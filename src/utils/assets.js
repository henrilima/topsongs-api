import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { GlobalFonts } from "@napi-rs/canvas";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Busca caminho de assets de forma compatível com execução Local e Serverless
export function getAssetPath(...segments) {
    const cwdPath = path.join(process.cwd(), ...segments);
    if (fs.existsSync(cwdPath)) return cwdPath;

    const relPath = path.join(__dirname, "..", "..", ...segments);
    if (fs.existsSync(relPath)) return relPath;

    return cwdPath;
}

// Inicializa a fonte Montserrat
export function initFonts() {
    const fontPath = getAssetPath("fonts", "Montserrat.ttf");
    if (fs.existsSync(fontPath) && !GlobalFonts.has("Montserrat")) {
        GlobalFonts.registerFromPath(fontPath, "Montserrat");
    }
}

// Carrega o arquivo SVG correspondente ao padrão (1 a 12) e aplica as cores/opacidade
export function getColoredSVG(svgType = "1", colorHex = "b22222", opacity = "20") {
    const svgFillList = ["3", "4"];
    let typeStr = String(svgType || "1");
    let svgFileName = `tipo${typeStr === "1" ? "" : `_${typeStr}`}.svg`;
    let svgPath = getAssetPath("images", svgFileName);

    // Fallback para tipo.svg se o padrão solicitado não existir
    if (!fs.existsSync(svgPath)) {
        typeStr = "1";
        svgPath = getAssetPath("images", "tipo.svg");
        if (!fs.existsSync(svgPath)) return null;
    }

    let svg = fs.readFileSync(svgPath, "utf8");
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
