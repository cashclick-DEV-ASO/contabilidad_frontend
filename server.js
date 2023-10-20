import express from "express"
import path from "path"
import cors from "cors"
import "dotenv/config"

const createApp = () => {
    const HOST = process.env.HOST ?? "localhost"
    const PORT = process.env.PORT ?? 0
    const app = express()

    const __dirname = path.resolve()
    const distPath = path.resolve(__dirname, "dist")
    const indexHtml = path.resolve(distPath, "index.html")

    app.use(express.static(distPath))
    app.use(configuracionCORS())
    app.disable("x-powered-by")

    app.get("/", (req, res) => res.sendFile(indexHtml))

    app.listen(PORT, HOST, () => console.log(`Servidor en linea: http://${HOST}:${PORT}`))
}

export const configuracionCORS = (aceptados = process.env.ORIGINS || "*") => cors({
	origin: (origin, callback) => {
		if (aceptados.split(",").includes(origin))
			return callback(null, true)

		if (!origin)
			return callback(null, true)

		return callback("Not allowed by CORS")
	}
})

createApp()