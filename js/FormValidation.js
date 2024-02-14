class FormValidator {
    constructor(product, amount, unitPrice) {
        this.product = product;
        this.amount = amount;
        this.unitPrice = unitPrice;
    }

    validateProduct() {
        // Método para validar que el contenido del campo producto corresponda con lo esperado
    }

    isProductSecure() {
        // Método para validar la seguridad de la entrada del campo product
    }

    validateAmount() {
        // Método para validar que el contenido del campo amount corresponda con lo esperado
    }
    
    isAmountSecure() {
        // Método para validad la seguridad de la entrada del campo amount
    }

    validateUnitPrice() {
        // Método para validar que el contenido del campo unitPrice se corresponde con lo esperado
    }

    isUnitPriceSecure() {
        // Método para validar la sguridad de la entrada del campo unitPrice
    }

}

// FormValidation
function checkValues() {
    // Obtener valores del formulario
    const producto = document.getElementById('producto').value;
    const cantidad = parseInt(document.getElementById('cantidad').value);
    const valorUnitario = parseFloat(document.getElementById('valorUnitario').value);

    // Validar que la cantidad y el valor unitario sean números positivos
    if (isNaN(cantidad) || cantidad <= 0 || isNaN(valorUnitario) || valorUnitario <= 0) {
        alert('Por favor, ingrese valores válidos para cantidad y valor unitario.');
        return;
    }

    // Verificar si el valor unitario es un múltiplo de 50
    if (valorUnitario % 50 !== 0) {
        const confirmacion = confirm('El valor unitario no es un múltiplo de 50. ¿Desea continuar con este registro?');
        if (!confirmacion) {
            return; // Salir de la función si el usuario elige no continuar
        }
    }

    agregarRegistro(producto, cantidad, valorUnitario);    
}