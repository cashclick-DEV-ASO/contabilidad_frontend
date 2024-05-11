import Controlador from "./controlador.js"

export class ConTrnVirtualCtrl extends Controlador {
    constructor(vista, modelo) {
        super(vista, modelo)
        this.acciones = this.vista.acciones
        this.datos = this.vista.datos
        this.formatoTabla = {
            fecha_registro: this.formatoFecha,
            fecha_valor: this.formatoFecha,
            monto: this.formatoMoneda,
            tipo: (dato) => {
                const tipos = ["No Identificado", "Cargo", "Abono"]
                return tipos[dato]
            }
        }
    }

    cambiaFechaI = () => {
        if (this.acciones.fechaI.getValor() > this.acciones.fechaF.getValor())
            this.acciones.fechaF.setValor(this.acciones.fechaI.getValor())
    }

    cambiaFechaF = () => {
        if (this.acciones.fechaF.getValor() < this.acciones.fechaI.getValor())
            this.acciones.fechaI.setValor(this.acciones.fechaF.getValor())
    }

    buscar = () => {
        let msj = this.msjProcesando("Consultando transacciones...")
        this.datos.tabla.limpiar()

        const datos = {
            fechaI: this.acciones.fechaI.getValor(),
            fechaF: this.acciones.fechaF.getValor()
        }

        this.modelo.buscarTransacciones(datos).then((res) => {
            msj.ocultar()

            if (!res.success) return this.msjError(resultado.mensaje)

            if (res.datos.length === 0) {
                this.msjAdvertencia(
                    "No se encontraron transacciones para los criterios seleccionados."
                )
                return
            }

            this.datos.tabla.parseaJSON(res.datos, null, this.formatoTabla, ["id"]).actualizaTabla()
        })
    }
}

export default ConTrnVirtualCtrl
