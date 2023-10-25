import LoginModel from "../models/login.js"
import Controlador from "./controlador.js"

class LoginController extends Controlador {
    constructor(formulario) {
        super()
        this.formulario = formulario
        this.modelo = new LoginModel()
    }

    login = async event => {
        event.preventDefault()
        this.modelo.setUsuario(this.formulario.usuario.getValor())
        this.modelo.setPassword(this.formulario.password.getValor())

        const resultado = await this.modelo.login()
        if (resultado) {
            window.location.href = "/"
        }
        else this.msjError(this.modelo.mensaje)
    }

}

export default LoginController