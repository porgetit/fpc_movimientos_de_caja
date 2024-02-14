class DomManipulator {
    constructor() {
        
    }
}

// DomManipulator
function actualizarListaRegistros() {
    const listaRegistros = document.getElementById('listaRegistros');
    listaRegistros.innerHTML = '';

    // Ordenar los registros por fecha de forma ascendente
    registros.sort((a, b) => new Date(a.fecha) - new Date(b.fecha));

    for (let registro of registros) {
        const listItem = document.createElement('li');
        listItem.className = 'list-group-item';
        listItem.id = registro.fecha;
        listItem.innerHTML = `<strong>${registro.fecha}</strong> - ${registro.producto} - Cantidad: ${registro.cantidad} - Valor Unitario: $${registro.valorUnitario} - Total: $${registro.valorTotal} <button class="btn btn-sm float-right" id="eliminarRegistroBtn_${registro.fecha}"><img src="src/trash_can.svg" alt="Eliminar" width="24" height="24"></button><button class="btn btn-sm float-right" id="actualizarRegistroBtn_${registro.fecha}"><img src="src/pencil.svg" alt="Editar" width="24" height="24"></button>`;
        listaRegistros.appendChild(listItem);
        document.getElementById(`eliminarRegistroBtn_${registro.fecha}`).onclick = function() {
            deleteThis(registro.fecha);
        }
        document.getElementById(`actualizarRegistroBtn_${registro.fecha}`).onclick = function() {
            updateThis(registro.fecha);
        }
    }
}

// Auxiliar of DomManipulator
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

// DomManipulator
function actualizarTotalVentas() {
    totalVentas = calcularTotalVentas();
    document.getElementById('totalVentas').textContent = `$${totalVentas}`;
}

// DomManipulation -> RecordManager
function reload() {
    limpiarForm(); // DomManipulation 
    cargarRegistrosdesdeBD(); // RecordManager
    actualizarListaRegistros(); // DomManipulation
    actualizarTotalVentas(); // DomManipulation
}

// DomManipulation
function limpiarForm() {
    document.getElementById('producto').value = '';
    document.getElementById('cantidad').value = '';
    document.getElementById('valorUnitario').value = '';
}

// DomManipulation
function updateThis(fecha) {
    const listItem = document.getElementById(fecha);
    const registro = registros.find(registro => registro.fecha == fecha);
    
    // DomManipulation
    listItem.innerHTML = `
        <form class="form-inline">
            <div class="form-group mx-sm-3 mb-2">
                <input type="text" class="form-control" id="producto_${fecha}" value="${registro.producto}">
            </div>
            <div class="form-group mx-sm-3 mb-2">
                <input type="number" class="form-control" id="cantidad_${fecha}" value="${registro.cantidad}">
            </div>
            <div class="form-group mx-sm-3 mb-2">
                <input type="number" class="form-control" id="valorUnitario_${fecha}" value="${registro.valorUnitario}">
            </div>
            <button type="submit" class="btn btn-primary mb-2" id="updateRecordBtn_${fecha}>Actualizar</button>
        </form>
    `;
    document.getElementById(`updateRecordBtn_${fecha}`).onclick = function() {
        updateRecord(fecha);
    }
}