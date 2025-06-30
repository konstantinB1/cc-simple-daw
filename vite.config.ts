import { defineConfig } from "vite";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

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
            name: "json-regenerator",
            configureServer(server) {
                // Watch the script file for changes and regenerate JSON
                server.watcher.add("scripts/tracks-canvas-lookup-gen.ts");

                server.watcher.on("change", async (file) => {
                    if (file.includes("tracks-canvas-lookup-gen.ts")) {
                        console.log("🔄 Regenerating track canvas lookup...");
                        try {
                            await execAsync(
                                "tsx scripts/tracks-canvas-lookup-gen.ts",
                            );
                            console.log("✅ Track canvas lookup regenerated");

                            // Trigger HMR for the generated file
                            const module = server.moduleGraph.getModuleById(
                                "/src/generated/track-canvas-lookup.json",
                            );
                            if (module) {
                                server.reloadModule(module);
                            }
                        } catch (error) {
                            console.error(
                                "❌ Failed to regenerate lookup:",
                                error,
                            );
                        }
                    }
                });

                // Also watch the generated JSON file for external changes
                server.watcher.add("src/generated/track-canvas-lookup.json");
            },
        },
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
        },
    },
});
