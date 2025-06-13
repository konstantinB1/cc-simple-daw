import { defineConfig } from "vite";


export default defineConfig({
    base: "/cc-simple-daw/",
    build: {
        minify: false,
        assetsDir: "assets",
        outDir: "docs",
        emptyOutDir: true,
    },
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
            "@modules": "/src/modules",
            "@lib": "/src/lib",
        },
    },
});
