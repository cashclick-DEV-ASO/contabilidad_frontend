import Controlador from "./controlador.js"

import { SYS } from "../src/constantes.js"

import { mostrarError } from "../src/utils.js"

export class ConTrnBancosCtrl extends Controlador {
    constructor(vista, modelo) {
        super(vista, modelo)
        this.acciones = this.vista.acciones
        this.datos = this.vista.datos
        this.formatoTabla = {
            fecha_valor: this.formatoFecha,
            fecha_creacion: this.formatoFecha,
            monto: this.formatoMoneda,
            tipo: this.tipoMovimiento
        }
    }

    cargaInicial = () => {
        this.acciones.banco.setTemporalPH("Cargando bancos...")
        this.llenaListaBancos().then(() => this.acciones.banco.actulizaOpciones(this.bancos))
    }

    cambiaFechaI = () => {
        if (this.acciones.fechaI.getValor() > this.acciones.fechaF.getValor())
            this.acciones.fechaF.setValor(this.acciones.fechaI.getValor())
    }

    cambiaFechaF = () => {
        if (this.acciones.fechaF.getValor() < this.acciones.fechaI.getValor())
            this.acciones.fechaI.setValor(this.acciones.fechaF.getValor())
    }

    cambioBanco = async () => {
        this.datos.tabla.limpiar()

        this.banco = this.bancos.find(
            (banco) => banco.valor === Number(this.acciones.banco.getValorSeleccionado())
        )

        this.acciones.buscar.habilitarBoton(true)
    }

    buscar = () => {
        let msj = this.msjProcesando("Consultando transacciones...")
        this.datos.tabla.limpiar()

        const datos = {
            fechaI: this.acciones.fechaI.getValor(),
            fechaF: this.acciones.fechaF.getValor(),
            banco: this.banco
        }

        this.modelo.buscarTransaccionesBancos(datos).then((res) => {
            msj.ocultar()

            if (!res.success) return this.msjError(resultado.mensaje)
            if (res.datos.length === 0)
                return this.msjAdvertencia(
                    "No se encontraron transacciones para los criterios seleccionados."
                )

            this.datos.tabla.parseaJSON(res.datos, null, this.formatoTabla).actualizaTabla()
        })
    }

    validaModificacion = (datos) => {
        const encabezados = this.datos.tabla.getEncabezados()
        return datos.some((dato, indice) => {
            const i = this.datos.tabla.mostrarNoFila ? indice + 1 : indice
            if (encabezados[i].toLowerCase() === "monto") {
                if (dato < 1) {
                    this.msjError("El monto debe ser mayor a cero.")
                    return true
                }
            }
            return false
        })
    }
}

export default ConTrnBancosCtrl
