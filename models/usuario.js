const { Schema, model } = require('mongoose');


const UsuarioSchema = Schema({

    nombre: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    img: {
        type: String,
    },
    role: {
        type: String,
        required: true,
        default: 'USER_ROLE'
    },
    google: {
        type: Boolean,
        default: false
    },
});

//CONFIGURACION GLOBAL DEL ESQUEMA TODOS LOS USUARIO INSTANCIADOS VAN A APASAR POR ESTA CONFIGURACION POR ESO ES GLOBAL
UsuarioSchema.method('toJSON', function() {
    const { __v, _id, password, ...object } = this.toObject(); //se esta extrayendo la version y el id que viene de la instancia del objeto
    object.uid = _id;
    return object;
})



module.exports = model( 'Usuario', UsuarioSchema );