import { Componente } from "./componentes.js"

import { SYS, SLCTARCHIVO } from "../src/constantes.js"

export class SolicitaArchivo extends Componente {
	constructor({ formato = ".txt", multiple = false } = {}) {
		super(SYS.SCTN, { clase: SLCTARCHIVO.CONTENEDOR })
		this.formato = formato
		this.multiple = multiple
		this.ruta = null
		this.mensaje = SLCTARCHIVO.MSJINICIAL

		return this.inicia()
	}

	inicia() {
		this.titulo = new Componente(SYS.LBL, { clase: SLCTARCHIVO.TITULO }).setTexto(
			SLCTARCHIVO.TXTTITULO
		)

		this.lblArchivo = new Componente(SYS.LBL, { clase: SLCTARCHIVO.LBLARCHIVO })
			.setTexto(SLCTARCHIVO.TXTARCHIVO)
			.setPropiedad("htmlFor", SLCTARCHIVO.INARCHIVO)
			.setClase(SYS.DSBL)

		this.lblRuta = new Componente(SYS.LBL, { clase: SLCTARCHIVO.LBLRUTA }).setTexto(
			this.mensaje
		)

		this.archivo = new Componente(SYS.IN, {
			clase: SLCTARCHIVO.INARCHIVO,
			id: SLCTARCHIVO.INARCHIVO,
		})
			.setPropiedad("accept", this.formato)
			.setPropiedad("type", "file")
			.setPropiedad("required", true)
			.setPropiedad("multiple", this.multiple)
			.habilitar(false)

		this.btnAbrir = new Componente(SYS.BTN, { clase: SLCTARCHIVO.BTNABRIR })
			.setTexto(SLCTARCHIVO.TXTABRIR)
			.habilitar(false)

		return this
	}

	configura() {
		this.addHijos([
			this.titulo.getComponente(),
			this.lblRuta.getComponente(),
			this.lblArchivo.getComponente(),
			this.archivo.getComponente(),
			this.btnAbrir.getComponente(),
		])
		return this
	}

	mostrar() {
		return this.configura().getComponente()
	}

	accionAbrir(accion) {
		const listener = e => {
			if (this.ruta) return accion(e)
			this.lblRuta.setTexto(SLCTARCHIVO.MSJ_ERROR_ARCHIVO)
		}

		this.btnAbrir.setListener(SYS.CLK, listener)
		return this
	}

	accionSeleccionar(accionOK = null, accionError = null) {
		const listener = e => {
			if (this.formato.length === 0) {
				this.lblRuta.setTexto(SLCTARCHIVO.MSJ_SIN_FORMATO)
				this.btnAbrir.habilitar(false)
				this.lblArchivo.setClase(SYS.DSBL)
				return
			}

			if (this.archivo.getComponente().files.length === 0) return

			this.ruta = this.validarArchivo(this.archivo.getComponente().files[0], this.formato)
			if (this.ruta) {
				this.lblRuta.setTexto(this.ruta.name)
				this.btnAbrir.habilitar(true)

				if (accionOK) accionOK(e)
				return
			}

			this.lblRuta.setTexto(SLCTARCHIVO.MSJ_ERROR_FORMATO)
			this.btnAbrir.habilitar(false)
			if (accionError) accionError(e)
		}

		this.archivo.setListener(SYS.CHNG, listener)
		return this
	}

	validarArchivo(archivo, formatos) {
		if (!archivo) return null

		const extension = archivo.name.split(".").pop()
		const formatosValidos = formatos.split(",").map(formato => formato.replace(".", "").trim())

		return formatosValidos.includes(extension) ? archivo : null
	}

	setFormato(formato = []) {
		if (!formato) return this
		if (typeof formato === SYS.STRNG)
			formato = formato.includes(",") ? formato.split(",") : [formato]

		this.formato = formato
			.map(formato => {
				if (formato[0] !== ".") formato = "." + formato
				return `${formato}`
			})
			.join(",")

		this.archivo.setPropiedad("accept", this.formato)
		return this
	}

	habilitaSelector() {
		this.archivo.habilitar(true)
		this.lblArchivo.removeClase(SYS.DSBL)
		return this
	}

	limpiar() {
		this.archivo.habilitar(false)
		this.lblArchivo.setClase(SYS.DSBL)
		this.archivo.getComponente().value = ""
		this.lblRuta.setTexto(this.mensaje)
		this.btnAbrir.habilitar(false)
		return this
	}

	setMensaje(mensaje) {
		this.mensaje = mensaje
		this.lblRuta.setTexto(this.mensaje)
		return this
	}

	getArchivo() {
		return this.archivo.getComponente().files[0]
	}
}

export default SolicitaArchivo
