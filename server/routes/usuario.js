const express = require("express");

const bcrypt = require("bcrypt");
const _ = require("underscore");

const Usuario = require("../models/usuario");
const {
  verificaToken,
  verificaAdminRole,
} = require("../middlewares/autenticacion");

const app = express();

app.get("/usuario", verificaToken, function (req, res) {
  let desde = req.query.desde || 0;
  desde = Number(desde);
  let limite = req.query.limite || 5;
  limite = Number(limite);

  const condicion = { estado: true };

  // el segundo argumento filtra los campos a mostrar
  Usuario.find(condicion, "nombre email role estado google img")
    .skip(desde)
    .limit(limite)
    .exec((err, usuarios) => {
      if (err) {
        return res.status(400).json({
          ok: false,
          err,
        });
      }

      Usuario.countDocuments(condicion, (err, cantidad) => {
        res.json({
          ok: true,
          cantidad,
          usuarios,
        });
      });
    });
});

app.post("/usuario", [verificaToken, verificaAdminRole], function (req, res) {
  let body = req.body;

  let usuario = new Usuario({
    nombre: body.nombre,
    email: body.email,
    password: bcrypt.hashSync(body.password, 10),
    role: body.role,
  });

  usuario.save((err, usuarioDB) => {
    if (err) {
      return res.status(400).json({
        ok: false,
        err,
      });
    }

    // usuarioDB.password = null;

    res.json({ ok: true, usuario: usuarioDB });
  });
});

app.put("/usuario/:id", [verificaToken, verificaAdminRole], function (req, res) {
  let id = req.params.id;
  let body = _.pick(req.body, ["nombre", "email", "img", "role", "estado"]);

  // el tercer parametro es un objeto de opciones para la operacion
  // new: indica que debe retornar el nuevo registro modificado
  // runValidarors: ejecuta las validaciones sobre el registro

  Usuario.findByIdAndUpdate(
    id,
    body,
    { new: true, runValidators: true },
    (err, usuarioDB) => {
      if (err) {
        return res.status(400).json({
          ok: false,
          err,
        });
      }
      res.json({ ok: true, usuario: usuarioDB });
    }
  );
});

app.delete("/usuario/:id", [verificaToken, verificaAdminRole], function (req, res) {
  let id = req.params.id;

  const nuevoEstado = { estado: false };

  Usuario.findByIdAndUpdate(
    id,
    nuevoEstado,
    { new: true },
    (err, usuarioDB) => {
      if (err) {
        return res.status(400).json({
          ok: false,
          err,
        });
      }
      res.json({ ok: true, usuario: usuarioDB });
    }
  );

  // Usuario.findByIdAndRemove(id, (err, usuarioBorrado) => {
  //   if (err) {
  //     return res.status(400).json({
  //       ok: false,
  //       err
  //     });
  //   }
  //   if (!usuarioBorrado) {
  //     return res.status(400).json({
  //       ok: false,
  //       err: {
  //         message: "Usuario no encontrado"
  //       }
  //     });
  //   }

  //   res.json({ ok: true, usuario: usuarioBorrado });
  // });
});

module.exports = app;
