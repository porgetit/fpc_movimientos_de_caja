export default class RecordsManager {
    constructor() {}

    // Método para cargar los registros desde la BD usando la fecha indicada como filtro
    recordsCharger(dateAsFilter, callback) {
        var xhttp = new XMLHttpRequest();
        var url = '../php/recordsCharger.php';
        var data = new FormData();
        data.append('dateAsFilter', dateAsFilter);

        xhttp.onreadystatechange = function() {
            if (this.readyState == 4) {
                if (this.status >= 200 && this.status < 300) {
                    // La solicitud se completó con éxito
                    try {
                        const response = JSON.parse(this.responseText);
                        var records;
                        if (response.success) {
                            records = response.data.map(datum => {
                                return {
                                    date: datum.date,
                                    product: datum.product,
                                    amount: datum.amount,
                                    unitPrice: datum.unitPrice,
                                    totalPrice: datum.amount * datum.unitPrice
                                }
                            });

                            callback({success: true, records: records});
                        } else {
                            console.log(`Response error: ${response.error}`); // <--<< creo que esto pasa cuando no hay datos que coincidan
                        }
                    } catch (error) {
                        console.log(`JSON.parse error: ${error}`);
                    }
                } else if (this.status >= 400 && this.status < 500) {
                    // Error del cliente
                    console.log(`Client error: ${this.status}`);
                    callback({success: false});
                } else if (this.status >= 500 && this.status < 600) {
                    // Error del servidor
                    console.log(`Server error: ${this.status}`);
                    callback({success: false});
                } else {
                    // Otros casos
                    console.log(`Unexpected error: ${this.status}`);
                    callback({success: false});
                }
            }
        };

        xhttp.open("POST", url, true);
        xhttp.send(data);
    }
    
    // Método para agregar un nuevo registro
    addRecord(product, amount, unitPrice, callback) {
        var xhttp = new XMLHttpRequest();
        var url = '../php/addRecord.php';
        var data = new FormData(); // Datos del nuevo producto
        data.append('product', product);
        data.append('amount', amount);
        data.append('unitPrice', unitPrice);

        xhttp.onreadystatechange = function() { // Debería manejar el comportamiento para cada caso, no solo el OK.
            if (this.readyState == 4) {
                if (this.status >= 200 && this.status < 300) {
                    // La solicitud se completó con éxito
                    callback({success: true});
                } else if (this.status >= 400 && this.status < 500) {
                    // Error del cliente
                    console.log(`Cliente error: ${this.status}`);
                    callback({success: false});
                } else if (this.status >= 500 && this.status < 600) {
                    // Error del servidor
                    console.log(`Server error: ${this.status}`);
                    callback({success: false});
                } else {
                    // Otros casos
                    console.log(`Unexpected error: ${this.status}`);
                    callback({success: false});
                }
            }
        };

        xhttp.open("POST", url, true);
        xhttp.send(data);
    }

    // Método para eliminar un registro
    deleteRecord(dateAsFilter, callback) {
        if (confirm(`¿Seguro que desea eliminar el registro '${dateAsFilter}'`)) {
            var xhttp = new XMLHttpRequest();
            var url = '../php/deleteRecord.php';
            var data = new FormData().append('dateAsFilter', dateAsFilter);

            xhttp.onreadystatechange = function() {
                if (this.readyState == 4) {
                    if (this.status >= 200 && this.status < 300) {
                        // La solicitud se completó con éxito
                        callback({success: true});
                    } else if (this.status >= 400 && this.status < 500) {
                        // Error del cliente
                        console.log(`Cliente error: ${this.status}`);
                        callback({success: false});
                    } else if (this.status >= 500 && this.status < 600) {
                        // Error del servidor
                        console.log(`Server error: ${this.status}`);
                        callback({success: false});
                    } else {
                        // Otros casos
                        console.log(`Unexpected error: ${this.status}`);
                        callback({success: false});
                    }
                }
            }

            xhttp.open("POST", url, true);
            xhttp.send(data);
        } else {
            callback({success: false}) // Detiene la ejecución
        }
    }

    /**
     * 
     * @param {string} dateAsFilter 
     * @param {string} product 
     * @param {Number} amount 
     * @param {Number} unitPrice 
     * @param {Function} callback 
     * @description Método para solicitar la actulización de un registro
     */
    updateRecord(dateAsFilter, product, amount, unitPrice, callback) {
        if (confirm(`¿Seguro que desea modificar el registro '${dateAsFilter}'`)) {
            var xhttp = new XMLHttpRequest();
            var url = '../php/updateRecord.php';
            var data = new FormData();
            data.append('dateAsFilter', dateAsFilter);
            data.append('product', product);
            data.append('amount', amount);
            data.append('unitPrice', unitPrice);

            xhttp.onreadystatechange =  function() {
                if (this.readyState == 4) {
                    if (this.status >= 200 && this.status < 300) {
                        // La solicitud se completó con éxito
                        callback({success: true});
                    } else if (this.status >= 400 && this.status < 500) {
                        // Error del cliente
                        console.log(`Client error: ${this.status}`);
                        callback({success: false});
                    } else if (this.status >= 500 && this.status < 600) {
                        // Error del servidor
                        console.log(`Server error: ${this.status}`);
                        callback({success: false});
                    } else {
                        // Otros casos
                        console.log(`Unexpected error: ${this.status}`);
                        callback({success: false});
                    }
                }
            }

            xhttp.open("POST", url, true);
            xhttp.send(data);
        } else {
            callback({success: false})
        }
    }
}