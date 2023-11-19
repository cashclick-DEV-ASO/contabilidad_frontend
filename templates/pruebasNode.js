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

// console.log(crearArchivos(vistas))

const lista = [
	{
		vista: 'import Cartera from "./cartera.js"',
		controlador: 'export { CarteraCtrl } from "./carteraCtrl.js"',
		modelo: 'export { CarteraMdl } from "./carteraMdl.js"',
		estilos: '@import url("./cartera.css");',
	},
	{
		vista: 'import Conciliación from "./conciliación.js"',
		controlador: 'export { ConciliaciónCtrl } from "./conciliaciónCtrl.js"',
		modelo: 'export { ConciliaciónMdl } from "./conciliaciónMdl.js"',
		estilos: '@import url("./conciliación.css");',
	},
	{
		vista: 'import Conciliar from "./conciliar.js"',
		controlador: 'export { ConciliarCtrl } from "./conciliarCtrl.js"',
		modelo: 'export { ConciliarMdl } from "./conciliarMdl.js"',
		estilos: '@import url("./conciliar.css");',
	},
	{
		vista: 'import ConCtasBancarias from "./conCtasBancarias.js"',
		controlador: 'export { ConCtasBancariasCtrl } from "./conCtasBancariasCtrl.js"',
		modelo: 'export { ConCtasBancariasMdl } from "./conCtasBancariasMdl.js"',
		estilos: '@import url("./conCtasBancarias.css");',
	},
	{
		vista: 'import ConCtasContables from "./conCtasContables.js"',
		controlador: 'export { ConCtasContablesCtrl } from "./conCtasContablesCtrl.js"',
		modelo: 'export { ConCtasContablesMdl } from "./conCtasContablesMdl.js"',
		estilos: '@import url("./conCtasContables.css");',
	},
	{
		vista: 'import ConSaldos from "./conSaldos.js"',
		controlador: 'export { ConSaldosCtrl } from "./conSaldosCtrl.js"',
		modelo: 'export { ConSaldosMdl } from "./conSaldosMdl.js"',
		estilos: '@import url("./conSaldos.css");',
	},
	{
		vista: 'import ConTrnBancos from "./conTrnBancos.js"',
		controlador: 'export { ConTrnBancosCtrl } from "./conTrnBancosCtrl.js"',
		modelo: 'export { ConTrnBancosMdl } from "./conTrnBancosMdl.js"',
		estilos: '@import url("./conTrnBancos.css");',
	},
	{
		vista: 'import ConTrnMambu from "./conTrnMambu.js"',
		controlador: 'export { ConTrnMambuCtrl } from "./conTrnMambuCtrl.js"',
		modelo: 'export { ConTrnMambuMdl } from "./conTrnMambuMdl.js"',
		estilos: '@import url("./conTrnMambu.css");',
	},
	{
		vista: 'import EdoCta from "./edoCta.js"',
		controlador: 'export { EdoCtaCtrl } from "./edoCtaCtrl.js"',
		modelo: 'export { EdoCtaMdl } from "./edoCtaMdl.js"',
		estilos: '@import url("./edoCta.css");',
	},
	{
		vista: 'import Etiquetas from "./etiquetas.js"',
		controlador: 'export { EtiquetasCtrl } from "./etiquetasCtrl.js"',
		modelo: 'export { EtiquetasMdl } from "./etiquetasMdl.js"',
		estilos: '@import url("./etiquetas.css");',
	},
	{
		vista: 'import NoConciliado from "./noConciliado.js"',
		controlador: 'export { NoConciliadoCtrl } from "./noConciliadoCtrl.js"',
		modelo: 'export { NoConciliadoMdl } from "./noConciliadoMdl.js"',
		estilos: '@import url("./noConciliado.css");',
	},
	{
		vista: 'import RecalculoCapital from "./recalculoCapital.js"',
		controlador: 'export { RecalculoCapitalCtrl } from "./recalculoCapitalCtrl.js"',
		modelo: 'export { RecalculoCapitalMdl } from "./recalculoCapitalMdl.js"',
		estilos: '@import url("./recalculoCapital.css");',
	},
	{
		vista: 'import RecalculoInteres from "./recalculoInteres.js"',
		controlador: 'export { RecalculoInteresCtrl } from "./recalculoInteresCtrl.js"',
		modelo: 'export { RecalculoInteresMdl } from "./recalculoInteresMdl.js"',
		estilos: '@import url("./recalculoInteres.css");',
	},
	{
		vista: 'import RegCtasBancarias from "./regCtasBancarias.js"',
		controlador: 'export { RegCtasBancariasCtrl } from "./regCtasBancariasCtrl.js"',
		modelo: 'export { RegCtasBancariasMdl } from "./regCtasBancariasMdl.js"',
		estilos: '@import url("./regCtasBancarias.css");',
	},
	{
		vista: 'import RegCtasContables from "./regCtasContables.js"',
		controlador: 'export { RegCtasContablesCtrl } from "./regCtasContablesCtrl.js"',
		modelo: 'export { RegCtasContablesMdl } from "./regCtasContablesMdl.js"',
		estilos: '@import url("./regCtasContables.css");',
	},
	{
		vista: 'import RegSaldos from "./regSaldos.js"',
		controlador: 'export { RegSaldosCtrl } from "./regSaldosCtrl.js"',
		modelo: 'export { RegSaldosMdl } from "./regSaldosMdl.js"',
		estilos: '@import url("./regSaldos.css");',
	},
	{
		vista: 'import RegTrnMambu from "./regTrnMambu.js"',
		controlador: 'export { RegTrnMambuCtrl } from "./regTrnMambuCtrl.js"',
		modelo: 'export { RegTrnMambuMdl } from "./regTrnMambuMdl.js"',
		estilos: '@import url("./regTrnMambu.css");',
	},
	{
		vista: 'import ResConciliacion from "./resConciliacion.js"',
		controlador: 'export { ResConciliacionCtrl } from "./resConciliacionCtrl.js"',
		modelo: 'export { ResConciliacionMdl } from "./resConciliacionMdl.js"',
		estilos: '@import url("./resConciliacion.css");',
	},
	{
		vista: 'import SaldoFavor from "./saldoFavor.js"',
		controlador: 'export { SaldoFavorCtrl } from "./saldoFavorCtrl.js"',
		modelo: 'export { SaldoFavorMdl } from "./saldoFavorMdl.js"',
		estilos: '@import url("./saldoFavor.css");',
	},
	{
		vista: 'import TrnDWH from "./trnDWH.js"',
		controlador: 'export { TrnDWHCtrl } from "./trnDWHCtrl.js"',
		modelo: 'export { TrnDWHMdl } from "./trnDWHMdl.js"',
		estilos: '@import url("./trnDWH.css");',
	},
	{
		vista: 'import Variables from "./variables.js"',
		controlador: 'export { VariablesCtrl } from "./variablesCtrl.js"',
		modelo: 'export { VariablesMdl } from "./variablesMdl.js"',
		estilos: '@import url("./variables.css");',
	},
]

const obtenerListaImports = (lista, key) => {
	return lista.map(imports => {
		return imports[key]
	})
}

console.log(obtenerListaImports(lista, "controlador").join("\n"))
