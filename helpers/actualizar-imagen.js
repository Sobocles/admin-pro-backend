const Usuario = require('../models/usuario');
const fs = require('fs');

const Medico = require('../models/medico');
const Hospital = require('../models/hospital');

const borrarImagen = ( path ) => {
    if ( fs.existsSync( path )  ) { //SI EXISTE UNA IMAGEN QUE ESTE EN EL PATHVIEJO
        // borrar la imagen anterior
        fs.unlinkSync( path ); //SE BORRA
    }
}


const actualizarImagen = async(tipo, id, nombreArchivo) => {

    let pathViejo = '';
    
    switch( tipo ) {
        case 'medicos':
            const medico = await Medico.findById(id);
            if ( !medico ) { //la imagen no se pudo subr hubo un false
                console.log('No es un médico por id');
                return false;
            }
            //HAY QUE EVALUAR SI ESE MEDICO, HOSPITAL O USUARIO TIENE UNA IMAGEN PREVIAMENTE ASIGNADA Y SI ES ASI HAY QUE BORRARLA
            pathViejo = `./uploads/medicos/${ medico.img }`;
            borrarImagen( pathViejo ); //SI EL PATH NO EXISTE, OSEA NO HAY NADA EN EL medico.img

            medico.img = nombreArchivo; //SE LE ASIGNA LA IMAGEN CON EL NOMBRE DEL ARCHIVO CREADO CON EL UID QUE GENERO UN NOMBRE Y LA EXTENCION DEL ARCHIVO
            await medico.save(); //SE GUARDA EN LA BASE DE DATOS
            return true;

        break;
        
        case 'hospitales':
            const hospital = await Hospital.findById(id);
            if ( !hospital ) {
                console.log('No es un hospital por id');
                return false;
            }

            pathViejo = `./uploads/hospitales/${ hospital.img }`;
            borrarImagen( pathViejo );

            hospital.img = nombreArchivo;
            await hospital.save();
            return true;

        break;
        
        case 'usuarios':

            const usuario = await Usuario.findById(id);
            if ( !usuario ) {
                console.log('No es un usuario por id');
                return false;
            }

            pathViejo = `./uploads/hospitales/${ usuario.img }`;
            borrarImagen( pathViejo );

            usuario.img = nombreArchivo;
            await usuario.save();
            return true;

        break;
    }


}



module.exports = { 
    actualizarImagen
}