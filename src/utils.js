export const leerCookie = (nombre) => {
    const galletas = document.cookie.split(";")
    for (let i = 0; i < galletas.length; i++) {
        const galleta = galletas[i].split("=")
        if (galleta[0].trim() === nombre) {
            return galleta[1]
        }
    }
    return null
}

export const escribirCookie = (nombre, valor) => {
    document.cookie = `${nombre}=${valor}`
}

export const borrarCookie = (nombre) => {
    document.cookie = `${nombre}=; max-age=0`
}

const DEV_MODE = leerCookie("dev_mode")
export const mostrarError = (error) => DEV_MODE === "true" && console.log(error)
export const mostrarResultado = (resultado) => DEV_MODE === "true" && console.log(resultado)

export default {
    leerCookie,
    mostrarError,
    mostrarResultado
}