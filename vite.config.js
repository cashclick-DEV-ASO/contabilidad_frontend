import { defineConfig } from "vite"
import path from "path"

const __dirname = path.resolve()

export default defineConfig({
    build: {
        rollupOptions: {
            input: {
                login: path.resolve(__dirname, "login.html"),
                main: path.resolve(__dirname, "index.html"),
            },
        },
    },
})