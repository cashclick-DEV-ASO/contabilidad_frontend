import LoginModel from "../models/login.js"
import Controlador from "./controlador.js"

export class LoginController extends Controlador {
    constructor(vista) {
        super(vista, new LoginModel())
    }

    login = async (event) => {
        event.preventDefault()

        const token = await grecaptcha.execute("6LfWk7cpAAAAAPkNuugHbI3Dd58xka1pTsgm6fol", {
            action: "validate_captcha"
        })

        this.modelo.setUsuario(this.vista.usuario.getValor())
        this.modelo.setPassword(this.vista.password.getValor())
        this.modelo.setGToken(token)

        await this.modelo.login()

        if (this.modelo.resultado && this.modelo.resultado.success) {
            window.location.href = "/"
        } else this.msjError(this.modelo.mensaje)
    }
}

export default LoginController
