import app from "./app.js";
import { config } from "./config/env.js";

const server = app.listen(config.port, () => {
    console.log(`
==================================================
 🎵 TopSongs API iniciada com sucesso!
 🌍 Ambiente: ${config.nodeEnv}
 🚪 Porta Local: ${config.port}
 🔗 URL: http://localhost:${config.port}
==================================================
    `);
});

export default server;
