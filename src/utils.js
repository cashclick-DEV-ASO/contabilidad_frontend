import { DEV_MODE, URL_API } from "./constantes.js"

export const leerCookie = nombreBuscado => {
	const galletas = document.cookie.split(";")
	return galletas.reduce((valorEncontrado, galleta) => {
		const [nombre, valor] = galleta.split("=")

		if (nombre.trim() === nombreBuscado) return decodeURIComponent(valor.trim())
		else return valorEncontrado
	}, null)
}

export const limipiarCookies = () => {
	const galletas = document.cookie.split(";")

	galletas.forEach(galleta => {
		const nombre = galleta.split("=")[0].trim()

		if (nombre.trim === DEV_MODE || nombre === URL_API) return
		borrarCookie(nombre)
	})
}

export const cerrarSesion = () => {
	limipiarCookies()
	window.location.href = "/login"
}

export const escribirCookie = (nombre, valor, opciones = {}) => {
	let cookie = `${nombre}=${encodeURIComponent(valor)}`

	Object.keys(opciones).forEach(opcion => (cookie += `; ${opcion}=${opciones[opcion]}`))
	document.cookie = cookie
}

export const borrarCookie = nombre => (document.cookie = `${nombre}=; max-age=0`)

export const getPeridoActual = () => {
	const fecha = new Date()
	const mes = fecha.getMonth() + 1
	const periodo = `${fecha.getFullYear()}${mes < 10 ? "0" + mes : mes}`

	return {
		anio: fecha.getFullYear(),
		mes: mes,
		periodo: periodo,
	}
}

export const getRutas = () => JSON.parse(leerCookie(RUTAS))

export const getURL = () => leerCookie(URL_API)

const devMode = leerCookie(DEV_MODE) === "true"

export const mostrarError = error => devMode && console.error(error)

export const mostrarResultado = resultado => devMode && console.log(resultado)
