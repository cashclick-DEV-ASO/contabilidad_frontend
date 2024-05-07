import Controlador from "./controlador.js"

import { SYS } from "../src/constantes.js"

import { mostrarError } from "../src/utils.js"

export class RegUsuariosCtrl extends Controlador {
    constructor(vista, modelo) {
        super(vista, modelo)
        this.acciones = this.vista.acciones
        this.datos = this.vista.datos
        this.formatoTabla = {
            saldo: this.formatoModena
        }
    }

    nombreVacio = (e) => {
        if (e.target.value === "") {
            this.msjError(
                `El campo ${e.target.previousElementSibling.textContent} no puede estar vacío`
            )
        }
    }

    validaCampos = () => {
        this.acciones.guardar.habilitarBoton(false)

        if (this.acciones.nombre1.getValor() === "") return
        // if (this.acciones.nombre2.getValor() === "") return
        if (this.acciones.apellido1.getValor() === "") return
        // if (this.acciones.apellido2.getValor() === "") return
        if (this.acciones.correo.getValor() === "") return
        if (this.acciones.password.getValor() === "") return
        if (this.acciones.perfil.dfltSelecciondo()) return

        this.acciones.guardar.habilitarBoton(true)
    }

    limpiar = () => {
        this.acciones.nombre1.reinicia()
        this.acciones.nombre2.reinicia()
        this.acciones.apellido1.reinicia()
        this.acciones.apellido2.reinicia()
        this.acciones.correo.reinicia()
        this.acciones.perfil.reinicia()
        this.acciones.password.reinicia()
        this.acciones.guardar.habilitarBoton(false)
    }

    guardar = async () => {
        const parametros = {
            nombre1: this.acciones.nombre1.getValor(),
            nombre2: this.acciones.nombre2.getValor(),
            apellido1: this.acciones.apellido1.getValor(),
            apellido2: this.acciones.apellido2.getValor(),
            correo: this.acciones.correo.getValor(),
            password: this.acciones.password.getValor(),
            perfil: this.acciones.perfil.getValorSeleccionado()
        }

        const res = await this.modelo.guardar(parametros)
        if (!res.success) return this.msjError(res.mensaje)

        this.msjExito("Usuario registrado exitosamente")
        this.limpiar()
    }
}

export default RegUsuariosCtrl
