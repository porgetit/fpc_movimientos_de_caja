<?php

include_once "connection.php";

class Recover {
    private $connection;

    function __construct() {
        // Nos conectamos a la base de datos
        $this->connection = new Connection();
        $this->connection->connect();
    }

    function selectAll($fecha) {
        // Formatear la fecha para que sea compatible con SQL (YYYY-MM-DD)
        $fechaSQL = date('Y-m-d', strtotime($fecha));
    
        // Construir la consulta SQL para seleccionar registros con la fecha especificada
        $query = "SELECT * FROM Movimientos WHERE Date(fecha) = '$fechaSQL'";
    
        // Ejecutar la consulta
        $result = $this->connection->runQuery($query);
    
        if ($result->num_rows > 0) {
            $this->connection->close();
            return $result;
        } else {
            $this->connection->close();
            throw new Exception("There are not any records for the date $fecha");
        }    
    }
    
}