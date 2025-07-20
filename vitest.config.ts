import { defineConfig } from "vitest/config";

export default defineConfig({
    root: process.cwd(),
    base: "/",
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
            "@mocks": "/test/mocks",
        },
        extensions: [".ts", ".json"],
    },
});
