export class ApiError extends Error {
    constructor(statusCode, message) {
        super(message);
        this.statusCode = statusCode;
    }
}

// Wrapper para rotas assíncronas do Express, eliminando try/catch repetitivo
export const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};

// Middleware centralizado de tratamento de erros
export const errorHandler = (err, req, res, next) => {
    const statusCode = err.statusCode || err.response?.status || 500;
    const message = err.message || "Erro interno do servidor.";

    if (process.env.NODE_ENV !== "production") {
        console.error(`[Erro ${statusCode}] ${req.method} ${req.originalUrl}:`, message);
    }

    res.status(statusCode).json({
        error: message,
        ...(process.env.NODE_ENV === "development" && err.stack ? { stack: err.stack } : {}),
    });
};
