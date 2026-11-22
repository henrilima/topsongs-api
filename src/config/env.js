import fs from "node:fs";

// Carrega variáveis do arquivo .env nativamente no Node.js se existir
if (fs.existsSync(".env") && typeof process.loadEnvFile === "function") {
    try {
        process.loadEnvFile();
    } catch {
        // Ignora caso haja erro ao carregar arquivo local
    }
}

export const config = {
    port: Number(process.env.PORT) || 3001,
    nodeEnv: process.env.NODE_ENV || "development",
    isDev: (process.env.NODE_ENV || "development") === "development",
};
