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
	FALSE: "false",
	TRUE: "true",
	BBVA: "BBVA",
	CONEKTA: "Conekta",
	STP: "STP",
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

// Vista Layout
export const LAYOUT = {
	ID_VISTA: "Layout",
	TITULO: "Administración de Layout's",
	ID_CONTENEDOR_BTN_NUEVO: "nuevo",
	ID_BTN_NUEVO: "nuevo",
	TXT_BTN_NUEVO: "Nuevo",
	ID_CONTENEDOR_BANCO: "banco",
	TXT_ETQ_BANCO: "Banco",
	ID_CONTENEDOR_LAYOUT: "layout",
	TXT_ETQ_LAYOUT: "Layout",
	ID_CONTENEDOR_TIPO: "tipo",
	TXT_ETQ_TIPO: "Tipo",
	ID_CONTENEDOR_EXTENSIONES: "extensiones",
	TXT_ETQ_EXTENSIONES: "Extensiones",
	PH_EXTENSIONES: "Ejemplo: txt,csv,xls",
	ID_CONTENEDOR_BTN_GUARDAR: "guardar",
	ID_BTN_GUARDAR: "guardar",
	TXT_BTN_GUARDAR: "Actualizar",
	ID_CONTENEDOR_EDITOR: "contenedorEditor",
	ID_EDITOR: "editor",
	TIPOS: [
		{ texto: "Excel", valor: "excel", extenciones: "xls,xlsx,xlsm,xlsb" },
		{ texto: "Delimitado", valor: "delimitado", extenciones: "txt,csv" },
		{ texto: "Ancho Fijo", valor: "fijo", extenciones: "txt,exp" },
		{ texto: "JSON", valor: "json", extenciones: "json,txt" },
		{ texto: "XML", valor: "xml", extenciones: "xml,txt" },
	],
	MSJ_CARGA_BANCOS: "Cargando bancos...",
	MSJ_CARGA_LAYOUTS: "Cargando layouts...",
	MSJ_ERROR_BANCO_1: "No se encontró información del banco seleccionado.",
	MSJ_ERROR_LAYOUT_1: "No hay layouts disponibles.",
	MSJ_ERROR_LAYOUT_2: "No se encontró información del layout seleccionado.",
	MSJ_ERROR_LAYOUT_3: "El layout no indica las extensiones soportadas.",
	MSJ_EXITO_GUARDADO: "El layout se ha actualizado correctamente.",
	MSJ_ERROR_GUARDADO: "No se pudo actualizar el layout.",
	MSJ_ERROR_NUEVO_1: "Se debe indicar un alias para el nuevo layout.",
	MSJ_EXITO_NUEVO: "El layout se ha registrado correctamente.",
	MSJ_ERROR_NUEVO_2: "No se pudo registrar el layout.",
	MSJ_ERROR_VALIDACION_BANCO: "Se debe seleccionar un banco.",
	MSJ_ERROR_VALIDACION_TIPO: "Se debe seleccionar el tipo de archivo.",
	MSJ_ERROR_VALIDACION_FORMATO: "El contenido del layout no tiene el formato esperado.",
	MSJ_ERROR_VALIDACION_EDITOR: "Se debe indicar el contenido del layout.",
	MSJ_ERROR_VALIDACION_EXTENSION: "Se debe indicar las extensiones de archivo.",
	MSJ_SOLICITUD_ALIAS:
		"Indique el alias para identificar el layout.<br>Recuerde que este dato debe ser único, no puede haber 2 alias iguales.",
	PH_ALIAS: "Alias",
	MSJ_CONFIRMACION_NUEVO: "¿Desea crear un layout a partir del layout seleccionado?",
	TXT_BTN_SI_CONFIRMACION_NUEVO: "Si, usar como plantilla",
	TXT_BTN_NO_CONFIRMACION_NUEVO: "No, crear desde cero",
}

export const MSJ_PIE = `Dev by Alberto Soto to Cashclick &copy ${new Date().getFullYear()} - All rights reserved`

// Nombres de clases e ID's para elementos HTML
export const NAVEGACION = "navegacion"
export const UL_MENU = "ulMenu"
export const LI_MENU = "liMenu"
export const UL_SUBMENU = "ulSubMenu"
export const LI_SUBMENU = "liSubMenu"
export const PIE_CLS = "pie"
export const MSJ_CONTENEDOR_CLS = "msjContenedor"
