const express = require("express");
const _ = require("underscore");

let {
  verificaToken,
  verificaAdminRole,
} = require("../middlewares/autenticacion");

let app = express();

let Producto = require("../models/producto");
let Categoria = require("../models/categoria");

// trae todos los productos
// populate para user y categoria
// paginado
app.get("/producto", (req, res) => {
  let desde = req.query.desde || 0;
  desde = Number(desde);
  let limite = req.query.limite || 5;
  limite = Number(limite);

  // el segundo argumento filtra los campos a mostrar
  Producto.find({ disponible: true })
    .skip(desde)
    .limit(limite)
    .populate("usuario", "nombre email")
    .populate("categoria", "nombre")
    .exec((err, productos) => {
      if (err) {
        return res.status(400).json({
          ok: false,
          err,
        });
      }

      Producto.countDocuments({ disponible: true }, (err, cantidad) => {
        res.json({
          ok: true,
          cantidad,
          productos,
        });
      });
    });
});

// trae uno
// populate para user y categoria
app.get("/producto/:id", (req, res) => {
  let id = req.params.id;
  Producto.findOne({ _id: id })
    .populate("usuario", "nombre email")
    .populate("categoria", "nombre")
    .exec((err, producto) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          err,
        });
      }
      if (!producto) {
        return res.status(404).json({
          ok: false,
          err: {
            message: "Producto no encontrado",
          },
        });
      }
      res.json({
        ok: true,
        producto,
      });
    });
});

// buscar productos
app.get("/producto/buscar/:termino", verificaToken, (req, res) => {
  const { termino } = req.params;

  const regex = new RegExp(termino, "i");

  Producto.find({ nombre: regex })
    .populate("categoria", "nombre")
    .exec((err, productos) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          err,
        });
      }

      res.json({
        ok: true,
        productos,
      });
    });
});

// crear un producto
// necesita grabar usuario y categoria
app.post("/producto", verificaToken, (req, res) => {
  const usuario = req.usuario._id;
  const body = req.body;

  let producto = new Producto({
    nombre: body.nombre,
    precioUni: Number(body.precioUni),
    descripcion: body.descripcion,
    categoria: body.categoria,
    usuario,
  });

  producto.save((err, productoDB) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        err,
      });
    }
    if (!productoDB) {
      return res.status(400).json({
        ok: false,
        err,
      });
    }
    res.json({ ok: true, producto: productoDB });
  });
});

// actualizar un producto
app.put("/producto/:id", verificaToken, (req, res) => {
  const id = req.params.id;
  const body = req.body;

  const productoActualizado = {
    nombre: body.nombre,
    precioUni: body.precioUni && Number(body.precioUni),
    descripcion: body.descripcion,
    disponible: body.disponible,
    categoria: body.categoria,
  };
  Producto.findByIdAndUpdate(
    id,
    productoActualizado,
    { new: true, runValidators: true },
    (err, productoDB) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          err,
        });
      }
      if (!productoDB) {
        return res.status(400).json({
          ok: false,
          err,
        });
      }
      res.json({ ok: true, producto: productoDB });
    }
  );
});

// borrar un producto
app.delete("/producto/:id", verificaToken, (req, res) => {
  const id = req.params.id;

  const productoActualizado = {
    disponible: false,
  };

  Producto.findByIdAndUpdate(
    id,
    productoActualizado,
    { new: true, runValidators: true },
    (err, productoDB) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          err,
        });
      }
      if (!productoDB) {
        return res.status(400).json({
          ok: false,
          err,
        });
      }
      res.json({ ok: true, producto: productoDB });
    }
  );
});

module.exports = app;
