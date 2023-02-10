const { Schema, model } = require('mongoose');


const MedicoSchema = Schema({

    nombre: {
        type: String,
        required: true
    },
    img: {
        type: String,
    },
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        require: true
    },
    hospital: {
        type: Schema.Types.ObjectId,
        ref: 'Hospital',
        require: true
    }
},);

//CONFIGURACION GLOBAL DEL ESQUEMA TODOS LOS USUARIO INSTANCIADOS VAN A APASAR POR ESTA CONFIGURACION POR ESO ES GLOBAL
MedicoSchema.method('toJSON', function() {
    const { __v, password, ...object } = this.toObject(); //se esta extrayendo la version y el id que viene de la instancia del objeto
    return object;
})



module.exports = model( 'Medico', MedicoSchema );