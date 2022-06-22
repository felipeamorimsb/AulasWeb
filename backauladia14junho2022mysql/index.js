const express = require("express");

const cors = require ("cors");
const bodyparser = require ("body-parser");
const config = require ("./config");

const mysql_connector = require("mysql");

const app = express ();

app.use(express.json());
app.use(cors());
app.use(bodyparser.json());

const connection = mysql_connector.createConnection({
    host: config.host,
    user: config.user,
    password: config.password,
    database: config.database,
    port: config.port_mysql,
});

app.get("/", (req, res) => {
    console.log("Response ok.");
    res.send("Ok");
});

app.listen(config.port, () =>
    console.log("Servidor funcionando na porta " + config.port)
);