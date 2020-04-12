/////////////////
/////PUERTO//////
/////////////////

process.env.PORT = process.env.PORT || 3000;

/////////////////
/////ENTORNO/////
/////////////////

process.env.NODE_ENV = process.env.NODE_ENV || "dev";


/////////////////////////
//VENCIMIENTO DEL TOKEN//
/////////////////////////
// 60 s * 60 min * 24 h * 30 d

process.env.CADUCIDAD_TOKEN = 60 * 60 * 24 * 30 * 1000;

/////////////////
///////SEED//////
/////////////////

process.env.SEED = process.env.SEED || "secret-dev";

/////////////////
///ENTORNO-BD////
/////////////////

// comandos de Heroku para crear las variables de entorno
// heroku config:set MONGO_URI="XXXXXXX"
 
// heroku config:get nombre
// heroku config:unset nombre
// heroku config:set nombre="Marco"

const urlDB =
  process.env.NODE_ENV === "dev"
    ? "mongodb://localhost:27017/cafe"
    : process.env.MONGO_URI;

process.env.URL_DB = urlDB;
// process.env.URL_DB = process.env.MONGO_URI;