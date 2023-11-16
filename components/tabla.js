import { Componente, ListaDesplegable } from "./componentes.js"

export class Tabla extends Componente {
	constructor(filtro = true) {
		super("section", { clase: "tablaDatos" })
		this.encabezados = []
		this.filas = []
		this.mostrarFiltro = filtro
		this.detalles = null

		return this.inicia()
	}

	inicia() {
		this.controles = new Componente("section", { clase: "controles" })
		this.lblColFiltro = new Componente("label", {
			clase: "lblConcepto parametros",
		})
		this.selColFiltro = new ListaDesplegable()
		this.lblFiltro = new Componente("label", {
			clase: "lblFiltro parametros",
		})
		this.txtFiltro = new Componente("input", {
			clase: "txtFiltro parametros",
		})
		this.btnFiltro = new Componente("button", {
			clase: "btnFiltro parametros",
		})
		this.btnLimpiar = new Componente("button", {
			clase: "btnLimpiar parametros",
		})
		this.btnExportar = new Componente("button", {
			clase: "btnExportar parametros",
		})
		this.contenedorDetalles = new Componente("section", {
			clase: "contenedorDetalles",
		})
		this.contenedor = new Componente("section", {
			clase: "contenedorTabla",
		})
		this.tablaSinDatos()
		return this
	}

	configura() {
		this.lblColFiltro.setTexto("Concepto")

		this.selColFiltro.setClase("selConcepto parametros")

		this.lblFiltro.setTexto("Filtro")
		this.btnFiltro.setTexto("Filtrar")
		this.btnLimpiar.setTexto("Limpiar")
		this.btnExportar.setTexto("Exportar")
		return this
	}

	crear() {
		this.addHijos([
			this.filtro
				? this.controles
						.addHijos([
							this.lblColFiltro.getComponente(),
							this.selColFiltro.mostrar(),
							this.lblFiltro.getComponente(),
							this.txtFiltro.getComponente(),
							this.btnFiltro.getComponente(),
							this.btnLimpiar.getComponente(),
							this.btnExportar.getComponente(),
						])
						.getComponente()
				: null,
			this.contenedorDetalles.getComponente(),
			this.contenedor.addHijo(this.tabla.getComponente()).getComponente(),
		])
		return this
	}

	mostrar() {
		return this.configura().crear().getComponente()
	}

	parseaJSON(datos = [], titulos = null, formatoEspecial = null) {
		this.encabezados = []
		this.filas = []

		if (!datos || typeof datos !== "object" || datos.length === 0) return this

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

	contruirTabla(encabezados = this.encabezados, filas = this.filas) {
		this.tabla = new Componente("table", { id: "tabla" })
		const tblEncabezdos = new Componente("thead", {
			clase: "tblEncabezados",
		})
		const tblCuerpo = new Componente("tbody", { clase: "tblCuerpo" })

		tblEncabezdos.addHijo(
			new Componente("tr", { clase: "filaEncabezados" })
				.addHijos(
					encabezados.map(e =>
						new Componente("th", { clase: "celdaEncabezado" })
							.setTexto(this.limpiarTitulo(e))
							.getComponente()
					)
				)
				.getComponente()
		)

		tblCuerpo.addHijos(
			filas.map(f => {
				const fila = new Componente("tr", { clase: "fila" })
				fila.addHijos(
					f.map(c => new Componente("td", { clase: "celda" }).setTexto(c).getComponente())
				)
				return fila.getComponente()
			})
		)

		this.tabla.addHijos([tblEncabezdos.getComponente(), tblCuerpo.getComponente()])

		return this
	}

	tablaSinDatos() {
		this.tabla = new Componente("div", { clase: "tablaSinDatos" })
		this.tabla.setTexto("No hay datos para mostrar")
		this.tabla.setPropiedad(
			"style",
			"width: 100%;height: 100%;text-align: center;font-weight: bold;inset: 0px;margin: auto;display: flex;align-items: center;justify-content: center;user-select: none;"
		)

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

	actualizaTabla() {
		this.tabla.removeComponente()
		if (this.filas.length == 0) this.tablaSinDatos()
		else this.contruirTabla()

		this.mostrarDetalles()
		this.contenedor.addHijo(this.tabla.getComponente())
		const colFiltro = this.encabezados.map((titulo, indice) => {
			return { valor: indice, texto: this.limpiarTitulo(titulo) }
		})
		this.selColFiltro.actulizaOpciones(colFiltro)

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

	modificaFila(fila, indice) {
		this.filas[indice] = fila
		return this
	}

	filtrar() {
		const col = this.selColFiltro.getValor()
		const filtro = this.txtFiltro.getValor()
		const filasFiltradas = this.filas.filter(f => f[col].includes(filtro))
		this.contruirTabla(this.encabezados, filasFiltradas)
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
		Object.keys(this.detalles).forEach(key => {
			const contenedor = new Componente("div", {
				clase: "contenedorDetalle",
			})

			const lblTitulo = new Componente("label", {
				clase: "lblDetalleTitulo",
			})
			const lblValor = new Componente("label", {
				clase: "lblDetalleValor",
			})

			const valor =
				this.formatoDetalles && this.formatoDetalles[key]
					? this.formatoDetalles[key](this.detalles[key])
					: this.detalles[key]

			lblTitulo.setTexto(`${this.limpiarTitulo(key)}:`)
			lblValor.setTexto(valor)

			this.contenedorDetalles.addHijo(
				contenedor
					.addHijos([lblTitulo.getComponente(), lblValor.getComponente()])
					.getComponente()
			)
		})
		return this
	}
}

export default Tabla
