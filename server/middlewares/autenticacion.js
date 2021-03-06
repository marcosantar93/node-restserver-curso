const jwt = require("jsonwebtoken");

/////////////////////
// VERIFICAR TOKEN //
/////////////////////

const verificaToken = (req, res, next) => {
  // req.get permite obtener headers
  let token = req.get("token");

  jwt.verify(token, process.env.SEED, (err, decoded) => {
    if (err) {
      return res.status(401).json({
        ok: false,
        err,
      });
    }
    req.usuario = decoded.usuario;
    next();
  });
};

/////////////////////
// VERIFICAR ADMIN //
/////////////////////

const verificaAdminRole = (req, res, next) => {
  // req.get permite obtener headers
  const usuario = req.usuario;

  if(usuario.role !== "ADMIN_ROLE"){
    return res.status(401).json({
      ok: false,
      err: {message: "El usuario no es administrador"},
    });  
  }
  next();
};

/////////////////////////
// VERIFICAR TOKEN IMG //
/////////////////////////

// usando:
// let token = req.get("token") || req.query.token;
// podriamos tener todo en una unica funcion 
const verificaTokenImg = (req, res, next) => {
  // req.get permite obtener headers
  let token = req.query.token;

  jwt.verify(token, process.env.SEED, (err, decoded) => {
    if (err) {
      return res.status(401).json({
        ok: false,
        err,
      });
    }
    req.usuario = decoded.usuario;
    next();
  });
};


module.exports = {
  verificaToken,
  verificaAdminRole,
  verificaTokenImg
};
