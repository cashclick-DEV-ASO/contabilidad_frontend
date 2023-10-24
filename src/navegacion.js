const mostrarNavegacion = (rutas) => {
    const navegacion = document.createElement("navegacion");
    navegacion.className = "navegacion";
    navegacion.appendChild(crearRutas(rutas));
    return navegacion;
}

const crearRutas = (rutas) => {
    const listaNavegacion = document.createElement("ul");
    listaNavegacion.className = "listaNavegacion";

    Object.keys(rutas).forEach(ruta => {
        if (ruta.visible === false) return;
        
        const item = document.createElement("li");
        item.className = "itemNavegacion";
        item.innerHTML = ruta;
        item.addEventListener("click", () => mostrar(true, ruta.ruta));
    });

    return listaNavegacion;
};

const mostrar = (registraHistorial = true, ruta = null) => {
    if (ruta) window.location.pathname = ruta;
    const direccion = window.location.pathname
    if (registraHistorial) window.history.pushState({}, "", direccion);
    const vista = Object.values(rutas).find(r => r.ruta === direccion) || rutas["Inicio"];
    contenido.innerHTML = vista.contenido
}
