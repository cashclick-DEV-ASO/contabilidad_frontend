import Controlador from "./controlador.js"

import { SYS } from "../src/constantes.js"

import { mostrarError } from "../src/utils.js"

export class ResConciliacionCtrl extends Controlador {
    constructor(vista, modelo) {
        super(vista, modelo)
        this.acciones = this.vista.acciones
        this.datos = this.vista.datos
        this.resumenBancos = null
        this.resumenDWH = null
        this.resumenMambu = null
        this.plantillaInicial = "0 (0) - $0.00 (0%)"
    }

    cargaInicial = (noTrn, noTrnOK, noTrnNoOK) => {
        noTrn.setTxtDato(this.plantillaInicial).mostrar()
        noTrnOK.setTxtDato(this.plantillaInicial).mostrar()
        noTrnNoOK.setTxtDato(this.plantillaInicial).mostrar()
    }

    cambiaPeriodo = () => {
        const i = this.acciones.periodoI.getPeriodo()
        const f = this.acciones.periodoF.getPeriodo()

        if (i.anio > f.anio || (i.anio === f.anio && i.mes > f.mes))
            this.acciones.periodoI.setPeriodo(this.acciones.periodoF.getPeriodo())

        if (f.anio < i.anio || (f.anio === i.anio && f.mes < i.mes))
            this.acciones.periodoF.setPeriodo(this.acciones.periodoI.getPeriodo())
    }

    consultar = async () => {
        let msj = this.msjProcesando("Consultando información...")
        await this.consultarBancos()
        await this.consultarDWH()
        await this.consultarMambu()
        this.total()
        msj.ocultar()

        if (
            this.resumenBancos.noTrn === 0 &&
            this.resumenDWH.noTrn === 0 &&
            this.resumenMambu.noTrn === 0
        )
            this.msjError("No se encontró información para los periodos seleccionados.")
    }

    consultarBancos = async () => {
        this.resumenBancos = []
        const datos = await this.modelo.consultarBancos({
            periodoI: this.acciones.periodoI.getPeriodoTexto(),
            periodoF: this.acciones.periodoF.getPeriodoTexto()
        })

        if (!datos.success || datos.datos.length === 0)
            return this.cargaInicial(
                this.datos.tb_noTrn,
                this.datos.tb_noTrnOK,
                this.datos.tb_noTrnNoOK
            )

        this.resumenBancos = datos.datos[0]
        this.muestraResumen(
            this.datos.tb_noTrn,
            this.datos.tb_noTrnOK,
            this.datos.tb_noTrnNoOK,
            this.resumenBancos
        )
    }

    consultarDWH = async () => {
        this.resumenDWH = []
        const datos = await this.modelo.consultarDWH({
            periodoI: this.acciones.periodoI.getPeriodoTexto(),
            periodoF: this.acciones.periodoF.getPeriodoTexto()
        })

        if (!datos.success || datos.datos.length === 0)
            return this.cargaInicial(
                this.datos.td_noTrn,
                this.datos.td_noTrnOK,
                this.datos.td_noTrnNoOK
            )

        this.resumenDWH = datos.datos[0]
        this.muestraResumen(
            this.datos.td_noTrn,
            this.datos.td_noTrnOK,
            this.datos.td_noTrnNoOK,
            this.resumenDWH
        )
    }

    consultarMambu = async () => {
        this.resumenMambu = []
        const datos = await this.modelo.consultarMambu({
            periodoI: this.acciones.periodoI.getPeriodoTexto(),
            periodoF: this.acciones.periodoF.getPeriodoTexto()
        })

        if (!datos.success || datos.datos.length === 0)
            return this.cargaInicial(
                this.datos.tm_noTrn,
                this.datos.tm_noTrnOK,
                this.datos.tm_noTrnNoOK
            )

        this.resumenMambu = datos.datos[0]
        this.muestraResumen(
            this.datos.tm_noTrn,
            this.datos.tm_noTrnOK,
            this.datos.tm_noTrnNoOK,
            this.resumenMambu
        )
    }

    total = () => {
        if (!this.resumenBancos || !this.resumenDWH || !this.resumenMambu)
            return this.cargaInicial(
                this.datos.tl_noTrn,
                this.datos.tl_noTrnOK,
                this.datos.tl_noTrnNoOK
            )

        const noTrn = this.resumenBancos.noTrn + this.resumenDWH.noTrn + this.resumenMambu.noTrn
        const noTrnOK =
            this.resumenBancos.noTrnOK + this.resumenDWH.noTrnOK + this.resumenMambu.noTrnOK
        const noTrnNoOK =
            this.resumenBancos.noTrnNoOK + this.resumenDWH.noTrnNoOK + this.resumenMambu.noTrnNoOK

        const montoTrn =
            this.resumenBancos.montoTrn + this.resumenDWH.montoTrn + this.resumenMambu.montoTrn
        const montoTrnOK =
            this.resumenBancos.montoTrnOK +
            this.resumenDWH.montoTrnOK +
            this.resumenMambu.montoTrnOK
        const montoTrnNoOK =
            this.resumenBancos.montoTrnNoOK +
            this.resumenDWH.montoTrnNoOK +
            this.resumenMambu.montoTrnNoOK

        this.muestraResumen(this.datos.tl_noTrn, this.datos.tl_noTrnOK, this.datos.tl_noTrnNoOK, {
            noTrn,
            montoTrn,
            noTrnOK,
            montoTrnOK,
            noTrnNoOK,
            montoTrnNoOK
        })
    }

    muestraResumen = (noTrn, noTrnOK, noTrnNoOK, datos) => {
        noTrn
            .setTxtDato(`${datos.noTrn} (100%) - ${this.formatoMoneda(datos.montoTrn)} (100%)`)
            .mostrar()

        noTrnOK
            .setTxtDato(
                `${datos.noTrnOK} (${((datos.noTrnOK / datos.noTrn) * 100).toFixed(
                    2
                )}%) - ${this.formatoMoneda(datos.montoTrnOK)} (${(
                    (datos.montoTrnOK / datos.montoTrn) *
                    100
                ).toFixed(2)}%)`
            )
            .mostrar()

        noTrnNoOK
            .setTxtDato(
                `${datos.noTrnNoOK} (${((datos.noTrnNoOK / datos.noTrn) * 100).toFixed(
                    2
                )}%) - ${this.formatoMoneda(datos.montoTrnNoOK)} (${(
                    (datos.montoTrnNoOK / datos.montoTrn) *
                    100
                ).toFixed(2)}%)`
            )
            .mostrar()
    }
}

export default ResConciliacionCtrl
