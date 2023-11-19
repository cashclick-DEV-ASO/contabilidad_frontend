const vistas = [
	// "Aclaraciones",
	// "Ajustes",
	"Cartera",
	"Conciliación",
	"Conciliar",
	"ConCtasBancarias",
	"ConCtasContables",
	"ConSaldos",
	"ConTrnBancos",
	"ConTrnMambu",
	"EdoCta",
	"Etiquetas",
	"NoConciliado",
	"RecalculoCapital",
	"RecalculoInteres",
	"RegCtasBancarias",
	"RegCtasContables",
	"RegSaldos",
	"RegTrnMambu",
	"ResConciliacion",
	"SaldoFavor",
	"TrnDWH",
	"Variables",
]

import { readFileSync, writeFileSync } from "fs"
import { join, resolve } from "path"

const crearArchivos = nombresVistas => {
	const imports = []
	const __dirname = resolve()

	nombresVistas.forEach(nombre => {
		const nombreMinuscula = nombre.charAt(0).toLowerCase() + nombre.slice(1)
		const nombreCtrl = nombre + "Ctrl"
		const nombreMdl = nombre + "Mdl"

		const archivos = [
			{ origen: "../templates/vista.js", destino: `../views/${nombreMinuscula}.js` },
			{
				origen: "../templates/controlador.js",
				destino: `../controllers/${nombreMinuscula}Ctrl.js`,
			},
			{ origen: "../templates/modelo.js", destino: `../models/${nombreMinuscula}Mdl.js` },
			{ origen: "../templates/estilos.css", destino: `../styles/${nombreMinuscula}.css` },
		]

		archivos.forEach(archivo => {
			// Leer el contenido del archivo de origen
			const contenido = readFileSync(join(__dirname, archivo.origen), "utf-8")

			// Sustituir cadenas de texto en el contenido
			const contenidoModificado = contenido
				.replace(/NombreVista/g, nombre)
				.replace(/NombreControlador/g, nombreCtrl)
				.replace(/NombreModelo/g, nombreMdl)

			// Escribir el contenido modificado en el archivo de destino
			writeFileSync(join(__dirname, archivo.destino), contenidoModificado)

			// Crear los imports para el archivo
			if (
				!imports.some(
					importObj =>
						importObj.vista === `import ${nombre} from "./${nombreMinuscula}.js"`
				)
			) {
				imports.push({
					vista: `import ${nombre} from "./${nombreMinuscula}.js"`,
					controlador: `export { ${nombreCtrl} } from "./${nombreMinuscula}Ctrl.js"`,
					modelo: `export { ${nombreMdl} } from "./${nombreMinuscula}Mdl.js"`,
					estilos: `@import url("./${nombreMinuscula}.css");`,
				})
			}
		})
	})

	return imports
}

console.log(crearArchivos(vistas))

const lista = [
	{
		vista: 'import Aclaraciones from "./aclaraciones.js"',
		controlador: 'export { AclaracionesCtrl } from "./aclaracionesCtrl.js"',
		modelo: 'export { AclaracionesMdl } from "./aclaracionesMdl.js"',
		estilos: '@import url("./aclaraciones.css");"',
	},
	{
		vista: 'import Ajustes from "./ajustes.js"',
		controlador: 'export { AjustesCtrl } from "./ajustesCtrl.js"',
		modelo: 'export { AjustesMdl } from "./ajustesMdl.js"',
		estilos: '@import url("./ajustes.css");"',
	},
]

const obtenerListaImports = (lista, key) => {
	return lista.map(imports => {
		return imports[key]
	})
}

// console.log(obtenerListaImports(lista, "vista").join("\n"))
