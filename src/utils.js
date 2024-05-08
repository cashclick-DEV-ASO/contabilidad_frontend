import { DEV_MODE, URL_API } from "./constantes.js"

export const leerCookie = (nombreBuscado) => {
    const galletas = document.cookie.split(";")
    return galletas.reduce((valorEncontrado, galleta) => {
        const [nombre, valor] = galleta.split("=")

        if (nombre.trim() === nombreBuscado) return decodeURIComponent(valor.trim())
        else return valorEncontrado
    }, null)
}

export const limipiarCookies = () => {
    const galletas = document.cookie.split(";")
    galletas.forEach((galleta) => {
        const nombre = galleta.split("=")[0].trim()
        borrarCookie(nombre)
    })
}

export const cerrarSesion = () => {
    limipiarCookies()
    window.location.href = "/login"
}

export const escribirCookie = (nombre, valor, opciones = {}) => {
    let cookie = `${nombre}=${encodeURIComponent(valor)}`

    Object.keys(opciones).forEach((opcion) => (cookie += `; ${opcion}=${opciones[opcion]}`))
    document.cookie = cookie
}

export const borrarCookie = (nombre) => (document.cookie = `${nombre}=; max-age=0`)

export const getPeridoActual = () => {
    const fecha = new Date()
    const mes = fecha.getMonth() + 1
    const periodo = `${fecha.getFullYear()}${mes < 10 ? "0" + mes : mes}`

    return {
        anio: fecha.getFullYear(),
        mes: mes,
        periodo: periodo
    }
}

export const campoMoneda = (input, blur = false) => {
    var input_val = input.value
    if (input_val === "") return
    const original_len = input_val.length
    let caret_pos = input.selectionStart
    if (input_val.indexOf(".") >= 0) {
        const decimal_pos = input_val.indexOf(".")
        let left_side = input_val.substring(0, decimal_pos)
        let right_side = input_val.substring(decimal_pos)
        left_side = left_side.replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",")
        right_side = right_side.replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",")
        if (blur) right_side += "00"
        right_side = right_side.substring(0, 2)
        input_val = "$" + left_side + "." + right_side
    } else {
        input_val = input_val.replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",")
        input_val = "$" + input_val
        if (blur) input_val += ".00"
    }
    input.value = input_val
    var updated_len = input_val.length
    caret_pos = updated_len - original_len + caret_pos
    input.setSelectionRange(caret_pos, caret_pos)
}

export const limpiaDatoMoneda = (valor) => {
    return valor.replace(/[^\d.]/g, "")
}

export const getRutas = () => JSON.parse(leerCookie(RUTAS))

export const getURL = () => leerCookie(URL_API)

const devMode = leerCookie(DEV_MODE) === "true"

export const mostrarError = (error) => devMode && console.error(error)

export const mostrarResultado = (resultado) => devMode && console.log(resultado)
