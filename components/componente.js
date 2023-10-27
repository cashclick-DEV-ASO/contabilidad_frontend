class Componente {
    /**
     * @param {HTMLElement} elemento - Elemento contenedor del componente
     * @description Contenedor principal del componente
     */
    #componente

    /**
     * @param {string | HTMLElement} contenedor - Contenedor principal del componente
     * @param {object} opciones - Objeto con la clase y el id para el contenedor del componente
     * @description Crea un elemento HTML del tipo solicitado
     * @returns {Componente} Componente
     */
    constructor(contenedor = null, { clase = "", id = "" } = {}) {
        this.#componente = typeof contenedor === "string" ?
            document.createElement(contenedor) :
            contenedor

        if (clase !== "") this.setClase(clase)
        if (id !== "") this.setID(id)

        return this
    }

    /**
     * @param {string | string[]} clase - Clase o clases a agregar al label
     * @description Agrega una clase o clases al label
     */
    setClase(clase) {
        const cls = Array.isArray(clase) ? clase : clase.split(" ")
        cls.forEach(c => this.#componente.classList.add(c))
        return this
    }

    /**
     * @description Devuelve las clases del elemento
     * @returns {DOMTokenList} Clases del elemento
     */
    getClases() {
        return this.#componente.classList
    }

    /**
     * @param {string | string[]} clase - Clase o clases a remover del label
     * @description Remueve una clase o clases del label
     */
    removeClase(clase) {
        const cls = Array.isArray(clase) ? clase : clase.split(" ")
        cls.forEach(c => this.#componente.classList.remove(c))
        return this
    }

    /**
     * @param {string} id - ID para el elemento
     * @description Agrega un ID al elemento
     */
    setID(id) {
        if (!id && id === "") return this
        this.#componente.id = id
        return this
    }

    /**
     * @description Devuelve el ID del elemento
     * @returns {string} ID del elemento
     */
    getID() {
        return this.#componente.id
    }

    /**
     * @description Remueve el ID del elemento
     */
    removeID() {
        this.#componente.removeAttribute("id")
    }

    /**
     * @param {string} evento - Evento a escuchar
     * @param {function} callback - Función a ejecutar cuando se dispare el evento
     * @description Agrega un listener al elemento
     * @returns {Componente} Componente
     */
    setListener(evento, callback) {
        this.#componente.addEventListener(evento, callback)
        return this
    }

    /**
     * @param {string} propiedad - Propiedad a configurar
     * @param {string} valor - Valor de la propiedad
     * @description Configura una propiedad del elemento
     * @returns {Componente} Componente
     */
    setPropiedad(prop, valor) {
        if (prop in this.#componente)
            this.#componente[prop] = valor
        return this
    }

    getPropiedad(prop) {
        return this.#componente[prop]
    }

    /**
     * @param {string} propiedad - Texto a insertar en el elemento
     * @description Inserta texto en el elemento
     * @returns {Componente} Componente
     */
    setTexto(texto) {
        if (this.#componente.textContents) this.#componente.textContents = texto
        else this.#componente.innerHTML = texto
        return this
    }

    getTexto() {
        return this.#componente.textContent || this.#componente.innerText || this.#componente.innerHTML
    }

    /**
     * @param {string} value - Valor para el input
     * @description Agrega un valor al elemento
     */
    setValor(valor) {
        this.#componente.value = valor
    }

    /**
     * @description Devuelve el valor del input
     * @returns {string} Valor del elemento
     */
    getValor() {
        return this.#componente.value
    }

    /**
     * @param {HTMLElement} hijo - Elemento HTML a inlcuir en el contenedor HTML del componente
     * @description Agrega un elemento HTML al contenedor HTML del componente
     * @returns {Componente} Componente
     */
    addHijo(hijo = new HTMLElement()) {
        this.#componente.appendChild(hijo)
        return this
    }

    /**
     * @param {HTMLElement[]} hijos - Elementos a inlcuir en el contenedor HTML del componente
     * @description Agrega multiples hijos al contenedor HTML del componente
     * @returns {Componente} Componente
     */
    addHijos(hijos = []) {
        hijos.forEach(h => this.addHijo(h))
        return this
    }

    /**
     * @param {HTMLElement} hijo - Elemento a remover del contenedor HTML del componente
     * @description Remueve un elemento HTML del contenedor HTML del componente
     * @returns {Componente} Componente
     */
    removeHijo(hijo) {
        this.#componente.removeChild(hijo)
        return this
    }

    /**
     * @param {HTMLElement[]} hijos - Elementos a remover del contenedor HTML del componente
     * @description Remueve todos los hijos del contenedor HTML del componente
     * @returns {Componente} Componente
     */
    removeHijos(hijos = []) {
        hijos.forEach(h => this.#componente.removeChild(h))
        return this
    }

    /**
     * @description Remueve el componente del DOM
     */
    removeComponente() {
        this.#componente.remove()
    }

    /**
     * @description Retira todos los hijos del contenedor HTML del componente
     * @returns {HTMLElement} Elemento HTML del componente
     */
    vaciar() {
        this.#componente.innerHTML = ""
        return this
    }

    /**
     * @description Devuelve el componente
     * @returns {HTMLElement} Elemento
     */
    getComponente() {
        return this.#componente
    }
}

export default Componente