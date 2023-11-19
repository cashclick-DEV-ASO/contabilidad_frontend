import { Componente, ListaDesplegable, SolicitaDato, Botonera, MuestraDato } from "./componentes.js"

import { SYS, TABLA } from "../src/constantes.js"

export class TablaDatos extends Componente {
	constructor() {
		super(SYS.SCTN, { clase: TABLA.CONTENEDOR })
		this.encabezados = []
		this.filas = []
		this.filasTmp = []
		this.permiteFiltro = true
		this.permiteEditar = false
		this.permiteExportar = true
		this.permiteOrdenar = true
		this.muestraNoFila = true
		this.detalles = {
			No_Cta: 741815011205305,
			Titular: "DIGIFIN SA DE CV SOFOM",
			Fecha_Operación: "2023-08-21T06:00:00.000Z",
			Fecha_Emisión: "2023-08-21T06:00:00.000Z",
			Saldo_Inicial: 201956.51,
			Saldo_Final: 45575.99,
			Total_Cargos: 270902.48,
			Total_Abonos: 114521.96,
			No_Cargos: 6,
			No_Abonos: 85,
		}
		return this.inicia()
	}

	inicia() {
		this.controles = new Componente(SYS.SCTN, { clase: TABLA.CONTROLES })

		this.selColFiltro = new ListaDesplegable()
			.setTxtEtiqueta(TABLA.TXT_LBL_FILTRO)
			.setEstilo2()
			.setTxtPhLleno("Cualquier columna")
			.setBloquearPh(false)
			.setListener(SYS.CHNG, this.limpiarFiltro.bind(this))

		this.valorFiltro = new SolicitaDato()
			.setTipo(SYS.TXT)
			.setTxtEtiqueta(TABLA.TXT_LBL_PARAMETRO)
			.setTxtPlaceholder(TABLA.TXT_PH_FILTRO)
			.setEstilo2()
			.setListenerCambio(this.filtrar.bind(this), SYS.KUP)

		this.contenedorDetalles = new Componente(SYS.SCTN, {
			clase: TABLA.DETALLES,
		})

		this.contenedor = new Componente(SYS.SCTN, {
			clase: TABLA.TABLA,
		})

		// this.tablaSinDatos()
		this.filas = filas
		this.encabezados = encabezados
		this.mostrarDetalles()
		this.construirTabla(encabezados, filas)
		return this
	}

	configura() {
		this.botones = this.congifuraBotones()

		this.controles.addHijos([
			this.permiteFiltro ? this.selColFiltro.mostrar() : null,
			this.permiteFiltro ? this.valorFiltro.mostrar() : null,
			this.botones.getNumeroBotones() ? this.botones.mostrar() : null,
		])

		this.addHijos([
			this.controles.esPadre() ? this.controles.getComponente() : null,
			this.contenedorDetalles.getComponente(),
			this.contenedor.addHijo(this.tabla.getComponente()).getComponente(),
		])
		return this
	}

	mostrar() {
		return this.configura().getComponente()
	}

	parseaJSON(datos = [], titulos = null, formatoEspecial = null) {
		this.encabezados = []
		this.filas = []

		if (!datos || typeof datos !== SYS.OBJ || datos.length === 0) return this

		if (this.muestraNoFila) datos = datos.map((d, i) => ({ No: i + 1, ...d }))

		if (titulos) {
			this.encabezados = Object.keys(titulos).forEach(key => {
				return titulos[key]
			})
		} else {
			this.encabezados = Object.keys(datos[0])
		}

		this.filas = datos.map(f =>
			this.encabezados.map(k => {
				if (formatoEspecial && formatoEspecial[k]) {
					if (formatoEspecial[k]) return formatoEspecial[k](f[k])
				}
				return f[k]
			})
		)

		return this
	}

	parseaTexto(texto, separador = "\t") {
		this.encabezados = []
		this.filas = []
		if (!texto || texto === "") return this

		const lineas = texto.split("\r\n")
		this.encabezados = lineas[0].split(separador)
		this.filas = lineas.slice(1).map(l => l.split(separador))

		return this
	}

	construirTabla(encabezados = this.encabezados, filas = this.filas) {
		this.tabla = new Componente(SYS.TBL, { clase: TABLA.ID_TABLA })
		const tblEncabezdos = new Componente(SYS.THD, {
			clase: TABLA.TBL_ENC,
		})
		const tblCuerpo = new Componente(SYS.TBD, { clase: TABLA.TBL_CUERPO })

		tblEncabezdos.addHijo(
			new Componente(SYS.TR, { clase: TABLA.TBL_FILA_HDR })
				.addHijos(
					encabezados.map(e => {
						const enc = new Componente(SYS.TH, { clase: TABLA.TBL_CELDA_HDR }).setTexto(
							this.limpiarTitulo(e)
						)

						if (this.permiteOrdenar) {
							enc.setListener(SYS.CLK, e =>
								this.ordenar.bind(this)(e, this.tabla.getComponente())
							)
						}

						return enc.getComponente()
					})
				)
				.getComponente()
		)

		tblCuerpo.addHijos(
			filas.map((f, i) => {
				const fila = new Componente(SYS.TR, { clase: TABLA.TBL_FILA, id: i + 1 }).addHijos(
					f.map(c => {
						const cld = new Componente(SYS.TD, { clase: TABLA.TBL_CELDA }).setTexto(c)

						cld.setClase(this.tipoDato(c))

						if (this.permiteEditar) {
							cld.setListener(SYS.DCLK, this.editar)
						}
						return cld.getComponente()
					})
				)

				return fila.getComponente()
			})
		)

		this.tabla.addHijos([tblEncabezdos.getComponente(), tblCuerpo.getComponente()])

		return this
	}

	tablaSinDatos() {
		this.tabla = new Componente(SYS.DIV, { clase: TABLA.SIN_DATOS })
		this.tabla.setTexto(TABLA.TXT_SIN_DATOS)
		this.tabla.setPropiedad("style", TABLA.ESTILO_SIN_DATOS)

		return this
	}

	limpiar() {
		this.encabezados = []
		this.filas = []
		this.detalles = null
		this.formatoDetalles = null
		this.actualizaTabla()
		return this
	}

	actualizaTabla({ encabezados = this.encabezados, filas = this.filas, updtFiltro = true } = {}) {
		this.tabla.removeComponente()
		if (this.filas.length == 0) this.tablaSinDatos()
		else this.construirTabla(encabezados, filas)

		this.mostrarDetalles()
		this.contenedor.addHijo(this.tabla.getComponente())
		if (updtFiltro)
			this.selColFiltro.actulizaOpciones(
				this.encabezados.map((titulo, indice) => {
					return { valor: indice, texto: this.limpiarTitulo(titulo) }
				})
			)

		return this
	}

	eliminaFila(indice) {
		this.filas.splice(indice, 1)
		return this
	}

	agregaFila(fila, indice = this.filas.length) {
		this.filas.splice(indice, 0, fila)
		return this
	}

	getFila(indice) {
		return this.filas[indice]
	}

	filtrar() {
		if (this.filasTmp.length === 0) this.filasTmp = this.filas

		const col = this.selColFiltro.getValorSeleccionado()
		const filtro = this.valorFiltro.getValor()

		if (filtro === "") {
			this.filas = this.filasTmp
			this.filasTmp = []
		} else {
			if (col === SYS.DFLT) {
				this.filas = this.filasTmp.filter(f => {
					return f.some(c => {
						if (isNaN(c)) return c.toLowerCase().includes(filtro.toLowerCase())
						return c == filtro
					})
				})
			} else {
				this.filas = this.filasTmp.filter(f => {
					const valor = f[col]
					if (isNaN(valor)) return valor.toLowerCase().includes(filtro.toLowerCase())
					return valor == filtro
				})
			}
		}

		this.actualizaTabla({ updtFiltro: false })
		return this
	}

	limpiarFiltro() {
		if (this.filasTmp.length > 0) {
			this.filas = this.filasTmp
			this.filasTmp = []
		}

		this.valorFiltro.setValor("")
		this.actualizaTabla({ updtFiltro: false })
		return this
	}

	setDetalles(detalles, formatoDetalles = null) {
		this.detalles = detalles
		this.formatoDetalles = formatoDetalles
		return this
	}

	limpiarTitulo(titulo) {
		return titulo.replace(/_/g, " ")
	}

	mostrarDetalles() {
		this.contenedorDetalles.vaciar()
		if (!this.detalles) return this

		this.contenedorDetalles.addHijos(
			Object.keys(this.detalles).map(key => {
				const v =
					this.formatoDetalles && this.formatoDetalles[key]
						? this.formatoDetalles[key](this.detalles[key])
						: this.detalles[key]
				return new MuestraDato()
					.setTxtEtiqueta(`${this.limpiarTitulo(key)}:`)
					.setTxtDato(v)
					.setEstilo1()
					.mostrar()
			})
		)

		return this
	}

	congifuraBotones() {
		const btns = new Botonera().setIDContenedor(TABLA.PARAMETROS)

		if (this.permiteExportar)
			btns.addBoton(TABLA.TXT_BTN_EXPORTAR).setTexto(
				TABLA.TXT_BTN_EXPORTAR,
				TABLA.TXT_BTN_EXPORTAR
			)

		return btns
	}

	tipoDato(valor) {
		if (typeof valor === SYS.NMBR || !isNaN(valor)) return SYS.NMBR
		if (typeof valor === SYS.STRNG) {
			if (this.esFecha(valor)) return SYS.DT
			if (this.esMoneda(valor)) return SYS.MNY
		}
		return SYS.STRNG
	}

	ordenar(e, tabla) {
		const celda = e.target
		const indice = celda.cellIndex
		const filas = Array.from(tabla.rows).slice(1)

		if (celda.classList.contains(TABLA.ORDEN_DESC)) {
			celda.classList.remove(TABLA.ORDEN_DESC)
			filas.sort(this.ordenarDatos(indice))
		} else if (celda.classList.contains(TABLA.ORDEN_ASC)) {
			celda.classList.remove(TABLA.ORDEN_ASC)
			celda.classList.add(TABLA.ORDEN_DESC)
			filas.sort(this.ordenarDatos(indice, -1))
		} else {
			celda.classList.remove(TABLA.ORDEN_DESC)
			celda.classList.add(TABLA.ORDEN_ASC)
			filas.sort(this.ordenarDatos(indice, 1))
		}

		filas.forEach(f => tabla.appendChild(f))

		return this
	}

	ordenarDatos(indice, direccion = 0) {
		return (a, b) => {
			if (direccion === 0) {
				const aID = parseInt(a.id)
				const bID = parseInt(b.id)

				if (aID < bID) return -1
				if (aID > bID) return 1
				return 0
			}

			const aValor = a.cells[indice].innerText
			const bValor = b.cells[indice].innerText

			const aClase = a.cells[indice].classList[1]
			const bClase = b.cells[indice].classList[1]

			if (aClase === SYS.MNY && bClase === SYS.MNY)
				return (this.monedaANumero(aValor) - this.monedaANumero(bValor)) * direccion

			if (aClase === SYS.NMBR && bClase === SYS.NMBR) return (aValor - bValor) * direccion

			if (aClase === SYS.DT && bClase === SYS.DT)
				return (new Date(aValor) - new Date(bValor)) * direccion

			return aValor.localeCompare(bValor) * direccion
		}
	}

	editar(evento) {
		const celda = evento.target
		celda.contentEditable = true
		celda.focus()

		celda.addEventListener("blur", () => {
			celda.contentEditable = false
		})
	}

	esFecha(valor) {
		const expresionesRegulares = [
			/\b\d{1,2}-\d{1,2}-\d{2,4}\b/, // 31-12-2021
			/\b\d{1,2}\/\d{1,2}\/\d{2,4}\b/, // 31/12/2021
			/\b\d{4}-\d{1,2}-\d{1,2}\b/, // 2021-12-31
			/\b\d{4}\/\d{1,2}\/\d{1,2}\b/, // 2021/12/31
			/\b\d{1,2}-\d{1,2}-\d{2,4}\b/, // 31-12-21
			/\b\d{1,2}\/\d{1,2}\/\d{2,4}\b/, // 31/12/21
			/\b\d{1,2}-\d{1,2}-\d{2,4}\b/, // 31-12-2021
			/\b\d{1,2}\/\d{1,2}\/\d{2,4}\b/, // 31/12/2021
		]

		for (const regex of expresionesRegulares) {
			if (regex.test(valor)) return true
		}

		return false
	}

	esMoneda(valor) {
		const regexMoneda = /^\s*([$]?)\s*(\d{1,3}(,\d{3})*(\.\d+)?|\d+(\.\d+)?)\s*$/ // $1,234.56

		return regexMoneda.test(valor)
	}

	monedaANumero(valor) {
		const valorNumerico = valor.replace(/[^\d.]/g, "")
		const numero = parseFloat(valorNumerico)

		return isNaN(numero) ? null : numero
	}
}

const encabezados = [
	"Fecha_Operación",
	"Fecha_Valor",
	"Id_Operación",
	"Tipo_Movimiento",
	"Monto",
	"Descripción_1",
	"Descripción_2",
	"Descripción_3",
]
const filas = [
	[
		"21/8/2023",
		"21/8/2023",
		"Y01",
		"Abono",
		"$224.41",
		"CE23689567010004453418",
		"23689567010004453418",
		"4631880",
	],
	[
		"21/8/2023",
		"21/8/2023",
		"Y01",
		"Abono",
		"$231.63",
		"CE11417855110004341722",
		"8127504645",
		"2518549",
	],
	[
		"21/8/2023",
		"21/8/2023",
		"Y01",
		"Abono",
		"$910.50",
		"CE44183401810004229605",
		"5626566843",
		"0523149",
	],
	[
		"21/8/2023",
		"21/8/2023",
		"Y01",
		"Abono",
		"$1,746.26",
		"CE05947460110003869287",
		"05947460110003869287",
		"2993958",
	],
	[
		"21/8/2023",
		"21/8/2023",
		"Y15",
		"Abono",
		"$550.00",
		"CE16542913310004018244",
		"16542913310004018244",
		"2944997",
	],
	[
		"21/8/2023",
		"21/8/2023",
		"Y01",
		"Abono",
		"$934.34",
		"CE97427270210004513567",
		"8333534141",
		"0366234",
	],
	[
		"21/8/2023",
		"21/8/2023",
		"Y01",
		"Abono",
		"$910.50",
		"CE45222473910004386190",
		"2223472323",
		"3219964",
	],
	[
		"21/8/2023",
		"21/8/2023",
		"Y01",
		"Abono",
		"$1,416.34",
		"CE36755947710004387633",
		"5543152981",
		"4905945",
	],
	[
		"21/8/2023",
		"21/8/2023",
		"Y01",
		"Abono",
		"$1,234.75",
		"CE10737005610004161395",
		"5532624338",
		"3038068",
	],
	[
		"20/8/2023",
		"21/8/2023",
		"Y01",
		"Abono",
		"$464.00",
		"CE02558476710003480207",
		"7771898849",
		"3978414",
	],
	[
		"21/8/2023",
		"21/8/2023",
		"Y01",
		"Abono",
		"$295.73",
		"CE33113577010004354103",
		"5561732768",
		"3096710",
	],
	[
		"21/8/2023",
		"21/8/2023",
		"Y01",
		"Abono",
		"$0.30",
		"CE33113577010004354103",
		"5561732768",
		"3348235",
	],
	[
		"21/8/2023",
		"21/8/2023",
		"Y01",
		"Abono",
		"$450.18",
		"CE92614750010004166305",
		"92614750010004166305",
		"1304842",
	],
	[
		"21/8/2023",
		"21/8/2023",
		"Y01",
		"Abono",
		"$316.00",
		"CE83511552610003478039",
		"83511552610004459841",
		"3164832",
	],
	[
		"21/8/2023",
		"21/8/2023",
		"Y01",
		"Abono",
		"$1,549.06",
		"CE45196376510004039540",
		"100040395",
		"3020281",
	],
	[
		"21/8/2023",
		"21/8/2023",
		"P35",
		"Abono",
		"$21,562.39",
		"LIQUIDACION INTERBANCARIA",
		"07165-20072023-002",
		"DOMICILIACION",
	],
	[
		"21/8/2023",
		"21/8/2023",
		"P17",
		"Abono",
		"$13,891.08",
		"LIQUIDACION DE COBRANZA",
		"07165-20072023-001",
		"DOMICILIACION",
	],
	[
		"21/8/2023",
		"21/8/2023",
		"Y01",
		"Abono",
		"$5,339.00",
		"CE83769323710004278680",
		"PAGO",
		"1341770",
	],
	[
		"21/8/2023",
		"21/8/2023",
		"Y16",
		"Abono",
		"$2,997.12",
		"CI40464616810003085150127",
		"AZTECA    0102326433",
		"1569865 0339246",
	],
	[
		"21/8/2023",
		"21/8/2023",
		"Y16",
		"Abono",
		"$2,990.40",
		"CI41436132910003479863014",
		"SANTANDER 0102435288",
		"1742720 0210723",
	],
	[
		"21/8/2023",
		"21/8/2023",
		"Y01",
		"Abono",
		"$2,772.58",
		"CE38566254910003979386",
		"",
		"4426961",
	],
	[
		"21/8/2023",
		"21/8/2023",
		"Y16",
		"Abono",
		"$2,306.00",
		"CI46679576310004026651058",
		"BANREGIO  0103883291",
		"3329370 0210723",
	],
	[
		"21/8/2023",
		"21/8/2023",
		"Y01",
		"Abono",
		"$2,154.67",
		"CE87688563010004562735",
		"CASH CLICK",
		"4221943",
	],
	[
		"21/8/2023",
		"21/8/2023",
		"Y16",
		"Abono",
		"$1,766.48",
		"CI57706842410004141447058",
		"BANREGIO  0103822017",
		"3286129 0210723",
	],
	[
		"21/8/2023",
		"21/8/2023",
		"Y01",
		"Abono",
		"$1,664.00",
		"CE91272028910004130756",
		"CESAR ALEJANDRO CORDOVA FLORES",
		"4290165",
	],
	[
		"21/8/2023",
		"21/8/2023",
		"Y01",
		"Abono",
		"$1,619.75",
		"CE13130135410004507594",
		"PAGO",
		"2954358",
	],
	[
		"21/8/2023",
		"21/8/2023",
		"Y16",
		"Abono",
		"$1,599.15",
		"CI04263072710004516311072",
		"BANORTE   0103247159",
		"2776455 0230721",
	],
	[
		"21/8/2023",
		"21/8/2023",
		"Y01",
		"Abono",
		"$1,564.01",
		"CE20283378910004274627",
		"PAGO",
		"2171906",
	],
	[
		"21/8/2023",
		"21/8/2023",
		"Y01",
		"Abono",
		"$1,525.86",
		"CE45049384510003510277",
		"8VO Y ULTIMO PAGO CASHCLICK",
		"0569217",
	],
	[
		"21/8/2023",
		"21/8/2023",
		"Y01",
		"Abono",
		"$1,521.17",
		"CE37008679210003692683",
		"PAGO PRESTAMO",
		"2888292",
	],
	[
		"21/8/2023",
		"21/8/2023",
		"Y16",
		"Abono",
		"$1,464.00",
		"CI01592564310004250487014",
		"SANTANDER 0103835373",
		"3296535 0385084",
	],
	[
		"20/8/2023",
		"21/8/2023",
		"Y16",
		"Abono",
		"$1,416.34",
		"CI29580048410004380293127",
		"AZTECA    0100193874",
		"3975983 0339246",
	],
	[
		"21/8/2023",
		"21/8/2023",
		"Y01",
		"Abono",
		"$1,416.34",
		"CE21008059810004629490",
		"GABRIEL GONZALEZ CASHCLICK",
		"1632378",
	],
	[
		"21/8/2023",
		"21/8/2023",
		"Y01",
		"Abono",
		"$1,400.00",
		"CE07523340310004576988",
		"PAGO 28 JUL 23 ELENA DIAZ",
		"4767400",
	],
	[
		"20/8/2023",
		"21/8/2023",
		"Y01",
		"Abono",
		"$1,138.21",
		"CE17605622110003989524",
		"",
		"3996080",
	],
	[
		"20/8/2023",
		"21/8/2023",
		"Y01",
		"Abono",
		"$1,098.00",
		"CE86451175810004332654",
		"JHOSELYN GUADALUPE GARCIA",
		"3972529",
	],
	[
		"21/8/2023",
		"21/8/2023",
		"Y16",
		"Abono",
		"$1,098.00",
		"CI38549321110004379458058",
		"BANREGIO  0100767212",
		"4353019 0210723",
	],
	[
		"21/8/2023",
		"21/8/2023",
		"Y16",
		"Abono",
		"$1,098.00",
		"CI50438137810004100661127",
		"AZTECA    0102540529",
		"1883629 5339246",
	],
	[
		"21/8/2023",
		"21/8/2023",
		"Y01",
		"Abono",
		"$1,098.00",
		"CE78594401510003829222",
		"2407MARCEL",
		"2069530",
	],
	[
		"20/8/2023",
		"21/8/2023",
		"Y01",
		"Abono",
		"$1,045.80",
		"CE04972654210004159309",
		"PAGO",
		"3994892",
	],
	[
		"21/8/2023",
		"21/8/2023",
		"Y01",
		"Abono",
		"$1,010.98",
		"CE30246688210004155466",
		"PAGO",
		"3112747",
	],
	[
		"21/8/2023",
		"21/8/2023",
		"Y16",
		"Abono",
		"$924.00",
		"CI92610865010003985067002",
		"BANAMEX   0100557710",
		"4140895 0210723",
	],
	["20/8/2023", "21/8/2023", "Y01", "Abono", "$911.00", "CE67532162810003842060", "", "3991757"],
	[
		"21/8/2023",
		"21/8/2023",
		"Y16",
		"Abono",
		"$910.50",
		"CI77361221310004271885127",
		"AZTECA    0103877032",
		"3324981 0339246",
	],
	[
		"21/8/2023",
		"21/8/2023",
		"Y16",
		"Abono",
		"$910.50",
		"CI23764475810003483074036",
		"INBURSA   0102697827",
		"2099900 2023072",
	],
	[
		"21/8/2023",
		"21/8/2023",
		"Y16",
		"Abono",
		"$910.16",
		"CI10632166810003986078058",
		"BANREGIO  0100742836",
		"4322494 0210723",
	],
	[
		"21/8/2023",
		"21/8/2023",
		"Y01",
		"Abono",
		"$871.50",
		"CE58936141810004517922",
		"PAGO PRESTAMO",
		"1802570",
	],
	[
		"21/8/2023",
		"21/8/2023",
		"Y16",
		"Abono",
		"$863.85",
		"CI09471681510003949190014",
		"SANTANDER 0100810959",
		"4404653 7588662",
	],
	[
		"21/8/2023",
		"21/8/2023",
		"Y01",
		"Abono",
		"$835.95",
		"CE36796334910004455281",
		"MIRNA YESENIA URIBE RODRIGUEZ",
		"3111911",
	],
	[
		"21/8/2023",
		"21/8/2023",
		"Y16",
		"Abono",
		"$776.25",
		"CI95168850510004586934072",
		"BANORTE   0103573216",
		"3078966 0230721",
	],
	[
		"21/8/2023",
		"21/8/2023",
		"Y16",
		"Abono",
		"$752.00",
		"CI62093866610004024177072",
		"BANORTE   0103362076",
		"2873431 0230721",
	],
	[
		"21/8/2023",
		"21/8/2023",
		"Y01",
		"Abono",
		"$747.46",
		"CE53238798010004513323",
		"PAGO",
		"2267265",
	],
	[
		"21/8/2023",
		"21/8/2023",
		"Y01",
		"Abono",
		"$732.00",
		"CE57784573110004515106",
		"PAGO",
		"4611706",
	],
	[
		"21/8/2023",
		"21/8/2023",
		"Y01",
		"Abono",
		"$732.00",
		"CE16233646010004490567",
		"PAGO PRESTAMO",
		"4997366",
	],
	[
		"21/8/2023",
		"21/8/2023",
		"Y01",
		"Abono",
		"$708.80",
		"CE41393457110003862049",
		"PAGO PRESTAMO",
		"4087677",
	],
	[
		"21/8/2023",
		"21/8/2023",
		"Y16",
		"Abono",
		"$700.27",
		"CI49286758510003953454127",
		"AZTECA    0100583839",
		"4161443 0339246",
	],
	[
		"21/8/2023",
		"21/8/2023",
		"Y01",
		"Abono",
		"$690.12",
		"CE22266632210004595637",
		"PAGO PRESTAMO",
		"4821773",
	],
	[
		"21/8/2023",
		"21/8/2023",
		"Y01",
		"Abono",
		"$678.00",
		"CE18733352310004127850",
		"ABONO",
		"2031689",
	],
	["21/8/2023", "21/8/2023", "Y01", "Abono", "$654.04", "CE64972419310004153525", "", "4902546"],
	[
		"21/8/2023",
		"21/8/2023",
		"Y01",
		"Abono",
		"$624.40",
		"CE95916126410003769568",
		"GENESIS GUERRERO RADILLA",
		"4169550",
	],
	[
		"21/8/2023",
		"21/8/2023",
		"Y01",
		"Abono",
		"$610.01",
		"CE01984749110004469244",
		"PAGO PRESTAMO CASHCLICK",
		"2799929",
	],
	[
		"21/8/2023",
		"21/8/2023",
		"Y01",
		"Abono",
		"$607.00",
		"CE49405775110004255478",
		"CASHCLIK",
		"2354165",
	],
	[
		"21/8/2023",
		"21/8/2023",
		"Y01",
		"Abono",
		"$607.00",
		"CE49591192810004511715",
		"PAGO",
		"1079221",
	],
	[
		"21/8/2023",
		"21/8/2023",
		"Y16",
		"Abono",
		"$607.00",
		"CI44061021910004276534127",
		"AZTECA    0101548477",
		"0409354 0339246",
	],
	[
		"21/8/2023",
		"21/8/2023",
		"Y01",
		"Abono",
		"$573.00",
		"CE20238012010004263760",
		"FLOE MIREYA TORRES",
		"4698155",
	],
	[
		"21/8/2023",
		"21/8/2023",
		"Y16",
		"Abono",
		"$550.00",
		"CI12819605910004287838137",
		"BANCOPPEL 0103318349",
		"2837516 8980993",
	],
	[
		"21/8/2023",
		"21/8/2023",
		"Y16",
		"Abono",
		"$500.00",
		"CI58606970810004521523014",
		"SANTANDER 0102231902",
		"1432640 6666264",
	],
	[
		"21/8/2023",
		"21/8/2023",
		"Y01",
		"Abono",
		"$495.73",
		"CE39244199410004496074",
		"PAGO",
		"0043318",
	],
	[
		"21/8/2023",
		"21/8/2023",
		"Y01",
		"Abono",
		"$487.00",
		"CE91571778110003800132",
		"PAGO",
		"2515425",
	],
	["21/8/2023", "21/8/2023", "Y01", "Abono", "$456.70", "CE31490774810003840434", "", "4156273"],
	[
		"21/8/2023",
		"21/8/2023",
		"Y16",
		"Abono",
		"$444.00",
		"CI64574077810004623669002",
		"BANAMEX   0101175226",
		"4879480 6457407",
	],
	["21/8/2023", "21/8/2023", "Y01", "Abono", "$443.65", "CE29718345110004522917", "", "2930312"],
	[
		"21/8/2023",
		"21/8/2023",
		"Y01",
		"Abono",
		"$405.00",
		"CE41113458410004377530",
		"PAGO JULIO KARLA TELLO",
		"4721893",
	],
	[
		"21/8/2023",
		"21/8/2023",
		"Y16",
		"Abono",
		"$379.00",
		"CI01867926110003736460072",
		"BANORTE   0101304301",
		"0058223 0230721",
	],
	[
		"21/8/2023",
		"21/8/2023",
		"Y01",
		"Abono",
		"$366.00",
		"CE01957192110004632408",
		"ALEJANDRO ALANIS",
		"4896518",
	],
	[
		"21/8/2023",
		"21/8/2023",
		"Y01",
		"Abono",
		"$358.26",
		"CE13578873010004502283",
		"JOEL VIERA ISABELES",
		"3096896",
	],
	["20/8/2023", "21/8/2023", "Y01", "Abono", "$357.78", "CE80717561810004395186", "", "3999292"],
	[
		"21/8/2023",
		"21/8/2023",
		"Y16",
		"Abono",
		"$295.76",
		"CI65824809310004521404021",
		"HSBC      0100533050",
		"4129070 0210723",
	],
	[
		"21/8/2023",
		"21/8/2023",
		"Y01",
		"Abono",
		"$281.00",
		"CE51612186210004145482",
		"PAGO",
		"1496000",
	],
	[
		"21/8/2023",
		"21/8/2023",
		"Y16",
		"Abono",
		"$238.85",
		"CI26651920110004296361072",
		"BANORTE   0100948692",
		"4588474 0230721",
	],
	[
		"21/8/2023",
		"21/8/2023",
		"Y16",
		"Abono",
		"$224.41",
		"CI71701495910004525750036",
		"INBURSA   0100922774",
		"4547741 0332256",
	],
	[
		"21/8/2023",
		"21/8/2023",
		"Y01",
		"Abono",
		"$200.00",
		"CE58333329910002727027",
		"LIZ",
		"2554420",
	],
	[
		"21/8/2023",
		"21/8/2023",
		"Y16",
		"Abono",
		"$155.68",
		"CI57706842410004141447058",
		"BANREGIO  0103837159",
		"3297382 0210723",
	],
	[
		"21/8/2023",
		"21/8/2023",
		"Y16",
		"Abono",
		"$150.00",
		"CI18935416010004101035072",
		"BANORTE   0101130086",
		"4812082 0230721",
	],
	[
		"21/8/2023",
		"21/8/2023",
		"Y01",
		"Abono",
		"$5.00",
		"CE87688563010004562735",
		"CASH CLICK",
		"4278923",
	],
	[
		"21/8/2023",
		"21/8/2023",
		"T17",
		"Cargo",
		"$250,000.00",
		"SPEI ENVIADO STP",
		"0230721TRF 055 002",
		"0000657714  646",
	],
	[
		"21/8/2023",
		"21/8/2023",
		"W34",
		"Cargo",
		"$39.04",
		"IVA COM.DOMICILIACION",
		"16% 07165 200723",
		"SICOCO",
	],
	[
		"21/8/2023",
		"21/8/2023",
		"W34",
		"Cargo",
		"$85.44",
		"IVA COM.DOMICILIACION",
		"16% 07165 200723",
		"SICOCO",
	],
	[
		"21/8/2023",
		"21/8/2023",
		"W33",
		"Cargo",
		"$244.00",
		"COMISION DOMICILIACION",
		"07165 200723",
		"SICOCO",
	],
	[
		"21/8/2023",
		"21/8/2023",
		"W33",
		"Cargo",
		"$534.00",
		"COMISION DOMICILIACION",
		"07165 200723",
		"SICOCO",
	],
	[
		"21/8/2023",
		"21/8/2023",
		"W41",
		"Cargo",
		"$20,000.00",
		"TRASPASO ENTRE CUENTAS",
		"TRF 055 322",
		"REFBNTC00567817",
	],
]

export default TablaDatos
