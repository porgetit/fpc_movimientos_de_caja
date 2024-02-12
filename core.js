// Variables globales para almacenar registros y total de ventas
let registros = [];
let totalVentas = 0.00;

cargarRegistrosdesdeBD();

document.getElementById('fecha').addEventListener('change', function() {
    cargarRegistrosdesdeBD();
});

function cargarRegistrosdesdeBD() {
    const fechaFiltro = document.getElementById('fecha').value;
    
    var xhttp = new XMLHttpRequest();
    var url = "php/recover.php";
    var data = new FormData();
    data.append('fecha', fechaFiltro);

    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            try {
                const response = JSON.parse(this.responseText);
                if (response.success) {
                    registros = response.data.map(dato => {
                        return {
                            fecha: dato.fecha,
                            producto: dato.producto,
                            cantidad: dato.cantidad,
                            valorUnitario: dato.valorUnitario,
                            valorTotal: dato.cantidad * dato.valorUnitario
                        }
                    });

                    // Actualizamos la lista de registros con los registros cargados
                    actualizarListaRegistros();

                    // Totalizamos las ventas con los registros cargados
                    actualizarTotalVentas();
                } else {
                    console.error('Error:', response.error);
                    const listaRegistros = document.getElementById('listaRegistros');
                    listaRegistros.innerHTML = ''; // Limpiar
                    document.getElementById('totalVentas').textContent = '0.00';
                }
            } catch (error) {
                console.error('Error en el servidor:', error);
            }
        }
    };

    xhttp.open("POST", url, true);
    xhttp.send(data);
}

function actualizarListaRegistros() {
    const listaRegistros = document.getElementById('listaRegistros');
    listaRegistros.innerHTML = '';

    // Ordenar los registros por fecha de forma ascendente
    registros.sort((a, b) => new Date(a.fecha) - new Date(b.fecha));

    for (let registro of registros) {
        const listItem = document.createElement('li');
        listItem.className = 'list-group-item';
        listItem.id = registro.fecha;
        listItem.innerHTML = `<strong>${registro.fecha}</strong> - ${registro.producto} - Cantidad: ${registro.cantidad} - Valor Unitario: $${registro.valorUnitario} - Total: $${registro.valorTotal} <button class="btn btn-sm float-right" onclick="deleteThis('${registro.fecha}')"><img src="src/trash_can.svg" alt="Eliminar" width="24" height="24"></button><button class="btn btn-sm float-right" onclick="updateThis('${registro.fecha}')"><img src="src/pencil.svg" alt="Editar" width="24" height="24"></button>`;
        listaRegistros.appendChild(listItem);
    }
}

function calcularTotalVentas() {
    // Asegurarse de que la propiedad valorTotal esté presente en cada registro
    registros.forEach(registro => {
        if (!registro.hasOwnProperty('valorTotal')) {
            registro.valorTotal = registro.cantidad * registro.valorUnitario;
        }
    });

    // Calcular el total de ventas sumando el valorTotal de cada registro
    return registros.reduce((total, registro) => total + registro.valorTotal, 0);
}

function actualizarTotalVentas() {
    totalVentas = calcularTotalVentas();
    document.getElementById('totalVentas').textContent = `$${totalVentas}`;
}

function tomarValoresNuevoRegistro() {
    // Obtener valores del formulario
    const product = document.getElementById('producto').value;
    const amount = parseInt(document.getElementById('cantidad').value);
    const unitPrice = parseFloat(document.getElementById('valorUnitario'));

    // Validar que la cantidad y el valor unitario sean números positivos
    if (isNaN(amount) || amount <= 0 || isNaN(unitPrice) || unitPrice <= 0) {
        alert('Por favor, ingrese valores válidos para la cantidad y el valor unitario.');
        return;
    }

    // Verificar si el valor unitario es un múltiplo de 50
    if (unitPrice % 50 !== 0) {
        const confirmation = confirm('El valor unitario es de '+ unitPrice +'. ¿Desea continuar con el registro?');
        if (!confirmation) {
            return;
        }
    }

    agregarRegistro(product, amount, unitPrice);
}

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

function agregarRegistro(producto, cantidad, valorUnitario) {
    var xhttp = new XMLHttpRequest();
    var url = 'php/insertOnce.php';
    var data = new FormData();
    data.append('producto', producto);
    data.append('cantidad', cantidad);
    data.append('valorUnitario', valorUnitario);

    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            console.log(this.responseText == 'Ok' ? 'New record recorded' : 'Not new record recorded');
        }

        reload();
    };

    xhttp.open("POST", url, true);
    xhttp.send(data);
}

function reload() {
    limpiarForm();
    cargarRegistrosdesdeBD();
    actualizarListaRegistros();
    actualizarTotalVentas();    
}

function limpiarForm() {
    document.getElementById('producto').value = '';
    document.getElementById('cantidad').value = '';
    document.getElementById('valorUnitario').value = '';
}

function deleteThis(fecha) {
    const confirmacion = confirm('¿Seguro que desea eliminar este registro?');
    if (!confirmacion) {
        return;
    }

    var xhttp = new XMLHttpRequest();
    var url = 'php/delete.php';
    var data = new FormData();
    data.append('fecha', fecha);

    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            console.log(this.responseText);
            reload();
        }
    };

    xhttp.open("POST", url, true);
    xhttp.send(data);
}

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

function updateThis(fecha) {
    const listItem = document.getElementById(fecha);
    console.log(fecha);
    const registro = registros.find(registro => registro.fecha == fecha);
    
    listItem.innerHTML = `
        <form class="form-inline" onsubmit="updateRegistro(event, '${fecha}')">
            <div class="form-group mx-sm-3 mb-2">
                <input type="text" class="form-control" id="producto_${fecha}" value="${registro.producto}">
            </div>
            <div class="form-group mx-sm-3 mb-2">
                <input type="number" class="form-control" id="cantidad_${fecha}" value="${registro.cantidad}">
            </div>
            <div class="form-group mx-sm-3 mb-2">
                <input type="number" class="form-control" id="valorUnitario_${fecha}" value="${registro.valorUnitario}">
            </div>
            <button type="submit" class="btn btn-primary mb-2">Actualizar</button>
        </form>
    `;
}
