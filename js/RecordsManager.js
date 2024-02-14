class RecordsManager {
    constructor() {}

    // Método para cargar los registros desde la BD usando la fecha indicada como filtro
    recordsCharger(dateAsFilter, callback) {
        var xhttp = new XMLHttpRequest();
        var url = '' // <--<< FALTA LA URL
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
                    callback({success: false});
                    console.log(`Client error: ${this.status}`);
                } else if (this.status >= 500 && this.status < 600) {
                    // Error del servidor
                    callback({success: false});
                    console.log(`Server error: ${this.status}`);
                } else {
                    // Otros casos
                    callback({success: false});
                    console.log(`Unexpected error: ${this.status}`);
                }
            }
        };

        xhttp.open("POST", url, true);
        xhttp.send(data);
    }
    
    // Método para agregar un nuevo registro
    addRecord(product, amount, unitPrice, callback) {
        var xhttp = new XMLHttpRequest();
        var url = ''; // <-<< FALTA LA URL
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
                    callback({success: false});
                    console.log(`Cliente error: ${this.status}`);
                } else if (this.status >= 500 && this.status < 600) {
                    // Error del servidor
                    callback({success: false});
                    console.log(`Server error: ${this.status}`);
                } else {
                    // Otros casos
                    callback({success: false});
                    console.log(`Unexpected error: ${this.status}`);
                }
            }
        };

        xhttp.open("POST", url, true);
        xhttp.send(data);
    }

    // Método para eliminar un registro
    deleteRecord(dateAsFilter, product, amount, unitPrice, callback) {
        if (confirm(`¿Seguro que desea eliminar el registro '${dateAsFilter}'`)) {
            var xhttp = new XMLHttpRequest();
            var url = ''; // <--<< FALTA LA URL
            var data = new FormData().append('dateAsFilter', dateAsFilter);

            xhttp.onreadystatechange = function() {
                if (this.readyState == 4) {
                    if (this.status >= 200 && this.status < 300) {
                        // La solicitud se completó con éxito
                        callback({success: true});
                    } else if (this.status >= 400 && this.status < 500) {
                        // Error del cliente
                        callback({success: false});
                        console.log(`Cliente error: ${this.status}`);
                    } else if (this.status >= 500 && this.status < 600) {
                        // Error del servidor
                        callback({success: false});
                        console.log(`Server error: ${this.status}`);
                    } else {
                        // Otros casos
                        callback({success: false});
                        console.log(`Unexpected error: ${this.status}`);
                    }
                }
            }

            xhttp.open("POST", url, true);
            xhttp.send(data);
        } else {
            callback({success: false}) // Detiene la ejecución
        }
    }

    // Método para actualizar un registro
    updateRecord(dateAsFilter, callback) {
        if (confirm(`¿Seguro que desea modificar el registro '${dateAsFilter}'`)) {
            var xhttp = new XMLHttpRequest();
            var url = ''; // <--<< FALTA URL
            var data = new FormData();
            data.append('dateAsFilter', dateAsFilter);
            data.append('product', product);
            data.append('amount', amount);
            data.append('unitPrice', unitPrice);

            xhttp.onreadystatechange =  function() {
                if (this.readyState == 4) {
                    if (this.status >= 200 && this.status < 300) {
                        // La solicitud se completó con éxito
                    } else if (this.status >= 400 && this.status < 500) {
                        // Error del cliente
                    } else if (this.status >= 500 && this.status < 600) {
                        // Error del servidor
                    } else {
                        // Otros casos
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

// RecordManager
function updateRegistro(event, fecha) {
    const confirmacion = confirm('¿Seguro que desea actualizar este registro?');
    if (!confirmacion) {
        reload();
        return;
    }

    var xhttp = new XMLHttpRequest();
    var url = 'php/update.php';
    var data = new FormData();
    data.append('fecha', fecha);
    data.append('producto', document.getElementById(`producto_${fecha}`).value);
    data.append('cantidad', document.getElementById(`cantidad_${fecha}`).value);
    data.append('valorUnitario', document.getElementById(`valorUnitario_${fecha}`).value);

    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            console.log(this.responseText);
        }
    }

    xhttp.open("POST", url, true);
    xhttp.send(data);
}

// // RecordManager and DomManipulator
// function cargarRegistrosdesdeBD() {
//     const fechaFiltro = document.getElementById('fecha').value;
    
//     var xhttp = new XMLHttpRequest();
//     var url = "php/recover.php";
//     var data = new FormData();
//     data.append('fecha', fechaFiltro);

//     xhttp.onreadystatechange = function() {
//         if (this.readyState == 4 && this.status == 200) {
//             try {
//                 const response = JSON.parse(this.responseText);
//                 if (response.success) {
//                     registros = response.data.map(dato => {
//                         return {
//                             fecha: dato.fecha,
//                             producto: dato.producto,
//                             cantidad: dato.cantidad,
//                             valorUnitario: dato.valorUnitario,
//                             valorTotal: dato.cantidad * dato.valorUnitario
//                         }
//                     });

//                     // Actualizamos la lista de registros con los registros cargados
//                     actualizarListaRegistros();

//                     // Totalizamos las ventas con los registros cargados
//                     actualizarTotalVentas();
//                 } else {
//                     console.error('Error:', response.error);
//                     const listaRegistros = document.getElementById('listaRegistros');
//                     listaRegistros.innerHTML = ''; // Limpiar
//                     document.getElementById('totalVentas').textContent = '0.00';
//                 }
//             } catch (error) {
//                 console.error('Error en el servidor:', error);
//             }
//         }
//     };

//     xhttp.open("POST", url, true);
//     xhttp.send(data);
// }

// RecordsManager
// function agregarRegistro(producto, cantidad, valorUnitario) {
//     var xhttp = new XMLHttpRequest();
//     var url = 'php/insertOnce.php';
//     var data = new FormData();
//     data.append('producto', producto);
//     data.append('cantidad', cantidad);
//     data.append('valorUnitario', valorUnitario);

//     xhttp.onreadystatechange = function() {
//         if (this.readyState == 4 && this.status == 200) {
//             console.log(this.responseText == 'Ok: Insertion' ? 'New record recorded' : this.responseText == 'Error: Insertion' ? 'New record not recorded' : 'Unknown error');
//         }

//         reload();
//     };

//     xhttp.open("POST", url, true);
//     xhttp.send(data);
// }

// // RecordManager
// function deleteThis(fecha) {
//     const confirmacion = confirm('¿Seguro que desea eliminar este registro?');
//     if (!confirmacion) {
//         return;
//     }

//     var xhttp = new XMLHttpRequest();
//     var url = 'php/delete.php';
//     var data = new FormData();
//     data.append('fecha', fecha);

//     xhttp.onreadystatechange = function () {
//         if (this.readyState == 4 && this.status == 200) {
//             console.log(this.responseText);
//             reload();
//         }
//     };

//     xhttp.open("POST", url, true);
//     xhttp.send(data);
// }