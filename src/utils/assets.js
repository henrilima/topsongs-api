import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { GlobalFonts } from "@napi-rs/canvas";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Busca caminho de assets de forma compatível com execução Local e Serverless (AWS Lambda / Vercel)
export function getAssetPath(...segments) {
    const candidateBases = [
        process.cwd(),
        path.join(process.cwd(), "topsongs-api"),
        path.resolve(__dirname, "..", ".."),
        path.resolve(__dirname, ".."),
        path.resolve(__dirname),
        "/var/task",
        "/var/task/topsongs-api",
    ];

    for (const base of candidateBases) {
        try {
            const candidate = path.join(base, ...segments);
            if (fs.existsSync(candidate)) {
                return candidate;
            }
        } catch {
            // Continua testando os próximos caminhos candidatos
        }
    }

    // Retorna fallback padrão
    return path.join(process.cwd(), ...segments);
}

// Inicializa a fonte Montserrat de forma resiliente
export function initFonts() {
    try {
        if (GlobalFonts.has("Montserrat")) {
            return true;
        }

        const fontPath = getAssetPath("fonts", "Montserrat.ttf");
        if (fs.existsSync(fontPath)) {
            try {
                GlobalFonts.registerFromPath(fontPath, "Montserrat");
                return true;
            } catch {
                // Tenta fallback com buffer direto caso o path falhe
                const buffer = fs.readFileSync(fontPath);
                GlobalFonts.register(buffer, "Montserrat");
                return true;
            }
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
