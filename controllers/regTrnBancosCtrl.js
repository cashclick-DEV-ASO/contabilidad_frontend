import Controlador from "./controlador.js"
import { SYS } from "../src/constantes.js"

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
        this.formatoTablaBBVA = {
            Fecha_Operación: this.formatoFecha,
            Fecha_Valor: this.formatoFecha,
            Monto: this.formatoMoneda,
            Tipo_Movimiento: this.tipoMovimiento,
            Crédito: (dato) => {
                if (dato.length !== 9) return ""
                if (dato.substring(0, 3) !== "100") return ""
                return dato
            }
        }
        this.formatoTablaConekta = {
            Fecha_Creación: this.formatoFecha,
            Fecha_Pago: this.formatoFecha,
            Monto: this.formatoMoneda,
            Estatus: (dato) => {
                const tipos = {
                    paid: "Pagado",
                    pending_payment: "Pendiente",
                    refunded: "Reembolsado"
                }
                return tipos[dato] || dato
            }
        }
        this.formatoTablaSTP = {
            "Fecha Captura": this.formatoFecha,
            "Fecha Operación": this.formatoFecha,
            Monto: this.formatoMoneda
        }
    }

    cargaInicial = () => {
        this.acciones.selBanco.setTemporalPH("Cargando bancos...")
        this.llenaListaBancos().then(() => {
            this.acciones.selBanco.actulizaOpciones(this.bancos)
        })
    }

    cambioBanco = async () => {
        this.limpiaCampos({ lyt: true, cta: true })
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

        this.llenaListaCtasContables(this.banco.valor).then(() => {
            if (this.ctasContables.length === 0)
                return this.msjError("No hay cuentas registradas para el banco seleccionado.")

            this.acciones.cuenta.actulizaOpciones(this.ctasContables)
        })
    }

    cambioCuenta = () => {
        this.limpiaCampos({ lyt: true })
        this.acciones.selLayout.actulizaOpciones().setTemporalPH("Cargando layout...").mostrar()

        this.cuenta = this.ctasContables.find(
            (cta) => cta.valor === Number(this.acciones.cuenta.getValorSeleccionado())
        )

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
        this.limpiaCampos()

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

    limpiaCampos = ({ lyt = false, cta = false, bnk = false } = {}) => {
        bnk && this.acciones.selBanco.reinicia()
        cta && this.acciones.cuenta.reinicia()
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

        this.acciones.guardar.habilitarBoton(false)
        this.datos.tabla.limpiar()

        const lecturaOK = await this.modelo.leerArchivo(
            this.acciones.selArchivo.ruta,
            this.banco.texto === "STP"
        )

        if (lecturaOK) {
            await this.modelo.aplicaLayout(this.banco, this.cuenta, this.layout, lecturaOK)

            if (this.modelo.resultado) {
                const { informacion, movimientos } = this.modelo.resultado

                this.datos.tabla.setDetalles(
                    Object.assign({}, informacion.apertura, informacion.cierre),
                    this.formatoDetalles
                )

                let formato = {}
                if (this.banco.texto === "BBVA") formato = this.formatoTablaBBVA
                if (this.banco.texto === "Conekta") formato = this.formatoTablaConekta
                if (this.banco.texto === "STP") formato = this.formatoTablaSTP

                this.datos.tabla.parseaJSON(movimientos, null, formato).actualizaTabla()

                this.acciones.guardar.habilitarBoton(true)
                return
            }
        }

        this.msjError(this.modelo.mensaje)
    }

    guardar = async () => {
        let cb = null
        if (this.banco.texto === "BBVA") cb = this.preparaDatosBBVA
        if (this.banco.texto === "Conekta") cb = this.preparaDatosConekta
        if (this.banco.texto === "STP") cb = this.preparaDatosSTP

        this.msjContinuar(
            `Se guardará la información del archivo:<br><br>${this.acciones.selArchivo.ruta.name}<br><br>¿Desea continuar?`,
            {
                txtSi: "Si, guardar",
                txtNo: "No, cancelar",
                callbackSi: cb
            }
        )
    }

    preparaDatosBBVA = async (cerrar = null) => {
        const msj = this.msjProcesando("Guardando transacciones...")

        this.saveData(
            this.getData().map((trn) => {
                return {
                    linea: trn.no,
                    informacion: `${trn.descripción1}||${trn.descripción2}||${trn.descripción3}`,
                    fecha_creacion: trn.fechaoperación,
                    fecha_valor: trn.fechavalor,
                    concepto: trn.idoperación,
                    tipo: trn.tipomovimiento === "Cargo" ? 1 : 2,
                    credito: trn.crédito,
                    monto: trn.monto
                }
            }),
            msj,
            cerrar
        )
    }

    preparaDatosConekta = (cerrar = null) => {
        const msj = this.msjProcesando("Guardando transacciones...")

        this.saveData(
            this.getData().map((trn) => {
                return {
                    linea: trn.no,
                    informacion: `${trn.identificador}||${trn.nombrecliente}||${trn.observaciones}||${trn.estatus}`,
                    fecha_creacion: trn.fechacreación,
                    fecha_valor: trn.fechapago,
                    concepto: trn.estatus,
                    tipo: 2,
                    monto: trn.monto,
                    id_banco: this.banco.valor,
                    credito: trn.idcliente
                }
            }),
            msj,
            cerrar
        )
    }

    preparaDatosSTP = (cerrar = null) => {
        const msj = this.msjProcesando("Guardando transacciones...")

        this.saveData(
            this.getData().map((trn) => {
                return {
                    linea: trn.no,
                    informacion: `${trn.conceptodelpago}||${trn.beneficiario}||${trn.causadevolución}`,
                    fecha_creacion: trn.fechacaptura,
                    fecha_valor: trn.fechaoperación,
                    concepto: trn.rastreo,
                    tipo: 2,
                    monto: trn.monto,
                    id_banco: this.banco.valor
                }
            }),
            msj,
            cerrar
        )
    }

    getData = () => {
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
        return data
    }

    saveData = (trns, msj, cerrar) => {
        const periodo = this.acciones.selPeriodo.getPeriodo()

        const final = {
            periodo: periodo.anio + "" + periodo.mes,
            archivo: this.acciones.selArchivo.ruta.name,
            fecha_carga: this.fechaMysql(new Date()),
            id_cuenta: this.cuenta.valor,
            id_layout: this.layout.valor,
            id_banco: this.banco.valor,
            trns
        }

        this.modelo.guardar(final).then((resultado) => {
            msj.ocultar()

            if (cerrar) cerrar()
            if (!resultado.success) return this.msjError(resultado.mensaje)

            this.msjExito("Se guardó la información correctamente.")
            this.acciones.selLayout.actulizaOpciones([])
            this.acciones.cuenta.actulizaOpciones([])
            this.limpiaCampos({ lyt: true, cta: true, bnk: true })
            this.acciones.guardar.habilitarBoton(false)
        })
    }

    fechaMysql = (fecha) => {
        return fecha.toISOString().slice(0, 19).replace("T", " ")
    }

    validaModificacion = (datos) => {
        const fechas = [
            "Fecha_Operación",
            "Fecha_Valor",
            "Fecha_Creación",
            "Fecha_Pago",
            "Fecha Captura",
            "Fecha Operación"
        ]

        return Object.keys(datos).some((dato) => {
            if (fechas.includes(dato)) {
                const fecha = new Date(datos[dato])
                if (isNaN(fecha.getTime())) {
                    this.msjError(`La ${dato.replace(/_/g, " ")} no es válida.`)
                    return true
                }
                if (fecha < new Date("2020-01-01")) {
                    this.msjError(`La ${dato.replace(/_/g, " ")} no puede ser menor al 01/01/2020.`)
                    return true
                }
                if (fecha > new Date()) {
                    this.msjError(
                        `La ${dato.replace(/_/g, " ")} no puede ser mayor a la del día actual.`
                    )
                    return true
                }
            }
            if (dato === "Monto") {
                if (datos[dato] < 1) {
                    this.msjError(`El campo ${dato} debe ser mayor a cero.`)
                    return true
                }
            }
            if (dato === "Tipo_Movimiento" && datos[dato] === SYS.DFLT)
                return this.msjError("El tipo de movimiento no puede quedar en blanco.")
        })
    }
}

export default RegTrnBancosCtrl
