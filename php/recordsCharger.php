<?php

include 'crud/recover.php';

try {
    // Verificar si se ha recibido la fecha por POST desde JavaScript
    if(isset($_POST['fecha'])) {
        $fecha = $_POST['fecha'];

        // Crear una instancia de la clase Recover
        $recover = new Recover();

        // Llamar al método selectAll con la fecha recibida por POST
        $result = $recover->selectAll($fecha);

        // Procesar los resultados
        $data = array();

        while ($row = $result->fetch_assoc()) {
            $data[] = $row;
        }

        $result->free();

        // Enviar la respuesta en formato JSON
        header('Content-Type: application/json');
        echo json_encode(array("success" => true, "data" => $data));
    } else {
        // Si no se recibe la fecha por POST, devolver un mensaje de error
        echo json_encode(array("success" => false, "error" => "Fecha no recibida por POST"));
    }
} catch (\Throwable $th) {
    // Capturar cualquier excepción que ocurra y devolver un mensaje de error
    echo json_encode(array("success" => false, "error" => "Error en BD: " . $th->getMessage()));
}
?>

