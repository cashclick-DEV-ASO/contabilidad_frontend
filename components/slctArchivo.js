import { Componente } from "./componentes.js"

import { SYS, SLCTARCHIVO } from "../src/constantes.js"

export class SlctArchivo extends Componente {
	constructor({ formato = ".txt", multiple = false } = {}) {
		super(SYS.SCTN, { clase: SLCTARCHIVO.CONTENEDOR })
		this.formato = formato
		this.multiple = multiple
		this.ruta = null
		this.mensaje = SLCTARCHIVO.MSJINICIAL

		return this.inicia()
	}

	inicia() {
		this.titulo = new Componente(SYS.LBL, { id: SLCTARCHIVO.TITULO })
		this.lblArchivo = new Componente(SYS.LBL, { id: SLCTARCHIVO.LBLARCHIVO })
		this.lblRuta = new Componente(SYS.LBL, { id: SLCTARCHIVO.LBLRUTA })
		this.archivo = new Componente(SYS.IN, { id: SLCTARCHIVO.INARCHIVO })
		this.btnAbrir = new Componente(SYS.BTN, { id: SLCTARCHIVO.BTNABRIR })
		return this
	}

	configura() {
		this.titulo.setTexto(SLCTARCHIVO.TXTTITULO)
		this.lblRuta.setTexto(this.mensaje)

		this.lblArchivo.setTexto(SLCTARCHIVO.TXTARCHIVO)
		this.lblArchivo.setPropiedad("htmlFor", this.archivo.getID())
		this.lblArchivo.setClase(SYS.DSBL)

		this.archivo.setListener(SYS.CHNG, () => {
			if (this.formato.length === 0) {
				this.lblRuta.setTexto(SLCTARCHIVO.MSJ_SIN_FORMATO)
				this.btnAbrir.habilitar(false)
				this.lblArchivo.setClase(SYS.DSBL)
				return
			}

			this.ruta = this.validarArchivo(this.archivo.getComponente().files[0], this.formato)
			if (this.ruta) {
				this.lblRuta.setTexto(this.ruta.name)
				this.btnAbrir.habilitar(true)
				return
			}
			this.lblRuta.setTexto(SLCTARCHIVO.MSJ_ERROR_FORMATO)
			this.btnAbrir.habilitar(false)
		})

		this.archivo.setPropiedad("accept", this.formato)
		this.archivo.setPropiedad("type", "file")
		this.archivo.setPropiedad("required", true)
		this.archivo.setPropiedad("multiple", this.multiple)
		this.archivo.habilitar(false)

		this.btnAbrir.setTexto(SLCTARCHIVO.TXTABRIR)
		this.btnAbrir.habilitar(false)
		return this
	}

	crear() {
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
		return this.configura().crear().getComponente()
	}

	accionAbrir(accion) {
		const listener = e => {
			if (this.ruta) return accion(e)
			this.lblRuta.setTexto(SLCTARCHIVO.MSJ_ERROR_ARCHIVO)
		}

		this.btnAbrir.setListener(SYS.CLK, listener)
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
		if (typeof formato === SYS.STRNG) formato = [formato]

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
}

export default SlctArchivo
