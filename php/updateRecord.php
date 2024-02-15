<?php

include_once 'crud/update.php';

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $fecha = $_POST['fecha'];
    $producto = $_POST['producto'];
    $cantidad = $_POST['cantidad'];
    $valorUnitario = $_POST['valorUnitario'];

    $update = new Update();
    if (!$update->updateOneRecord($fecha, $producto, $cantidad, $valorUnitario)) {
        echo "Error: Update";
    } else {
        echo "Ok: Update";
    }
}