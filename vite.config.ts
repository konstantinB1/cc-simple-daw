import { defineConfig } from "vite";
import { exec } from "child_process";
import { promisify } from "util";
import path from "path";

const execAsync = promisify(exec);

export default defineConfig({
    base: "/cc-simple-daw/",
    build: {
        minify: false,
        assetsDir: "assets",
        outDir: "docs",
        emptyOutDir: true,
    },
    esbuild: {
        jsx: "automatic",
        jsxImportSource: "../packages/lit-jsx/src",
        jsxFactory: "createElement",
        jsxDev: false,
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
            "@gen": "/src/generated",
            "@packages/": "/src/packages",
            "@jsx/runtime": path.resolve(process.cwd(), "packages/lit-jsx"),
            "@mocks/": path.resolve(process.cwd(), "test/mocks"),
        },
    },
});
