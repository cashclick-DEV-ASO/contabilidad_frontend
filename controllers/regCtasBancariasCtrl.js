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
        if (this.acciones.confirmacion.getValor() !== this.acciones.cuenta.getValor())
            return this.msjError("Los números de cuenta no coinciden.")
        if (this.acciones.saldo.getValor() === "") return this.msjError("Ingrese el saldo inicial.")

        const res = await this.modelo.guardar(
            [
                this.acciones.cuenta.getValor(),
                this.acciones.banco.getValorSeleccionado(),
                this.acciones.comentarios.getValor()
            ],
            [this.acciones.fecha.getValorFecha(), 0, this.acciones.saldo.getValor()]
        )

        if (res.error) return this.msjError(res.error)
        this.msjExito("Cuenta bancaria registrada exitosamente.")
    }

    limpiar = () => {
        this.acciones.banco.reiniciar()
        this.acciones.cuenta.setValor("")
        this.acciones.confirmacion.setValor("")
        this.acciones.saldo.setValor("")
        this.acciones.cuenta.habilitarInput(false)
        this.acciones.confirmacion.habilitarInput(false)
        this.acciones.saldo.habilitarInput(false)
        this.acciones.fecha.habilitarInput(false)
        this.acciones.comentarios.habilitarInput(false)
        this.acciones.guardar.habilitarBoton(false)
    }

    cambioBanco = async () => {
        this.acciones.cuenta.setValor("")
        this.acciones.confirmacion.setValor("")
        this.acciones.saldo.setValor("")
        this.acciones.cuenta.habilitarInput(true)
        this.acciones.confirmacion.habilitarInput(false)
        this.acciones.saldo.habilitarInput(false)
        this.acciones.fecha.habilitarInput(false)
        this.acciones.comentarios.habilitarInput(false)
        this.acciones.guardar.habilitarBoton(false)
    }

    modificacionCuenta = async () => {
        this.acciones.guardar.habilitarBoton(false)
        this.acciones.confirmacion.setValor("")
        this.acciones.saldo.setValor("")
        this.acciones.confirmacion.habilitarInput(false)
        this.acciones.saldo.habilitarInput(false)
        this.acciones.fecha.habilitarInput(false)
        this.acciones.comentarios.habilitarInput(false)
        this.acciones.guardar.habilitarBoton(false)

        if (this.acciones.cuenta.getValor().length > 5)
            this.acciones.confirmacion.habilitarInput(true)
    }

    validarCuenta = async () => {
        this.acciones.fecha.habilitarInput(false)
        this.acciones.comentarios.habilitarInput(false)
        this.acciones.guardar.habilitarBoton(false)
        if (this.acciones.confirmacion.getValor().length < 5) this.acciones.saldo.setValor("")

        const habilita = this.acciones.confirmacion.getValor() === this.acciones.cuenta.getValor()
        this.acciones.saldo.habilitarInput(habilita)
        this.acciones.fecha.habilitarInput(habilita)
        this.acciones.comentarios.habilitarInput(habilita)
        if (!habilita) this.acciones.saldo.setValor("")
    }

    validarSaldo = async () => {
        if (this.acciones.saldo.getValor() === "") {
            this.acciones.guardar.habilitarBoton(false)
            this.acciones.fecha.habilitarInput(false)
            this.acciones.comentarios.habilitarInput(false)
            this.acciones.guardar.habilitarBoton(false)
            return
        }

        this.acciones.guardar.habilitarBoton(true)
        this.acciones.fecha.habilitarInput(true)
        this.acciones.comentarios.habilitarInput(true)
        this.acciones.guardar.habilitarBoton(true)
    }
}

export default RegCtasBancariasCtrl
