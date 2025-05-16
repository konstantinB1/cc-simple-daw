import { defineConfig } from "vite";

export default defineConfig({
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
