import express from "express"
import path from "path"
import "dotenv/config"

const createApp = () => {
    const HOST = process.env.HOST ?? "localhost"
    const PORT = process.env.PORT ?? 0
    const app = express()

    const __dirname = path.resolve()
    const distPath = path.resolve(__dirname, "dist")
    const loginHtml = path.resolve(__dirname, "login.html")
    const indexHtml = path.resolve(distPath, "index.html")

    app.use(express.static(distPath))
    app.use(express.static(loginHtml))
    app.disable("x-powered-by")

    app.get("*", (req, res) => {
        const headers = req.headers

        
    })

    app.listen(PORT, HOST, () => console.log(`Servidor en linea: http://${HOST}:${PORT}`))
}

createApp()