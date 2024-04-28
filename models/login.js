import Modelo from "./modelo.js"

import { limipiarCookies, escribirCookie, mostrarError } from "../src/utils.js"

export class LoginModel extends Modelo {
    constructor() {
        super()
        this.user = ""
        this.pass = ""
        this.gToken = ""
        limipiarCookies()
    }

    setUsuario(usuario) {
        this.user = usuario
    }

    setPassword(password) {
        this.pass = password
    }

    setGToken(token) {
        this.gToken = token
    }

    async login() {
        if (!this.valida()) return false

        await this.post("login", {
            user: this.user,
            pass: this.pass,
            gToken: this.gToken
        })

        if (this.resultado.success) {
            if (this.resultado.errores) {
                mostrarError(this.resultado.errores)
                this.mensaje = this.resultado.mensaje
                return false
            }

            const { nombre, perfil, mapa } = this.resultado.datos[0]
            escribirCookie("SESION", true)
            escribirCookie("NOMBRE", nombre)
            escribirCookie("CSHPERFIL", perfil)
            escribirCookie("RUTAS", mapa)
        } else if (this.error) {
            if (this.resultado.errores) {
                debugger
            }
            this.mensaje =
                this.mensaje ??
                "Ocurrió un problema al validar la información.\nIntente nuevamente o contacte al administrador."
            return false
        }

        this.mensaje = "Credenciales incorrectas."

        return this.resultado.success
    }

    valida() {
        this.mensaje = null

        if (this.user === "" && this.pass === "")
            this.mensaje = "No se han proporcionado credenciales de acceso."
        else if (this.user === "") this.mensaje = "No se ha proporcionado el nombre de usuario."
        else if (this.pass === "") this.mensaje = "No se ha proporcionado la contraseña."

        return this.mensaje === null
    }
}

export default LoginModel
