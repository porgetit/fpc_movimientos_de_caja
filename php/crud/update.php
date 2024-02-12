<?php

include_once 'connection.php';

class Update {
    private $connection;

    function __construct() {
        $this->connection = new Connection();
        $this->connection->connect();
    }

    function updateOneRecord($fecha, $producto, $cantidad, $valorUnitario) {
        $success = $this->connection->runQuery("UPDATE Movimientos SET producto = '$producto', cantidad = '$cantidad', valorUnitario = '$valorUnitario' WHERE fecha = '$fecha'");
        $this->connection->close();
        return $success;
    }
}