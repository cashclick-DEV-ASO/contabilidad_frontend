import {
	ANIO_MINIMO,
	SEL_PERIODO_CLS,
	TITULO_PERIODO_CLS,
	ANIO_PERIODO_ID,
	MES_PERIODO_ID,
	MES_PERIODO_LBL_ID,
	ANIO_PERIODO_LBL_ID,
	PERIODO_ESTILO_1,
	PERIODO_ESTILO_2,
} from "../src/constantes.js"

import { getPeridoActual } from "../src/utils.js"

import { Componente } from "./componentes.js"

/**
 * @class SelPeriodo
 * @extends Componente
 * @description Crea un componente para seleccionar el periodo
 */
export class SelPeriodo extends Componente {
	constructor() {
		super("section", { clase: SEL_PERIODO_CLS })
		this.periodoActual = getPeridoActual()
		this.estilos = {
			PERIODO_ESTILO_1,
			PERIODO_ESTILO_2,
		}

		return this.inicia()
	}

	setEstilo(estilo) {
		this.setClase(estilo)
	}

	setEstilo1() {
		this.setEstilo(this.estilos.PERIODO_ESTILO_1)
	}

	setEstilo2() {
		this.setEstilo(this.estilos.PERIODO_ESTILO_2)
	}

	inicia() {
		this.lblPeriodo = new Componente("label", { clase: TITULO_PERIODO_CLS })
		this.lblAnioPeriodo = new Componente("label", {
			id: ANIO_PERIODO_LBL_ID,
		})
		this.lblMesPeriodo = new Componente("label", { id: MES_PERIODO_LBL_ID })
		this.txtAnioPeriodo = new Componente("input", { id: ANIO_PERIODO_ID })
		this.txtMesPeriodo = new Componente("input", { id: MES_PERIODO_ID })
		return this
	}

	configura() {
		this.lblPeriodo.setTexto("Periodo")

		this.lblAnioPeriodo.setTexto("Año")

		this.lblMesPeriodo.setTexto("Mes")

		this.txtAnioPeriodo.setPropiedad("type", "number")
		this.txtAnioPeriodo.setPropiedad("min", ANIO_MINIMO)
		this.txtAnioPeriodo.setPropiedad("max", this.periodoActual.anio)
		this.txtAnioPeriodo.setValor(this.periodoActual.anio)
		this.txtAnioPeriodo.setListener("change", () => {
			if (this.txtAnioPeriodo.getValor() > this.periodoActual.anio)
				this.txtAnioPeriodo.setValor(this.periodoActual.anio)

			if (this.txtAnioPeriodo.getValor() < ANIO_MINIMO)
				this.txtAnioPeriodo.setValor(ANIO_MINIMO)

			if (this.txtAnioPeriodo.getValor() % 1 !== 0)
				this.txtAnioPeriodo.setValor(
					parseInt(this.txtAnioPeriodo.getValor())
				)
		})

		this.txtMesPeriodo.setPropiedad("type", "number")
		this.txtMesPeriodo.setPropiedad("min", 1)
		this.txtMesPeriodo.setPropiedad("max", 12)
		this.txtMesPeriodo.setValor(this.periodoActual.mes)
		this.txtMesPeriodo.setListener("change", () => {
			if (this.txtMesPeriodo.getValor() > 12)
				this.txtMesPeriodo.setValor(12)

			if (this.txtMesPeriodo.getValor() < 1)
				this.txtMesPeriodo.setValor(1)

			if (this.txtMesPeriodo.getValor() % 1 !== 0)
				this.txtMesPeriodo.setValor(
					parseInt(this.txtMesPeriodo.getValor())
				)
		})

		return this
	}

	crea() {
		this.addHijos([
			this.lblPeriodo.getComponente(),
			this.lblAnioPeriodo.getComponente(),
			this.txtAnioPeriodo.getComponente(),
			this.lblMesPeriodo.getComponente(),
			this.txtMesPeriodo.getComponente(),
		])
		return this
	}

	mostrar() {
		return this.configura().crea().getComponente()
	}

	ocultar() {
		this.removeComponente()
	}
}

export default SelPeriodo
