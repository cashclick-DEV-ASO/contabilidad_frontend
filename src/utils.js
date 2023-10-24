export const leerCookie = (nombre) => {
    const galletas = document.cookie.split(";")
    for (let i = 0; i < galletas.length; i++) {
        const galleta = galletas[i].split("=")
        if (galleta[0].trim() === nombre) {
            return JSON.parse(galleta[1])
        }
    }
    return null
}

export default {
    leerCookie,
}