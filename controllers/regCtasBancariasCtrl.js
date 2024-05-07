import Controlador from "./controlador.js"

import { SYS } from "../src/constantes.js"

import { mostrarError } from "../src/utils.js"

export class RegCtasBancariasCtrl extends Controlador {
    constructor(vista, modelo) {
        super(vista, modelo)
        this.acciones = this.vista.acciones
        this.datos = this.vista.datos
    }

    cargaInicial = () => {
        this.acciones.banco.setTemporalPH("Cargando bancos...")
        this.llenaListaBancosTodos().then(() => this.acciones.banco.actulizaOpciones(this.bancos))
    }

    async llenaListaBancosTodos() {
        await this.modelo.getBancosTodos()

        this.bancos = this.getLista((banco) => ({
            valor: banco.id,
            texto: banco.nombre
        }))
    }

    guardar = async () => {
        if (this.datos.confirmacion.getValor() !== this.datos.cuenta.getValor())
            return this.msjError("Los números de cuenta no coinciden.")
        if (this.datos.saldo.getValor() === "") return this.msjError("Ingrese el saldo inicial.")

        const res = await this.modelo.guardarCuenta(
            [
                this.datos.cuenta.getValor(),
                this.acciones.banco.getValorSeleccionado(),
                this.datos.comentarios.getValor()
            ],
            [this.datos.fecha.getValorFecha(), 0, this.datos.saldo.getValor()]
        )

        if (res.error) return this.msjError(res.error)
        this.msjExito("Cuenta bancaria registrada exitosamente.")
    }

    cambioBanco = async () => {
        this.datos.cuenta.setValor("")
        this.datos.confirmacion.setValor("")
        this.datos.saldo.setValor("")
        this.datos.cuenta.habilitarInput(true)
        this.datos.saldo.habilitarInput(false)
        this.datos.fecha.habilitarInput(false)
        this.datos.comentarios.habilitarInput(false)
        this.acciones.guardar.habilitarBoton(false)
    }

    modificacionCuenta = async () => {
        this.acciones.guardar.habilitarBoton(false)
        this.datos.confirmacion.setValor("")
        this.datos.saldo.setValor("")
        this.datos.confirmacion.habilitarInput(false)
        this.datos.saldo.habilitarInput(false)
        this.datos.fecha.habilitarInput(false)
        this.datos.comentarios.habilitarInput(false)
        this.acciones.guardar.habilitarBoton(false)

        if (this.datos.cuenta.getValor().length > 5) this.datos.confirmacion.habilitarInput(true)
    }

    validarCuenta = async () => {
        this.datos.fecha.habilitarInput(false)
        this.datos.comentarios.habilitarInput(false)
        this.acciones.guardar.habilitarBoton(false)
        if (this.datos.confirmacion.getValor().length < 5) this.datos.saldo.setValor("")

        const habilita = this.datos.confirmacion.getValor() === this.datos.cuenta.getValor()
        this.datos.saldo.habilitarInput(habilita)
        this.datos.fecha.habilitarInput(habilita)
        this.datos.comentarios.habilitarInput(habilita)
        if (!habilita) this.datos.saldo.setValor("")
    }

    validarSaldo = async () => {
        if (this.datos.saldo.getValor() === "") {
            this.acciones.guardar.habilitarBoton(false)
            this.datos.fecha.habilitarInput(false)
            this.datos.comentarios.habilitarInput(false)
            this.acciones.guardar.habilitarBoton(false)
            return
        }

        this.acciones.guardar.habilitarBoton(true)
        this.datos.fecha.habilitarInput(true)
        this.datos.comentarios.habilitarInput(true)
        this.acciones.guardar.habilitarBoton(true)
    }
}

export default RegCtasBancariasCtrl
