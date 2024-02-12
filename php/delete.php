<?php

include_once 'crud/delete.php';

try {
    if (isset($_POST['fecha'])) {
        $fecha = $_POST['fecha'];

        $delete = new Delete();
        
        if($delete->deleteOneRecord($fecha)) {
            echo "Ok: Registro eliminado exitosamente";
        } else {
            echo "Error: No se pudo eliminar el registro";
        }
    } else {
        echo "Error: No se proporcionó la fecha del registro a eliminar";
    }
} catch (\Throwable $th) {
    echo "Error: " . $th->getMessage();
}
?>
