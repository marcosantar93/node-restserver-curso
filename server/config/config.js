/////////////////
/////PUERTO//////
/////////////////

process.env.PORT = process.env.PORT || 3000;

/////////////////
/////ENTORNO/////
/////////////////

process.env.NODE_ENV = process.env.NODE_ENV || "dev";

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