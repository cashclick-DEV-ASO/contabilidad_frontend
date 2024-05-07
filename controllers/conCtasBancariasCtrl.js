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

    cargaInicial = () => {
        this.acciones.banco.setTemporalPH("Cargando bancos...")
        this.llenaListaBancos().then(() => this.acciones.banco.actulizaOpciones(this.bancos))
    }

    buscar = async () => {
        const res = await this.modelo.buscar(this.acciones.banco.getValorSeleccionado())
        if (!res.success) return mostrarError(res.mensaje)

        this.datos.tabla
            .parseaJSON(res.datos, null, this.formatoTabla, ["id_c", "id_b"])
            .actualizaTabla()
    }
}

export default ConCtasBancariasCtrl
