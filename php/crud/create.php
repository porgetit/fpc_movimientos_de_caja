<?php

include_once "connection.php";

class Create {
    private $connection;

    function __construct() {
        // Nos conectamos a la base de datos
        $this->connection = new Connection();
        $this->connection->connect();
    }
    
    function insertNewRecord($product, $amount, $unitPrice) {
        date_default_timezone_set("America/Bogota");
        $date = date("Y-m-d H:i:s");

        $success = $this->connection->runQuery("INSERT INTO Movimientos (fecha, producto, cantidad, valorUnitario) VALUES ('$date', '$product', '$amount', '$unitPrice')");
        $this->connection->close();

        return $success; // Devolvemos true / false según sea exitosa la consulta.
    }
}