// Variables globales para almacenar registros y total de ventas
let records = [];
let totalSales = 0.00;

// Initialization
document.addEventListener('DOMContentLoaded', function() {
    // Esto son manipulaciones del DOM
    // ----------------------------------------------------------------------------------------
    document.getElementById('agregarRegistroBtn').onclick = function() {
        checkValues();
    }; 
    var year = new Date().getFullYear();
    document.getElementById('copyright').innerHTML = `© ${year -1} - ${year} Copyright:
    <a class="text-dark" href="https://kevinesguerracardona.com/">kevinesguerracardona.com</a>`
    // -----------------------------------------------------------------------------------------
    cargarRegistrosdesdeBD();
});

// Configuration
document.getElementById('fecha').addEventListener('change', function() {
    cargarRegistrosdesdeBD(); // Y actualizarListaRegistros
});