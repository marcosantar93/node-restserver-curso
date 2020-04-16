const express = require("express");
const _ = require("underscore");

let {
  verificaToken,
  verificaAdminRole,
} = require("../middlewares/autenticacion");

let app = express();

let Categoria = require("../models/categoria");

// Mostrar todas las categorias
app.get("/categoria", (req, res) => {
  Categoria.find({})
    .sort("nombre")
    .populate("usuario", "nombre email")
    .exec((err, categorias) => {
      if (err) {
        return res.status(400).json({
          ok: false,
          err,
        });
      }
      Categoria.countDocuments({}, (err, cantidad) => {
        if (err) {
          return res.status(400).json({
            ok: false,
            err,
          });
        }
        res.json({
          ok: true,
          cantidad,
          categorias,
        });
      });
    });
});

// Mostrar una categoria especifica
app.get("/categoria/:id", (req, res) => {
  // Categoria.findById(...)
  let id = req.params.id;
  Categoria.findOne({ _id: id }, (err, categoria) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        err,
      });
    }
    if (!categoria) {
      return res.status(404).json({
        ok: false,
        err: {
          message: "Categoria no encontrada",
        },
      });
    }
    res.json({
      ok: true,
      categoria,
    });
  });
});

// Crear nueva categoria
app.post("/categoria", [verificaToken, verificaAdminRole], (req, res) => {
  // Regresa la nueva categoria
  const usuario = req.usuario._id;
  const body = req.body;
  let categoria = new Categoria({
    nombre: body.nombre,
    usuario,
  });

  categoria.save((err, categoriaDB) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        err,
      });
    }
    if (!categoriaDB) {
      return res.status(400).json({
        ok: false,
        err,
      });
    }
    res.json({ ok: true, categoria: categoriaDB });
  });
});

// Actualiza una categoria
app.put("/categoria/:id", [verificaToken, verificaAdminRole], (req, res) => {
  let id = req.params.id;
  let body = _.pick(req.body, ["nombre"]);

  Categoria.findByIdAndUpdate(
    id,
    body,
    { new: true, runValidators: true },
    (err, categoriaDB) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          err,
        });
      }
      if (!categoriaDB) {
        return res.status(400).json({
          ok: false,
          err,
        });
      }
      res.json({ ok: true, categoria: categoriaDB });
    }
  );
});

// Borra una categoria
app.delete("/categoria/:id", [verificaToken, verificaAdminRole], (req, res) => {
  // solo un admin puede borrarlo
  // Categoria.findByIdAndRemove()
  let id = req.params.id;
  Categoria.findByIdAndRemove(id, (err, categoriaBorrada) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        err,
      });
    }
    if (!categoriaBorrada) {
      return res.status(400).json({
        ok: false,
        err: {
          message: "Categoria no encontrada",
        },
      });
    }

    res.json({ ok: true, Categoria: categoriaBorrada });
  });
});

module.exports = app;
