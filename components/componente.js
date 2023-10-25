class Componente {
    constructor(elemento, claseDefault = "") {
        this.elemento = elemento
        if (claseDefault !== "") this.addClase(claseDefault)
    }

    /**
     * @param {string | string[]} clase - Clase o clases a agregar al label
     * @description Agrega una clase o clases al label
     */
    addClase(clase) {
        if (typeof clase === "string") return this.elemento.classList.add(clase)
        clase.forEach(c => this.elemento.classList.add(c))
    }

    /**
     * @param {string | string[]} clase - Clase o clases a remover del label
     * @description Remueve una clase o clases del label
     */
    removeClase(clase) {
        if (typeof clase === "string") return this.elemento.classList.remove(clase)
        clase.forEach(c => this.elemento.classList.remove(c))
    }

    /**
     * @param {string} id - ID para el elemento
     * @description Agrega un ID al elemento
     */
    addID(id) {
        this.elemento.id = id
    }

    /**
     * @description Remueve el ID del elemento
     */
    removeID() {
        this.elemento.removeAttribute("id")
    }

    /**
     * @param {string} evento - Evento a escuchar
     * @param {function} callback - Función a ejecutar cuando se dispare el evento
     * @description Agrega un listener al elemento
     */
    addListener(evento, callback) {
        this.elemento.addEventListener(evento, callback)
    }
}

export default Componente