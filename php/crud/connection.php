<?php

class Connection {
    private $host;
    private $user;
    private $pass;
    private $bd;
    private $connection;

    function __construct() {
        $this->host = "localhost";
        $this->user = "root";
        $this->pass = "";
        $this->bd = "u400347538_fpc";
    }

    public function connect() {
        $this->connection = new mysqli($this->host, $this->user, $this->pass, $this->bd);
        if ($this->connection->connect_error) {
            throw new Exception("Failed connection: " . $this->connection->connect_error);
        }
    }

    public function runQuery($sqlQuery) {
        if (!$this->connection) {
            $this->connect();
        }

        $result = $this->connection->query($sqlQuery);

        if ($result === false) {
            throw new Exception("Failed query: " . $this->connection->error);
        }

        return $result;
    }

    public function close() {
        if ($this->connection) {
            $this->connection->close();
        }
    }
}

?>
