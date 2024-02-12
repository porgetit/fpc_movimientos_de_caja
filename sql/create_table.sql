CREATE TABLE RegistrosVentas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    fecha DATETIME,
    producto VARCHAR(255),
    cantidad INT,
    valorUnitario DECIMAL(10, 2)
);