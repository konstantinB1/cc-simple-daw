import { defineConfig } from "vite";

export default defineConfig({
    plugins: [
        {
            name: "wav-file-handler",
            configureServer(server) {
                return () => {
                    server.middlewares.use((req, res, next) => {
                        const isSoundAsset =
                            req.originalUrl?.startsWith("/assets/kits");

                        if (
                            isSoundAsset &&
                            req.headers["content-type"] === "audio/wav"
                        ) {
                            res.writeHead(404, {
                                "Content-Type": "text/plain",
                            });
                            res.end("File not found");
                            return;
                        }

                        return next();
                    });
                };
            },
        },
    ],
    resolve: {
        alias: {
            "@": "/src",
            "@assets": "/public/assets",
            "@components": "/src/components",
            "@lib": "/src/lib",
            "@styles": "/src/styles",
            "@programs": "/src/programs",
        },
    },
});
