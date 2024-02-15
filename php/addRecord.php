<?php

include 'crud/create.php';

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $producto = $_POST['producto'];
    $cantidad = $_POST['cantidad'];
    $valorUnitario = $_POST['valorUnitario'];

    $create = new Create();
    if (!$create->insertNewRecord($producto, $cantidad, $valorUnitario)) {
        echo "Error: Insertion";
    } else {
        echo "Ok: Insertion";
    }
}