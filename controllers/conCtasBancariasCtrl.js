import Controlador from "./controlador.js"

import { SYS } from "../src/constantes.js"

import { mostrarError } from "../src/utils.js"

export class ConCtasBancariasCtrl extends Controlador {
    constructor(vista, modelo) {
        super(vista, modelo)
        this.acciones = this.vista.acciones
        this.datos = this.vista.datos
        this.formatoTabla = {
            saldo: this.formatoModena
        }
    }

    formatoModena = (dato) => {
        const numero = parseFloat(dato)
        if (isNaN(numero)) return dato

        return numero.toLocaleString("es-MX", {
            style: "currency",
            currency: "MXN"
        })
    }

    cargaInicial = async () => {
        this.acciones.banco.setOpciones([
            { texto: "BBVA", valor: 2 },
            { texto: "STP", valor: 19 },
            { texto: "Conekta", valor: 20 }
        ])
    }

    consultar = async () => {
        if (this.datos.tabla.getFilas().length > 0) {
            this.datos.tabla.limpiar()
            this.msjError("No se encontraron registros.")
            return
        }

        this.datos.tabla
            .parseaJSON(
                [
                    {
                        banco: "BBVA",
                        cuenta: 35454343435453,
                        fecha_registro: "18/05/2020",
                        estatus: "Activa",
                        saldo: 12354879.54
                    },
                    {
                        banco: "BBVA",
                        cuenta: 12348354686554,
                        fecha_registro: "25/05/2020",
                        estatus: "Activa",
                        saldo: 1365455.25
                    },
                    {
                        banco: "Conekta",
                        cuenta: 864433541685,
                        fecha_registro: "06/09/2022",
                        estatus: "Activa",
                        saldo: 3554.87
                    }
                ],
                null,
                this.formatoTabla
            )
            .actualizaTabla()
    }
}

export default ConCtasBancariasCtrl
