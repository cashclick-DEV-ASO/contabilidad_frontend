import Componente from "./componente.js";

class Pie extends Componente {
    constructor() {
        super(document.createElement("footer"), "pie")
        this.elemento.innerHTML = `Dev by Alberto Soto to Cashclick &copy ${new Date().getFullYear()} - All rights reserved`
    }
}

export default Pie;