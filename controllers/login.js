import LoginModel from "../models/login.js"
import Controlador from "./controlador.js"

export class LoginController extends Controlador {
	constructor(vista) {
		super(vista, new LoginModel())
	}

	login = async event => {
		event.preventDefault()
		this.modelo.setUsuario(this.vista.usuario.getValor())
		this.modelo.setPassword(this.vista.password.getValor())

		const resultado = await this.modelo.login()
		if (resultado) {
			window.location.href = "/"
		} else this.msjError(this.modelo.mensaje).mostrar()
	}
}

export default LoginController
