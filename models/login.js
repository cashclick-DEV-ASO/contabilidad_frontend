import { leerCookie, escribirCookie, mostrarError } from "../src/utils.js"
import Modelo from "./modelo.js"

class LoginModel extends Modelo {
    constructor() {
        super(decodeURIComponent(leerCookie("api")))
        this.user = ""
        this.pass = ""
        this.mensaje = "No se han proporcionado credenciales de acceso."
    }

    setUsuario(usuario) {
        this.user = usuario
    }

    setPassword(password) {
        this.pass = password
    }

    async login() {
        if (this.valida() != true) return false

        await this.post("login", { user: this.user, pass: this.pass })

        if (this.resultado) {
            if (this.resultado.success) {
                escribirCookie("token", this.resultado.informacion.token)
                escribirCookie("user", this.user)
                return true
            }
            this.mensaje = "Credenciales incorrectas."
            mostrarError(this.resultado.informacion)
        } else {
            this.mensaje = "Ocurrio un problema al validar la informacion.\nIntente nuevamente o contacte al administrador."
            mostrarError(this.error)
        }
        return false
    }

    valida() {
        if (this.user === "" && this.pass === "") return this.mensaje = "No se han proporcionado credenciales de acceso."
        else if (this.user === "") return this.mensaje = "No se ha proporcionado el nombre de usuario."
        else if (this.pass === "") return this.mensaje = "No se ha proporcionado la contraseña."
        else return true
    }
}

export default LoginModel

