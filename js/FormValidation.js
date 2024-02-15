export default class FormValidator {
    constructor() {}

    // Método para validar que el contenido del campo product corresponda con lo esperado
    validateProduct(product) {
        return this.isProductSecure(product);
    }
    
    // Método para validar la seguridad de la entrada del campo product
    isProductSecure(product) {
        var regex = /[;'\\]/;
        return !regex.test(product);
    }

    // Método para validar que el contenido del campo amount corresponda con lo esperado
    validateAmount(amount) {
        return (amount >= 1) && (!isNaN(amount)) && this.isAmountSecure(amount);
    }
    
    // Método para validad la seguridad de la entrada del campo amount
    isAmountSecure(amount) { // <-- Implementar seguridad luego
        return true;
    }

    // Método para validar que el contenido del campo unitPrice se corresponde con lo esperado
    validateUnitPrice(unitPrice) {
        if (Math.abs(unitPrice) % 50 !== 0) {
            if (!confirm(`¿Está seguro de que el precio unitario es ${unitPrice}?`)) {
                return false;
            }
        } 
        
        return (Math.abs(unitPrice) >= 1) && (!isNaN(unitPrice)) && this.isUnitPriceSecure(unitPrice);
    }

    // Método para validar la sguridad de la entrada del campo unitPrice
    isUnitPriceSecure(unitPrice) { // <-- Implementar seguridad luego
        return true;
    }

}