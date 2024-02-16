import Controlador from "./controlador.js"

import { SYS } from "../src/constantes.js"

import { mostrarError } from "../src/utils.js"

export class ConTrnBancosCtrl extends Controlador {
    constructor(vista, modelo) {
        super(vista, modelo)
        this.acciones = this.vista.acciones
        this.datos = this.vista.datos
        this.formatoTabla = {
            fecha_valor: (dato) => {
                return new Date(dato).toLocaleDateString("es-ES", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric"
                })
            },
            fecha_creacion: (dato) => {
                return new Date(dato).toLocaleDateString("es-ES", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric"
                })
            },
            monto: (dato) => {
                const numero = parseFloat(dato)
                if (isNaN(numero)) return dato

                return numero.toLocaleString("es-MX", {
                    style: "currency",
                    currency: "MXN"
                })
            },
            tipo: (dato) => {
                const tipos = ["No Identificado", "Cargo", "Abono"]
                return tipos[dato]
            }
        }
    }

    cargaInicial = () => {
        this.acciones.banco.setTemporalPH("Cargando bancos...")
        this.llenaListaBancos().then(() => {
            this.acciones.banco.actulizaOpciones(this.bancos)
        })
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

            if (res.datos.length === 0) {
                this.msjAdvertencia(
                    "No se encontraron transacciones para los criterios seleccionados."
                )
                return
            }

            this.datos.tabla.parseaJSON(res.datos, null, this.formatoTabla).actualizaTabla()
        })
    }
}

export default ConTrnBancosCtrl
