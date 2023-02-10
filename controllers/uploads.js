
const path = require('path');
const fs = require('fs');
const { response } = require('express');
const { v4: uuidv4 } = require('uuid');
const { actualizarImagen } = require('../helpers/actualizar-imagen');


const fileUpload = ( req, res = response ) => {

    const tipo = req.params.tipo;
    const id = req.params.id; //Se necesita el id de hospital medico usuario que se quiera actualizar su imagen

    //Validar tipo

    const tiposValidos = ['hospitales', 'medicos','usuarios']; //Se valida que el tipo que llega en la peticion sea los del arreglo
    if( !tiposValidos.includes(tipo) ){ //se compara y si no es ninguno de los tipos del arreglo se manda el mensaje
        return res.status(400).json({
            ok: false,
            msg: 'No es un medico, usuario u hospital (tipo)'
        });
    }
    //VALIDAR QUE EXISTA UN ARCHIVO
    if (!req.files || Object.keys(req.files).length === 0) { //si no existe ningun archivo o si en el request file no viene nada
        return res.status(400).json({
            ok: false,
            msg: 'No hay ningun archivo'
        });
      }   

      // Procesar la imagen que se envia del front-end
    const file = req.files.imagen;

    const nombreCortado = file.name.split('.'); /*La línea del código corta el nombre 
                                                del archivo en un array de partes, separadas por el punto.
                                                 Por ejemplo, si el nombre del archivo es "wolverine.1.3.jpg"
                                                , el array resultante será ['wolverine', '1', '3', 'jpg']. */
    const extensionArchivo = nombreCortado[ nombreCortado.length - 1 ]; //luego se le saca el largo que es 4, y para acceder a jpg que es la tercerap posicion se le resta -1 (ya que el arreglo empieza en 0)
    
    // Validar extension
    const extensionesValidas = ['png','jpg','jpeg','gif']; //Se segura que la extencion del archivo sea la especificada en el arreglo
    if ( !extensionesValidas.includes( extensionArchivo ) ) {
        return res.status(400).json({
            ok: false,
            msg: 'No es una extensión permitida'
        });
    }

    // Generar el nombre del archivo
    const nombreArchivo = `${ uuidv4() }.${ extensionArchivo }`; //el uuidv4 le pone nombre al archivo  luego se le pone la extencion rxtraida anteriormente al final para que quede dlñawjfjflñajwfwjf.jpg

    // Path para guardar la imagen
    const path = `./uploads/${ tipo }/${ nombreArchivo }`; //Se asigan la ruta de forma dinamica en la carpera uploads con las variables conseguidas anteriormente

        // Mover la imagen
        file.mv( path , (err) => { //SE LE PONE EL PATH CONSEGUIDO ANTERIORMENTE PARA MOVER LA IMAGEN A ESA RUTA
            if (err){
                console.log(err)
                return res.status(500).json({
                    ok: false,
                    msg: 'Error al mover la imagen'
                });
            }

            //actualizar la base de datos
            actualizarImagen( tipo, id, nombreArchivo )
    
    
            res.json({
                ok: true,
                msg: 'Archivo subido',
                nombreArchivo
            });
        });

}

const retornaImagen = ( req, res = response ) => {

    const tipo = req.params.tipo;
    const foto = req.params.foto;

    const pathImg = path.join( __dirname, `../uploads/${ tipo }/${ foto }` );

    // imagen por defecto
    if ( fs.existsSync( pathImg ) ) {
        res.sendFile( pathImg );
    } else {
        const pathImg = path.join( __dirname, `../uploads/no-img.png` );
        res.sendFile( pathImg );
    }

}

module.exports = {
    fileUpload,
    retornaImagen
}