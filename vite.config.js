import fs from "node:fs";
import path from "node:path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
var legacyStaticEntries = [
    "script.js",
    "service-worker.js",
    "style.css",
    "manifest.json",
    "privacy.html",
    "terms.html",
    "icons",
    "image",
    "legacy-app-init.js",
    "legacy-auth-store.js",
    "legacy-auth-view.js",
    "legacy-backup-store.js",
    "legacy-event-modal.js",
    "legacy-event-store.js",
    "legacy-event-view.js",
    "legacy-todo-store.js",
    "legacy-todo-view.js",
    "legacy-type-store.js",
    "legacy-type-view.js",
    "legacy-utils.js"
];
function copyLegacyStaticFiles() {
    return {
        name: "copy-legacy-static-files",
        writeBundle: function () {
            var rootDir = process.cwd();
            var distDir = path.resolve(rootDir, "dist");
            legacyStaticEntries.forEach(function (entry) {
                var sourcePath = path.resolve(rootDir, entry);
                var targetPath = path.resolve(distDir, entry);
                if (!fs.existsSync(sourcePath))
                    return;
                fs.mkdirSync(path.dirname(targetPath), { recursive: true });
                fs.cpSync(sourcePath, targetPath, { recursive: true });
            });
        }
    };
}
export default defineConfig({
    plugins: [react(), copyLegacyStaticFiles()]
});
