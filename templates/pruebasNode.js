const RUTAS = {
	inicio: {
		visible: true,
		titulo: "Inicio",
		vista: "Inicio",
	},
	transacciones: {
		visible: true,
		titulo: "Transacciones",
		vista: {
			saldos: {
				visible: true,
				titulo: "Saldos Contables",
				vista: {
					registro: {
						visible: true,
						titulo: "Registro",
						vista: "RegSaldos",
					},
					consulta: {
						visible: true,
						titulo: "Consulta",
						vista: "ConSaldos",
					},
				},
			},
			bancos: {
				visible: true,
				titulo: "Bancos",
				vista: {
					registro: {
						visible: true,
						titulo: "Registro",
						vista: "RegTrnBancos",
					},
					consulta: {
						visible: true,
						titulo: "Consulta",
						vista: "ConTrnBancos",
					},
				},
			},
			dwh: {
				visible: true,
				titulo: "DWH",
				vista: "TrnDWH",
			},
			mambu: {
				visible: true,
				titulo: "Mambu",
				vista: {
					registro: {
						visible: true,
						titulo: "Registro",
						vista: "RegTrnBancos",
					},
					consulta: {
						visible: true,
						titulo: "Consulta",
						vista: "ConTrnBancos",
					},
				},
			},
		},
	},
	conciliacion: {
		visible: true,
		titulo: "Conciliación",
		vista: {
			conciliar: {
				visible: true,
				titulo: "Conciliar",
				vista: "Conciliar",
			},
			consulta: {
				visible: true,
				titulo: "Consulta",
				vista: "Conciliación",
			},
			noConciliado: {
				visible: true,
				titulo: "No Conciliado",
				vista: "NoConciliado",
			},
		},
	},
	reportes: {
		visible: true,
		titulo: "Reportes",
		vista: {
			resConciliacion: {
				visible: true,
				titulo: "Resumen Conciliación",
				vista: "ResConciliacion",
			},
			saf: {
				visible: true,
				titulo: "Saldo a Favor",
				vista: "SaldoFavor",
			},
			recalculoInteres: {
				visible: true,
				titulo: "Recalculo de Interés",
				vista: "RecalculoInteres",
			},
			recalculoCapital: {
				visible: true,
				titulo: "Recalculo de Capital",
				vista: "RecalculoCapital",
			},
			cartera: {
				visible: true,
				titulo: "Cartera",
				vista: "Cartera",
			},
			aclaraciones: {
				visible: true,
				titulo: "Aclaraciones",
				vista: "Aclaraciones",
			},
			ajustes: {
				visible: true,
				titulo: "Ajustes",
				vista: "Ajustes",
			},
			edoCta: {
				visible: true,
				titulo: "Estado de Cuenta",
				vista: "EdoCta",
			},
		},
	},
	administracion: {
		visible: true,
		titulo: "Administración",
		vista: {
			cuentasBancarias: {
				visible: true,
				titulo: "Cuentas Bancarias",
				vista: {
					registro: {
						visible: true,
						titulo: "Registro",
						vista: "RegCtasBancarias",
					},
					consulta: {
						visible: true,
						titulo: "Consulta",
						vista: "ConCtasBancarias",
					},
				},
			},
			cuentasContables: {
				visible: true,
				titulo: "Cuentas Contables",
				vista: {
					registro: {
						visible: true,
						titulo: "Registro",
						vista: "RegCtasContables",
					},
					consulta: {
						visible: true,
						titulo: "Consulta",
						vista: "ConCtasContables",
					},
				},
			},
			plantillas: {
				visible: true,
				titulo: "Plantillas",
				vista: {
					layout: {
						visible: true,
						titulo: "Layout",
						vista: "Layout",
					},
					Etiquetas: {
						visible: true,
						titulo: "Etiquetas",
						vista: "Etiquetas",
					},
				},
			},
			variables: {
				visible: true,
				titulo: "Variables",
				vista: "Variables",
			},
		},
	},
	logout: {
		visible: true,
		titulo: "Salir",
		vista: "Logout",
	},
}

const registros = [
	{
		id: 1,
		grupo: "inicio",
		titulo: "Inicio",
		vista: "Inicio",
		padre: null,
		orden: 0,
	},
	{
		id: 2,
		grupo: "transacciones",
		titulo: "Transacciones",
		vista: null,
		padre: null,
		orden: 1,
	},
	{
		id: 13,
		grupo: "conciliacion",
		titulo: "Conciliación",
		vista: null,
		padre: null,
		orden: 2,
	},
	{
		id: 17,
		grupo: "reportes",
		titulo: "Reportes",
		vista: null,
		padre: null,
		orden: 3,
	},
	{
		id: 26,
		grupo: "administracion",
		titulo: "Administración",
		vista: null,
		padre: null,
		orden: 4,
	},
	{
		id: 37,
		grupo: "logout",
		titulo: "Salir",
		vista: "Logout",
		padre: null,
		orden: 5,
	},
	{
		id: 27,
		grupo: "cuentasBancarias",
		titulo: "Cuentas Bancarias",
		vista: null,
		padre: "Administración",
		orden: 0,
	},
	{
		id: 30,
		grupo: "cuentasContables",
		titulo: "Cuentas Contables",
		vista: null,
		padre: "Administración",
		orden: 1,
	},
	{
		id: 33,
		grupo: "plantillas",
		titulo: "Plantillas",
		vista: null,
		padre: "Administración",
		orden: 2,
	},
	{
		id: 36,
		grupo: "variables",
		titulo: "Variables",
		vista: "Variables",
		padre: "Administración",
		orden: 3,
	},
	{
		id: 7,
		grupo: "registro",
		titulo: "Registro",
		vista: "RegTrnBancos",
		padre: "Bancos",
		orden: 0,
	},
	{
		id: 8,
		grupo: "consulta",
		titulo: "Consulta",
		vista: "ConTrnBancos",
		padre: "Bancos",
		orden: 1,
	},
	{
		id: 14,
		grupo: "conciliar",
		titulo: "Conciliar",
		vista: "Conciliar",
		padre: "Conciliación",
		orden: 0,
	},
	{
		id: 15,
		grupo: "consulta",
		titulo: "Consulta",
		vista: "Conciliación",
		padre: "Conciliación",
		orden: 1,
	},
	{
		id: 16,
		grupo: "noConciliado",
		titulo: "No Conciliado",
		vista: "NoConciliado",
		padre: "Conciliación",
		orden: 2,
	},
	{
		id: 28,
		grupo: "registro",
		titulo: "Registro",
		vista: "RegCtasBancarias",
		padre: "Cuentas Bancarias",
		orden: 0,
	},
	{
		id: 29,
		grupo: "consulta",
		titulo: "Consulta",
		vista: "ConCtasBancarias",
		padre: "Cuentas Bancarias",
		orden: 1,
	},
	{
		id: 31,
		grupo: "registro",
		titulo: "Registro",
		vista: "RegCtasContables",
		padre: "Cuentas Contables",
		orden: 0,
	},
	{
		id: 32,
		grupo: "consulta",
		titulo: "Consulta",
		vista: "ConCtasContables",
		padre: "Cuentas Contables",
		orden: 1,
	},
	{
		id: 12,
		grupo: "consulta",
		titulo: "Consulta",
		vista: "ConTrnMambu",
		padre: "Mambu",
		orden: 1,
	},
	{
		id: 34,
		grupo: "layout",
		titulo: "Layout",
		vista: "Layout",
		padre: "Plantillas",
		orden: 0,
	},
	{
		id: 35,
		grupo: "Etiquetas",
		titulo: "Etiquetas",
		vista: "Etiquetas",
		padre: "Plantillas",
		orden: 1,
	},
	{
		id: 18,
		grupo: "resConciliacion",
		titulo: "Resumen Conciliación",
		vista: "ResConciliacion",
		padre: "Reportes",
		orden: 0,
	},
	{
		id: 19,
		grupo: "saf",
		titulo: "Saldo a Favor",
		vista: "SaldoFavor",
		padre: "Reportes",
		orden: 1,
	},
	{
		id: 20,
		grupo: "recalculoInteres",
		titulo: "Recalculo de Interés",
		vista: "RecalculoInteres",
		padre: "Reportes",
		orden: 2,
	},
	{
		id: 21,
		grupo: "recalculoCapital",
		titulo: "Recalculo de Capital",
		vista: "RecalculoCapital",
		padre: "Reportes",
		orden: 3,
	},
	{
		id: 22,
		grupo: "cartera",
		titulo: "Cartera",
		vista: "Cartera",
		padre: "Reportes",
		orden: 4,
	},
	{
		id: 23,
		grupo: "aclaraciones",
		titulo: "Aclaraciones",
		vista: "Aclaraciones",
		padre: "Reportes",
		orden: 5,
	},
	{
		id: 24,
		grupo: "ajustes",
		titulo: "Ajustes",
		vista: "Ajustes",
		padre: "Reportes",
		orden: 6,
	},
	{
		id: 25,
		grupo: "edoCta",
		titulo: "Estado de Cuenta",
		vista: "EdoCta",
		padre: "Reportes",
		orden: 7,
	},
	{
		id: 4,
		grupo: "registro",
		titulo: "Registro",
		vista: "RegSaldos",
		padre: "Saldos Contables",
		orden: 0,
	},
	{
		id: 5,
		grupo: "consulta",
		titulo: "Consulta",
		vista: "ConSaldos",
		padre: "Saldos Contables",
		orden: 1,
	},
	{
		id: 3,
		grupo: "saldos",
		titulo: "Saldos Contables",
		vista: null,
		padre: "Transacciones",
		orden: 0,
	},
	{
		id: 6,
		grupo: "bancos",
		titulo: "Bancos",
		vista: null,
		padre: "Transacciones",
		orden: 1,
	},
	{
		id: 9,
		grupo: "dwh",
		titulo: "DWH",
		vista: "TrnDWH",
		padre: "Transacciones",
		orden: 2,
	},
	{
		id: 11,
		grupo: "registro",
		titulo: "Registro",
		vista: "RegTrnMambu",
		padre: "Mambu",
		orden: 0,
	},
	{
		id: 10,
		grupo: "mambu",
		titulo: "Mambu",
		vista: null,
		padre: "Transacciones",
		orden: 3,
	},
]

const construirMapa = (registros, padre = "") => {
	const resultado = {}
	registros.forEach(registro => {
		const padreR = registro.padre ?? ""

		if (padreR.toLowerCase() == padre) {
			resultado[registro.grupo] = {
				titulo: registro.titulo,
				vista:
					registro.vista ??
					construirMapa(registros, registro.grupo.toLowerCase()),
			}
		}
	})

	return resultado
}

const resultado = construirMapa(registros)
console.log(resultado)
