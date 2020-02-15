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

const urlDB =
  process.env.NODE_ENV === "dev"
    ? "mongodb://localhost:27017/cafe"
    : "mongodb+srv://marco:MO9Q93w4xwL7Bojb@cluster0-psgq0.mongodb.net/cafe";

process.env.URL_DB = urlDB;
// process.env.URL_DB = "mongodb+srv://marco:MO9Q93w4xwL7Bojb@cluster0-psgq0.mongodb.net/cafe";