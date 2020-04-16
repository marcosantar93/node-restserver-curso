const express = require("express");
const fileUpload = require("express-fileupload");
const app = express();
const Usuario = require("../models/usuario");
const Producto = require("../models/producto");
const fs = require("fs");
const path = require("path");

// default options
app.use(fileUpload({ useTempFiles: true }));

app.put("/upload/:tipo/:id", function (req, res) {
  const { tipo, id } = req.params;

  if (!req.files || Object.keys(req.files).length === 0) {
    return res
      .status(400)
      .json({ ok: false, err: { message: "No files were uploaded." } });
  }

  const tiposValidos = ["usuarios", "productos"];

  if (!tiposValidos.includes(tipo)) {
    return res.status(400).json({
      ok: false,
      err: {
        message: "Los tipos permitidos son " + tiposValidos.join(", "),
        tipo,
      },
    });
  }

  // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
  let archivo = req.files.archivo;
  const nombreCortado = archivo.name.split(".");
  const extension = nombreCortado[nombreCortado.length - 1];

  // Extensiones permitidas
  const extensionesValidas = ["png", "jpg", "jpeg", "gif"];
  if (!extensionesValidas.includes(extension)) {
    return res.status(400).json({
      ok: false,
      err: {
        message:
          "Las extensiones permitidas son " + extensionesValidas.join(", "),
        ext: extension,
      },
    });
  }

  // Cambiar nombre al archivo
  let nuevoNombreArchivo = `${id}-${new Date().getMilliseconds()}.${extension}`;

  // Use the mv() method to place the file somewhere on your server
  archivo.mv(`uploads/${tipo}/${nuevoNombreArchivo}`, (err) => {
    if (err) {
      return res.status(500).json({ ok: false, err });
    }

    // La img se cargo
    switch (tipo) {
      case "usuarios":
        imagenUsuario(id, res, nuevoNombreArchivo);
        break;
      case "productos":
        imagenProducto(id, res, nuevoNombreArchivo);
        break;
      default:
        break;
    }
  });
});

function imagenUsuario(id, res, nombreArchivo) {
  Usuario.findById(id, (err, usuarioDB) => {
    if (err) {
      borrarArchivo(nombreArchivo, "usuarios");
      return res.status(500).json({ ok: false, err });
    }
    if (!usuarioDB) {
      borrarArchivo(nombreArchivo, "usuarios");
      return res
        .status(500)
        .json({ ok: false, err: { message: "Usuario no existe" } });
    }
    borrarArchivo(usuarioDB.img, "usuarios");

    usuarioDB.img = nombreArchivo;
    usuarioDB.save((err, usuarioGuardado) => {
      res.json({
        ok: true,
        usuario: usuarioGuardado,
        img: nombreArchivo,
      });
    });
  });
}

function imagenProducto(id, res, nombreArchivo) {
  Producto.findById(id, (err, productoDB) => {
    if (err) {
      borrarArchivo(nombreArchivo, "productos");
      return res.status(500).json({ ok: false, err });
    }
    if (!productoDB) {
      borrarArchivo(nombreArchivo, "productos");
      return res
        .status(500)
        .json({ ok: false, err: { message: "producto no existe" } });
    }
    borrarArchivo(productoDB.img, "productos");

    productoDB.img = nombreArchivo;
    productoDB.save((err, productoGuardado) => {
      res.json({
        ok: true,
        producto: productoGuardado,
        img: nombreArchivo,
      });
    });
  });
}

function borrarArchivo(nombreImagen, tipo) {
  const pathImagen = path.resolve(
    __dirname,
    `../../uploads/${tipo}/${nombreImagen}`
  );
  if (fs.existsSync(pathImagen)) {
    fs.unlinkSync(pathImagen);
  }
}

module.exports = app;
