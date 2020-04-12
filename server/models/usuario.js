const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

mongoose.set('useCreateIndex', true);

let rolesValidos = {
  values: ["ADMIN_ROLE", "USER_ROLE"],
  message: "{VALUE} no es un rol válido"
}

let Schema = mongoose.Schema;

// un modelo es un objeto que nos permite realizar 
// operaciones CRUD ya creadas por el equipo de mongoose 
// y funciones personalizadas nuestras

let usuarioSchema = new Schema({
  nombre: {
    type: String,
    required: [true, "El nombre es necesario"]
  },
  email: {
    type: String,
    unique: true,
    required: [true, "El correo es necesario"]
  },
  password: {
    type: String,
    required: [true, "El password es obligatorio"]
  },
  img: {
    type: String,
    required: false
  },
  role: {
    type: String,
    default: "USER_ROLE",
    enum: rolesValidos
  },
  estado: {
    type: Boolean,
    default: true
  },
  google: {
    type: Boolean,
    default: false
  }
});

usuarioSchema.methods.toJSON = function () {
  let userObject = this.toObject(); // crea una copia del objeto
  delete userObject.password;
  return userObject;
}

// especificamos un mensaje mas user friendly
usuarioSchema.plugin( uniqueValidator, {message: "{PATH} debe ser único"} );

module.exports = mongoose.model("Usuario", usuarioSchema)