import Componente from "../components/componente.js"
import LoginController from "../controllers/login.js"

import Label from "../components/label.js"
import Boton from "../components/boton.js"
import Input from "../components/input.js"

class FormularioLogin extends Componente {
    constructor() {
        super(document.createElement("form"), "formulario")
        this.controlador = new LoginController(this)
    }

    iniciarElementos() {
        this.titulo = new Label("Inicio de sesión", "lblTitulo")
        this.usuario = new Input("text")
        this.password = new Input("password")
        this.btnLogin = new Boton("Iniciar sesión")
    }

    configurarElementos() {
        this.usuario.addPlaceholder("Usuario")
        this.password.addPlaceholder("Contraseña")
        this.addListener("submit", this.controlador.login)
    }

    integrarElementos() {
        this.elemento.appendChild(this.titulo.elemento)
        this.elemento.appendChild(this.usuario.elemento)
        this.elemento.appendChild(this.password.elemento)
        this.elemento.appendChild(this.btnLogin.elemento)
    }

    crearElementos() {
        this.iniciarElementos()
        this.configurarElementos()
        this.integrarElementos()
    }
}

export default FormularioLogin