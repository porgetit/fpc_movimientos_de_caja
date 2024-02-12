<?php

include_once 'connection.php';

class Delete {
    private $connection;

    function __construct() {
        $this->connection = new Connection();
        $this->connection->connect();
    }

    function deleteOneRecord($fecha) {
        $success = $this->connection->runQuery("DELETE FROM Movimientos WHERE (fecha) = '$fecha'");
        $this->connection->close();

        return $success;
    }
}