// Nombre de galletas
export const URL_API = "API_URL"
export const DEV_MODE = "DEV_MODE"
export const RUTAS = "RUTAS"

// Recurrentes del sistema
export const SYS = {
	LI: "li",
	UL: "ul",
	BTN: "button",
	DIV: "div",
	IN: "input",
	LBL: "label",
	SCTN: "section",
	SPAN: "span",
	LST: "select",
	OPT: "option",
	TXT: "textarea",
	CHK: "checkbox",
	RAD: "radio",
	TBL: "table",
	THD: "thead",
	TBD: "tbody",
	TR: "tr",
	TH: "th",
	TD: "td",
	FLE: "file",
	PH: "placeholder",
	KUP: "keyup",
	CHNG: "change",
	CLK: "click",
	DCLK: "dblclick",
	DSBL: "disabled",
	DFLT: "default",
	STRNG: "string",
	NMBR: "number",
	MNY: "currency",
	DTTM: "datetime",
	TM: "time",
	DT: "date",
	OBJ: "object",
	ARR: "array",
	BLN: "boolean",
	UND: "undefined",
	RDO: "readonly",
}

// Componente Padre
export const COMPONENTE = {
	CONTENEDOR: "contenedorComponente",
	ESTILO_1: "alto",
	ESTILO_2: "ancho",
}

//Selector de Peridos
export const PERIODO = {
	CONTENEDOR: "contenedorPeriodo",
	TITULO: "tituloPeriodo",
	TXTTITULO: "Período",
	ANIO_ID: "anioPeriodo",
	MES_ID: "mesPeriodo",
	ANIO_MINIMO: 2020,
	A: "Año",
	M: "Mes",
}

//Lista desplegable
export const LST = {
	CONTENEDOR: "contenedorListaDesplegable",
	LBL: "lblLista",
	TXT_LBL: "Lista desplegable",
	SLCT: "ListaDesplegable",
	PH_VACIO: "Sin opciones",
	PH_LLENO: "Selecciona",
}

//Selector de Archivos
export const SLCTARCHIVO = {
	CONTENEDOR: "contenedorArchivo",
	TITULO: "titulo",
	TXTTITULO: "Archivo",
	LBLARCHIVO: "lblArchivo",
	TXTARCHIVO: "Selecciona",
	LBLRUTA: "lblRuta",
	BTNABRIR: "btnAbrir",
	TXTABRIR: "Abrir",
	MSJINICIAL: "Seleccione un archivo..",
	INARCHIVO: "inArchivo",
	MSJ_SIN_FORMATO: "No se ha definido un formato válido para la selección de archivos.",
	MSJ_ERROR_FORMATO: "El archivo seleccionado no es válido.",
	MSJ_ERROR_ARCHIVO: "Se debe seleccionar un archivo valido.",
}

//Tabla
export const TABLA = {
	CONTENEDOR: "contenedorTablaDatos",
	CONTROLES: "contenedorControles",
	TXT_LBL_FILTRO: "Filtrar por:",
	TXT_LBL_PARAMETRO: "Contiene",
	TXT_PH_FILTRO: "Parámetro",
	DETALLES: "contenedorDetalle",
	DETALLE: "detalle",
	LBL_DETALLE: "lblDetalle",
	TXT_DETALLE: "txtDetalle",
	TABLA: "contenedorTabla",
	ID_TABLA: "tablaDatos",
	TBL_ENC: "encabezadoTabla",
	TBL_FILA_HDR: "filaEncabezado",
	TBL_CELDA_HDR: "celdaEncabezado",
	TBL_CUERPO: "cuerpoTabla",
	TBL_FILA: "fila",
	TBL_CELDA: "celda",
	LBL_VALOR_PARAMETRO: "lblFiltro",
	IN_VALOR_PARAMETRO: "inFiltro",
	BTN_FILTRO: "btnFiltrar",
	TXT_BTN_FILTRO: "Filtrar",
	BTN_LIMPIAR: "btnLimpiar",
	TXT_BTN_LIMPIAR: "Limpiar",
	BTN_EXPORTAR: "btnExportar",
	TXT_BTN_EXPORTAR: "Exportar",
	PARAMETROS: "parametros",
	LBL_PARAMETRO: "lblParametro",
	PARAMETRO: "Parámetro",
	SIN_DATOS: "sinDatos",
	TXT_SIN_DATOS: "No hay datos para mostrar",
	ESTILO_SIN_DATOS:
		"width: 100%;height: 100%;text-align: center;font-weight: bold;inset: 0px;margin: auto;display: flex;align-items: center;justify-content: center;user-select: none;",
	ORDEN_ASC: "asc",
	ORDEN_DESC: "desc",
}

// Entrada de datos
export const SOLICITA_DATO = {
	CONTENEDOR: "contenedorSolicitaDato",
	LBL: "lblDato",
	IN: "txtDato",
	TXT_ETIQUETA: "Dato Solicitado",
	TXT_PLACEHOLDER: "Escribe aquí",
}

// Muestra de datos
export const MUESTRA_DATO = {
	CONTENEDOR: "contenedorMuestraDato",
	LBL: "lblDato",
	DTO: "txtDato",
	TXT_ETIQUETA: "Dato Solicitado",
}

// Botonera
export const BOTONERA = {
	CONTENEDOR: "contenedorBotonera",
	BTN: "btnBotonera",
	TXT_BTN: "Botón",
	BTN_DFLT: "Boton",
}

// Valores multiproposito
export const FORMATOS_BBVA = ".txt,.exp"
export const FORMATOS_DWH = ".json"
export const BBVA = "BBVA"
export const CONEKTA = "Conekta"
export const STP = "STP"

// Valores por defecto para los elementos
export const BTN_TXT_DEFAULT = "Botón"
export const LBL_TXT_DEFAULT = "Etiqueta"
export const SPN_TXT_DEFAULT = "Texto"
export const MSJ_PIE = `Dev by Alberto Soto to Cashclick &copy ${new Date().getFullYear()} - All rights reserved`

// Nombres de clases e ID's para elementos HTML
export const NAVEGACION = "navegacion"
export const UL_MENU = "ulMenu"
export const LI_MENU = "liMenu"
export const UL_SUBMENU = "ulSubMenu"
export const LI_SUBMENU = "liSubMenu"
export const TXT_DEFAULT_CLS = "txtDefault"
export const SEL_PERIODO_CLS = "selPeriodo"
export const ANIO_PERIODO_ID = "anioPeriodo"
export const MES_PERIODO_ID = "mesPeriodo"
export const ANIO_PERIODO_LBL_ID = "lblAnioPeriodo"
export const MES_PERIODO_LBL_ID = "lblMesPeriodo"
export const MSJ_CONTENEDOR_CLS = "msjContenedor"

export const PIE_CLS = "pie"
export const SEL_BANCO_CLS = "selBanco"
export const TITULO_BANCO_CLS = "lblBanco"
export const SEL_LAYOUT_CLS = "selLayout"
export const TITULO_LAYOUT_CLS = "lblLayout"
export const SEL_LAYOUT_ID = "selLayout"
