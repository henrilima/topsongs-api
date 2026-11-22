import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { GlobalFonts } from "@napi-rs/canvas";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Referências estáticas literais para garantir que o `@vercel/nft` (Node File Trace)
// reconheça e empacote todos os assets estáticos no bundle da Serverless Function da Vercel
const STATIC_ASSET_PATHS = [
    path.join(process.cwd(), "fonts/Montserrat.ttf"),
    path.join(__dirname, "../../fonts/Montserrat.ttf"),
    path.join(process.cwd(), "images/numbers.png"),
    path.join(process.cwd(), "images/tipo.svg"),
    path.join(process.cwd(), "images/tipo_2.svg"),
    path.join(process.cwd(), "images/tipo_3.svg"),
    path.join(process.cwd(), "images/tipo_4.svg"),
    path.join(process.cwd(), "images/tipo_5.svg"),
    path.join(process.cwd(), "images/tipo_6.svg"),
    path.join(process.cwd(), "images/tipo_7.svg"),
    path.join(process.cwd(), "images/tipo_8.svg"),
    path.join(process.cwd(), "images/tipo_9.svg"),
    path.join(process.cwd(), "images/tipo_10.svg"),
    path.join(process.cwd(), "images/tipo_11.svg"),
    path.join(process.cwd(), "images/tipo_12.svg"),
    path.join(__dirname, "../../images/numbers.png"),
    path.join(__dirname, "../../images/tipo.svg"),
];

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
            // Continua testando
        }
    }

    return path.join(process.cwd(), ...segments);
}

// Inicializa a fonte Montserrat de forma resiliente
export function initFonts() {
    try {
        if (GlobalFonts.has("Montserrat")) {
            return true;
        }

        const candidatePaths = [
            path.join(process.cwd(), "fonts/Montserrat.ttf"),
            path.join(process.cwd(), "fonts", "Montserrat.ttf"),
            path.join(__dirname, "../../fonts/Montserrat.ttf"),
            path.join(__dirname, "../fonts/Montserrat.ttf"),
            path.join(__dirname, "fonts/Montserrat.ttf"),
            "/var/task/fonts/Montserrat.ttf",
            "/var/task/topsongs-api/fonts/Montserrat.ttf",
        ];

        for (const fontPath of candidatePaths) {
            try {
                if (fs.existsSync(fontPath)) {
                    const buffer = fs.readFileSync(fontPath);
                    GlobalFonts.register(buffer, "Montserrat");
                    return true;
                }
            } catch {
                // Tenta próximo
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

    const candidatePaths = [
        path.join(process.cwd(), "images", svgFileName),
        path.join(process.cwd(), "images/" + svgFileName),
        path.join(__dirname, "../../images", svgFileName),
        path.join(__dirname, "../../images/" + svgFileName),
        path.join(__dirname, "../images", svgFileName),
        `/var/task/images/${svgFileName}`,
        `/var/task/topsongs-api/images/${svgFileName}`,
        // Fallbacks
        path.join(process.cwd(), "images/tipo.svg"),
        path.join(__dirname, "../../images/tipo.svg"),
        "/var/task/images/tipo.svg",
    ];

    let svg = null;
    for (const p of candidatePaths) {
        try {
            if (fs.existsSync(p)) {
                svg = fs.readFileSync(p, "utf8");
                break;
            }
        } catch {
            // Continua
        }
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
