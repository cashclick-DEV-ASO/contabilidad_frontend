import Controlador from "./controlador.js"

import { SYS } from "../src/constantes.js"

import { mostrarError } from "../src/utils.js"

export class ConAclaracionesCtrl extends Controlador {
    constructor(vista, modelo) {
        super(vista, modelo)
        this.acciones = this.vista.acciones
        this.datos = this.vista.datos
        this.formatoTabla = {
            monto_prestamo: this.formatoMoneda,
            parcialidad: this.formatoMoneda
        }
    }

    cargaInicial = async () => {
        this.acciones.estatus.setOpciones([
            { texto: "Abierto", valor: 1 },
            { texto: "Cerrado", valor: 2 }
        ])
    }

    buscar = async () => {
        if (this.datos.tabla.getFilas().length > 0) {
            this.datos.tabla.limpiar()
            this.msjError("No se encontraron registros.")
            return
        }

        this.datos.tabla
            .parseaJSON([
                {
                    id_credito: 1005235,
                    monto_prestamo: 100000,
                    interes: 80000,
                    parcialidad: 10540,
                    fecha_inicio: "25/05/2021",
                    fecha_ultimo_pago: "07/08/2021",
                    fecha_inicio_seguimiento: "10/08/2021",
                    estatus: "Cerrado",
                    notas: "10/08/2021 - El cliente solicita reembolso del cargo automático por haber pagado un día antes.<br><br>12/08/2021 - Se valida con el area de cobranza y se autoriza el reembolso.<br><br>20/08/2021 - Se realiza el reembolso y se cierra el caso.\n"
                },
                {
                    id_credito: 1005242,
                    monto_prestamo: 8000,
                    interes: 5000,
                    parcialidad: 800,
                    fecha_inicio: "05/07/2022",
                    fecha_ultimo_pago: "",
                    fecha_inicio_seguimiento: "10/08/2021",
                    estatus: "Abierto",
                    notas: "10/08/2021 - El cliente indica que solicito la cancelación del crédito, se pasa el caso a contraloria para su autorización."
                }
            ])
            .actualizaTabla()
    }
}

export default ConAclaracionesCtrl
