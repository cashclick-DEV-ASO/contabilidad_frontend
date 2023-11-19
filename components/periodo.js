import { SYS, PERIODO } from "../src/constantes.js"

import { getPeridoActual } from "../src/utils.js"

import { Componente, SolicitaDato } from "./componentes.js"

/**
 * @class SelPeriodo
 * @extends Componente
 * @description Crea un componente para seleccionar el periodo
 */
export class Periodo extends Componente {
	constructor() {
		super(SYS.SCTN, { clase: PERIODO.CONTENEDOR })
		this.periodoActual = getPeridoActual()

		return this.inicia()
	}

	inicia() {
		this.setEstilo1()
		this.titulo = new Componente(SYS.LBL, { clase: PERIODO.TITULO }).setTexto(PERIODO.TXTTITULO)

		this.txtAnioPeriodo = new SolicitaDato()
			.setTipo(SYS.NMBR)
			.setTxtEtiqueta(PERIODO.A)
			.setValor(this.periodoActual.anio)
			.setID(PERIODO.ANIO_ID)
			.setEstilo2()
			.setPropiedad("min", PERIODO.ANIO_MINIMO)
			.setPropiedad("max", this.periodoActual.anio)
			.setListener(SYS.CHNG, () => {
				if (this.txtAnioPeriodo.getValor() > this.periodoActual.anio)
					this.txtAnioPeriodo.setValor(this.periodoActual.anio)

				if (this.txtAnioPeriodo.getValor() < PERIODO.ANIO_MINIMO)
					this.txtAnioPeriodo.setValor(PERIODO.ANIO_MINIMO)

				if (this.txtAnioPeriodo.getValor() % 1 !== 0)
					this.txtAnioPeriodo.setValor(parseInt(this.txtAnioPeriodo.getValor()))
			})

		this.txtMesPeriodo = new SolicitaDato()
			.setTipo(SYS.NMBR)
			.setTxtEtiqueta(PERIODO.M)
			.setValor(this.periodoActual.mes)
			.setID(PERIODO.MES_ID)
			.setEstilo2()
			.setPropiedad("min", 1)
			.setPropiedad("max", 12)
			.setListener(SYS.CHNG, () => {
				if (this.txtMesPeriodo.getValor() > 12) this.txtMesPeriodo.setValor(12)

				if (this.txtMesPeriodo.getValor() < 1) this.txtMesPeriodo.setValor(1)

				if (this.txtMesPeriodo.getValor() % 1 !== 0)
					this.txtMesPeriodo.setValor(parseInt(this.txtMesPeriodo.getValor()))
			})

		return this
	}

	configura() {
		this.addHijos([
			this.titulo.getComponente(),
			this.txtAnioPeriodo.mostrar(),
			this.txtMesPeriodo.mostrar(),
		])
		return this
	}

	mostrar() {
		return this.configura().getComponente()
	}
}

export default Periodo
