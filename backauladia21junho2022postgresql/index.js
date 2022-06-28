const express = require("express");
const { Client } = require("pg");
const cors = require("cors");
const bodyparser = require("body-parser");
const config = require("./config");

const mysql_connector = require("mysql");

const app = express();

app.use(express.json());
app.use(cors());
app.use(bodyparser.json());

var conString = config.urlConnection;
var client = new Client(conString);
client.connect(function (err) {
  if (err) {
    return console.error("Não foi possível conectar ao banco.", err);
  }
  client.query("SELECT NOW()", function (err, result) {
    if (err) {
      return console.error("Erro ao executar a query.", err);
    }
    console.log(result.rows[0]);
  });
});

app.get("/usuarios", (req, res) => {
  try {
    client.query("SELECT * FROM Usuarios", function (err, result) {
      if (err) {
        return console.error("Erro ao executar a qry", err);
      }
      res.send(result.rows);
      console.log("Chamou usuarios");
    });
  } catch (error) {
    console.log(error);
  }
});

app.get("/usuarios/:id", (req, res) => {
  try {
    client.query(
      "SELECT * FROM Usuarios WHERE id = $1",
      [req.params.id],
      function (err, result) {
        if (err) {
          return console.error("Erro ao executar a qry de SELECT id", err);
        }
        res.send(result.rows);
        console.log("Chamou id: ");
      }
    );
  } catch (error) {
    console.log(error);
  }
});

app.delete("/usuarios/:id", (req, res) => {
  try {
    console.log("Chmaou delete /:id " + req.params.id);
    const id = req.params.id;
    client.query(
      "DELETE FROM Usuarios WHERE id = $1",
      [id],
      function (err, result) {
        if (err) {
          return console.error("Erro ao executar a qry de DELETE", err);
        } else {
          if (result.rowCount == 0) {
            res.status(400).json({ info: "Registro não encontrado" });
          } else {
            res.status(200).json({ info: `Registro excluido. Código ${id}` });
          }
        }
      }
    );
  } catch (error) {
    console.log(error);
  }
});

app.post("/usuarios", (req, res) => {
  try {
    console.log("Chamou post", req.body);
    const {nome, email} = req.body;
    client.query(
      "INSERT INTO Usuarios (nome, email) VALUES ($1, $2) RETURNING * ", [nome, email],
      function (err, result) {
        if (err) {
          return console.error("Erro ao executar a qry de INSERT", err);
        }
        const { id } = result.rows[0];
        res.setHeader("id", `${id}`);
        res.status(201).json({ info: `Registro criado com o código ${id}` });
        console.log(result);
      }
    );
  } catch (error) {
    console.log(error);
  }
});

app.put("/usuarios/:id", (req, res) => {
  try {
    console.log("Chamou update", req.body);
    const id = req.params.id;
    const { nome, email } = req.body;
    client.query(
      "UPDATE Usuarios SET nome=$1, email=$2 WHERE id=$3 ",
      [nome, email, id],
      function (err, result) {
        if (err) {
          return console.log("erro ao executar a qry de UPDATE", err);
        } else {
          res.setHeader("id", `${id}`);
          res.status(202).json({ info: `Registro atualizado. Código ${id}` });
          console.log(result);
        }
      }
    );
  } catch (error) {
    console.log(error);
  }
});

app.get("/", (req, res) => {
  console.log("Response ok.");
  res.send("Ok");
});

app.listen(config.port, () =>
  console.log("Servidor funcionando na porta " + config.port)
);
