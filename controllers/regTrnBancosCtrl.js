import Controlador from "./controlador.js"

export class RegTrnBancosCtrl extends Controlador {
    constructor(vista, modelo) {
        super(vista, modelo)
        this.acciones = this.vista.acciones
        this.datos = this.vista.datos
        this.fechaConfig = { day: "2-digit", month: "2-digit", year: "numeric" }
        this.monedaConfig = { style: "currency", currency: "MXN" }
        this.formatoDetalles = {
            Fecha_Operación: this.formatoFecha,
            Fecha_Emisión: this.formatoFecha,
            Saldo_Inicial: this.formatoMoneda,
            Saldo_Final: this.formatoMoneda,
            Total_Abonos: this.formatoMoneda,
            Total_Cargos: this.formatoMoneda
        }
        this.formatoTabla = {
            Fecha_Operación: this.formatoFecha,
            Fecha_Valor: this.formatoFecha,
            Monto: this.formatoMoneda,
            Tipo_Movimiento: this.tipoMovimiento
        }
    }

    cargaInicial = () => {
        this.acciones.selBanco.setTemporalPH("Cargando bancos...")
        this.llenaListaBancos().then(() => {
            this.acciones.selBanco.actulizaOpciones(this.bancos)
        })
    }

    cambioBanco = async () => {
        this.limpiaCampos()
        this.acciones.selLayout.actulizaOpciones().setTemporalPH("Cargando layout...").mostrar()

        this.banco = this.bancos.find(
            (banco) => banco.valor === Number(this.acciones.selBanco.getValorSeleccionado())
        )

        if (this.banco === undefined) {
            this.msjError("No se encontró información del banco seleccionado.")
            this.acciones.selArchivo.setMensaje("Selecciona un Banco.")
            this.acciones.selLayout.actulizaOpciones([])
            return
        }

        this.llenaListaLayouts(this.banco.valor).then(() => {
            if (this.layouts.length === 0) {
                this.msjError("No hay layouts disponibles.")
                this.acciones.selArchivo.setMensaje("Selecciona un Banco.")
                return
            }

            this.acciones.selLayout.actulizaOpciones(this.layouts)
            this.acciones.selArchivo.setMensaje("Selecciona un Layout.")
        })
    }

    cambioLayout = () => {
        this.limpiaCampos({ lyt: false })

        this.layout = this.layouts.find(
            (layout) => layout.valor === Number(this.acciones.selLayout.getValorSeleccionado())
        )

        if (this.layout === undefined) {
            this.msjError("No se encontró información del layout seleccionado.")
            this.acciones.selArchivo.setMensaje("Selecciona un Layout.")
            return
        }

        if (this.layout.extension === "")
            return this.msjError("El layout no indican las extensiones soportadas.")
        else this.acciones.selArchivo.setFormato(this.layout.extension.split(","))

        this.acciones.selArchivo.habilitaSelector()
        this.acciones.selArchivo.setMensaje("Oprime el botón para seleccionar un archivo.")
    }

    limpiaCampos = ({ lyt = true, bnk = false } = {}) => {
        bnk && this.acciones.selBanco.reinicia()
        lyt && this.acciones.selLayout.reinicia()
        this.acciones.selArchivo.limpiar()
        this.datos.tabla.limpiar()
    }

    cambioArchivo = () => {
        this.acciones.guardar.habilitarBoton(false)
    }

    leerArchivo = async () => {
        if (this.acciones.selLayout.getValorSeleccionado() === "default") {
            this.msjError("Se debe seleccionar un layout.")
            return
        }

        const lecturaOK = await this.modelo.leerArchivo(this.acciones.selArchivo.ruta)

        if (lecturaOK) {
            await this.modelo.aplicaLayout(this.banco, this.layout, lecturaOK)

            if (this.modelo.resultado) {
                const { informacion, movimientos } = this.modelo.resultado

                this.datos.tabla.setDetalles(
                    Object.assign({}, informacion.apertura, informacion.cierre),
                    this.formatoDetalles
                )

                this.datos.tabla.parseaJSON(movimientos, null, this.formatoTabla).actualizaTabla()

                this.acciones.guardar.habilitarBoton(true)
                return
            }
        }

        this.msjError(this.modelo.mensaje)
    }

    guardar = async () => {
        this.msjContinuar(
            `Se guardará la información del archivo:<br><br>${this.acciones.selArchivo.ruta.name}<br><br>¿Desea continuar?`,
            {
                txtSi: "Si, guardar",
                txtNo: "No, cancelar",
                callbackSi: this.preparaDatos
            }
        )
    }

    preparaDatos = async (cerrar = null) => {
        const msj = this.msjProcesando("Guardando transacciones...")
        const table = this.datos.tabla.tabla.getComponente()

        var data = []
        var headers = []

        for (var i = 0; i < table.rows[0].cells.length; i++) {
            headers[i] = table.rows[0].cells[i].innerHTML.toLowerCase().replace(/ /gi, "")
        }

        for (var i = 1; i < table.rows.length; i++) {
            var tableRow = table.rows[i]
            var rowData = {}
            for (var j = 0; j < tableRow.cells.length; j++) {
                rowData[headers[j]] = tableRow.cells[j].innerHTML
            }
            data.push(rowData)
        }

        const trns = data.map((trn) => {
            return {
                linea: trn.no,
                informacion: trn.descripción1 + "||" + trn.descripción2 + "||" + trn.descripción3,
                fecha_creacion: trn.fechaoperación,
                fecha_valor: trn.fechavalor,
                concepto: trn.idoperación,
                tipo: trn.tipomovimiento === "Cargo" ? 1 : 2,
                monto: trn.monto
            }
        })

        const periodo = this.acciones.selPeriodo.getPeriodo()

        const final = {
            periodo: periodo.anio + "" + periodo.mes,
            archivo: this.acciones.selArchivo.ruta.name,
            fecha_carga: this.fechaMysql(new Date()),
            id_cuenta: this.banco.valor,
            id_layout: this.layout.valor,
            trns
        }

        this.modelo.guardar(final).then((resultado) => {
            msj.ocultar()
            if (!resultado.success) return this.msjError(resultado.mensaje)

            this.msjExito("Se guardó la información correctamente.")
            this.acciones.selLayout.actulizaOpciones([])
            this.limpiaCampos({ lyt: true, bnk: true })
            this.acciones.guardar.habilitarBoton(false)

            if (cerrar) cerrar()
        })
    }

    fechaMysql = (fecha) => {
        return fecha.toISOString().slice(0, 19).replace("T", " ")
    }
}

export default RegTrnBancosCtrl
