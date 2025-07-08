import { defineConfig } from "vitest/config";

export default defineConfig({
    test: {
        globals: true,
        environment: "jsdom",
        setupFiles: "./test/setup.ts",
    },
    resolve: {
        alias: {
            "@": "/src",
            "@assets": "/public/assets",
            "@modules": "/src/modules",
            "@lib": "/src/lib",
            "@gen": "/src/generated",
            "@packages/": "/src/packages",
        },
    },
});
