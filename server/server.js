require("./config/config");

const express = require("express");
const mongoose = require("mongoose");
const path = require("path");

const app = express();

const bodyParser = require("body-parser");

// app.use are middlewares
// every http request goes through these middlewares
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());
// habilitar la carpeta public
// app.use(express.static(__dirname + "../public")); 
// el codigo anerior no funciona porque solamente concatena los strings
// es necesario usar el paquete path
app.use(express.static(path.resolve(__dirname, "../public"))); 
// configuracion global de rutas
app.use(require("./routes/index"));

mongoose.connect(
  process.env.URL_DB,
  { useUnifiedTopology: true, useNewUrlParser: true },
  (err, res) => {
    if (err) throw err;
    console.log("Base de datos ONLINE");
  }
);

app.listen(process.env.PORT, () => {
  console.log("Server started on port", process.env.PORT);
});
