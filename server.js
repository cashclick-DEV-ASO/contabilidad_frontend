import { resolve } from "path"
import { log, error as cError } from "console"
import { existsSync } from "node:fs"
import express from "express"
import cookieParser from "cookie-parser"
import "dotenv/config"

const LOGIN = "login.html"
const INDEX = "index.html"

/**
 * Crea una instancia de la aplicación Express para el servidor frontend.
 * @param {boolean} devMode - Indica si se está ejecutando en modo de desarrollo.
 * @returns {void}
 */
const createApp = devMode => {
	if (!process.env.API_URL)
		return console.error("No se ha definido la URL para la API")

	const HOST = process.env.HOST ?? "127.0.0.1"
	const PORT = process.env.PORT ?? null
	const SRV_URL = `${HOST}${PORT ? `:${PORT}` : ""}`
	const app = express()

	app.disable("x-powered-by")

	const [directorio, loginHtml, indexHtml] = archivosHTML(devMode)

	app.use(cookieParser())

	app.use((req, res, next) => {
		res.cookie("API_URL", process.env.API_URL, { secure: true })
		if (devMode) res.cookie("DEV_MODE", devMode, { secure: true })

		next()
	})

	app.get("/login", (req, res) => {
		if (validaToken(req.cookies.TOKEN)) return res.redirect("/")
		res.cookie("ORIGEN", "login", { secure: true })
		res.sendFile(loginHtml)
	})

	app.get("/", (req, res) => {
		if (!validaToken(req.cookies.TOKEN)) return res.redirect("/login")
		res.sendFile(indexHtml)
	})

	app.all("*", (req, res) => {
		if (
			req.path &&
			(validaToken(req.cookies.TOKEN) || req.cookies.ORIGEN === "login")
		) {
			const archivo = ubicaArchivo(directorio, req.path)

			if (archivo) return res.sendFile(archivo)
		}
		res.redirect("/login")
	})

	app.listen(PORT, HOST.replace("http://", "").replace("https://", ""), () =>
		log(`Servidor frontend en linea en: ${SRV_URL}`)
	)
}

const generarInsert = (rutas, padre = null) => {
	let insert = !padre
		? "INSERT INTO mapa_navegacion_frontend (grupo, titulo, vista, padre, orden) VALUES "
		: ""

	Object.keys(rutas).forEach((ruta, index) => {
		if (typeof rutas[ruta].vista === "string") {
			insert += `('${ruta}', '${rutas[ruta].titulo}', '${
				rutas[ruta].vista
			}', ${!padre ? "NULL" : `'${padre}'`}, ${index}), `
		} else {
			insert += `('${ruta}', '${rutas[ruta].titulo}', NULL, ${
				!padre ? "NULL" : `'${padre}'`
			}, ${index}), `
			insert += generarInsert(rutas[ruta].vista, rutas[ruta].titulo)
		}
	})

	return !padre ? `${insert.slice(0, -2)};` : insert
}

const validaToken = token => {
	if (!token) return false
	return true
}

/**
 * Función que busca un archivo en la ruta especificada.
 * @param {string} ruta - La ruta del archivo a buscar.
 * @returns {string|null} - La ruta completa del archivo si se encuentra, o null si no se encuentra.
 */
const ubicaArchivo = (directorio, ruta) => {
	const archivo = directorio + ruta

	try {
		if (existsSync(archivo)) return archivo
	} catch (error) {
		cError(error)
		return null
	}
}

/**
 * Configura el servidor en modo producción.
 * @returns {Array} Un arreglo con las rutas de los archivos y las rutas de los endpoints.
 */
const archivosHTML = modo => {
	log(
		`Configurando servidor en modo ${modo ? "desarrollo" : "producción"}...`
	)

	const ruta = modo ? resolve() : resolve(resolve(), "dist")

	return [ruta, resolve(ruta, LOGIN), resolve(ruta, INDEX)]
}

createApp(process.argv[2] === "true")
