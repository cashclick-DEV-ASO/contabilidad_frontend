import express from "express"
import path from "path"
import cookieParser from "cookie-parser"
import "dotenv/config"

const createApp = (dev_mode) => {
    const HOST = process.env.HOST ?? "0.0.0.0"
    const PORT = process.env.PORT ?? 0
    const SRV_URL = `http://${HOST}:${PORT}`
    const app = express()

    app.disable("x-powered-by")

    const dirname = path.resolve()
    const [distPath, loginHtml, indexHtml, listaBlanca] = dev_mode
        ? desarrollo(dirname)
        : produccion(dirname)

    app.use(cookieParser())
    app.use((req, res, next) => {
        res.cookie("api", process.env.API_URL ?? SRV_URL)
        if (dev_mode) res.cookie("dev_mode", dev_mode)

        if (listaBlanca.some((ruta) => req.path.startsWith(ruta))) return next()

        const token = req.cookies.token
        if (!token) return res.redirect("/login")
        next()
    })

    app.use(express.static(distPath))

    app.get("/login", (req, res) => res.sendFile(loginHtml))

    app.all("*", (req, res) => res.sendFile(indexHtml))

    app.listen(PORT, HOST, () =>
        console.log(
            `Servidor frontend en linea en modo ${
                dev_mode ? "desarrollo" : "produccion"
            }: ${SRV_URL}`
        )
    )
}

const produccion = (dirname) => {
    const distPath = path.resolve(dirname, "dist")
    return [
        path.resolve(distPath),
        path.resolve(distPath, "login.html"),
        path.resolve(distPath, "index.html"),
        ["/login", "/assets"],
    ]
}

const desarrollo = (dirname) => {
    return [
        dirname,
        path.resolve(dirname, "login.html"),
        path.resolve(dirname, "index.html"),
        [
            "/login",
            "/components",
            "/controllers",
            "/models",
            "/src",
            "/styles",
            "/views",
            "/lib",
            "/images",
        ],
    ]
}

createApp(process.env.DEV_MODE || false)
// test git
