
const Usuario = require('../models/usuario')
const bcrypt = require('bcryptjs');

const getUsuarios = async(req, res) => {

    const usuarios = await Usuario.find({}, 'nombre email role google');

    res.json({
        ok: true,
        usuarios,
        uid: req.uid
    });


}

const crearUsuario = async(req, res  ) => {
    
    const { email, password, nombre } = req.body;

    try{
        const existeEmail = await Usuario.findOne({ email });

        if ( existeEmail ) {
            return res.status(400).json({
                ok: false,
                msg: 'El correo ya está registrado'
            });
        }
    

    const usuario = new Usuario( req.body ); //creamos el usuario despues de que validamos que el usuario ingresado por el cliente no existE EN LA BASE DE DATOS!!

    // Encriptar contraseña
    const salt = bcrypt.genSaltSync();
    usuario.password = bcrypt.hashSync( password, salt );

    await usuario.save();

            // Generar el TOKEN - JWT
            const token = await generarJWT( usuario.id );

    //MENSAJE DE QUEE EL USUARIO YA FUE CREADO!!!
    res.json({ //
        ok: true,
        usuario
    });
    
    } catch ( error ) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado... revisar logs'
        });
    }

}

const actualizarUsuario = async (req, res ) => {

    // TODO: Validar token y comprobar si es el usuario correcto

    const uid = req.params.id;

    try {   
        const usuarioDB = await Usuario.findById( uid );  //La función primero extrae el ID del usuario a partir de la URL de la solicitud. Luego, usa el ID 
                                                          //para buscar un usuario en la base de datos con la función findById(). Si no se encuentra un 
        if ( !usuarioDB ) {                               //usuario con ese ID, se devuelve una respuesta con un código de estado 404 y un mensaje
            return res.status(404).json({                 //que indica que no existe un usuario con ese ID.
                ok: false,
                msg: 'No existe un usuario por ese id'
            });
        }

        //Actualizaciones
        //Si se encuentra un usuario, se extraen los campos actualizados del cuerpo de la solicitud.
        const { password, google, email, ...campos } = req.body; //CON ESTO YA NO VIENEN LA PASSWORD Y GOOGLE Y EMAIL EN CAMPOS

        if( usuarioDB.email != email ){   //SI EL EMAIL DE LA BD Y EL EMAIL DEL ID DEL USUARIO NO SON IGUALES QUIERE DECIR QUE EL USUARIO ESTA TRATANDO DE CAMBIAR TAMBIEN EL EMAIL 
            const existeEmail = await Usuario.findOne({ email }); //POR LO TANTO SE TIENE QUE VERIFICAR QUE OTRO USUARIO YA INGRESADO EN LA BASE DE DATOS NO TENGA ESE MISMO EMAIL QUE SE INTENTA MODIFICAR PARA QUE DE ESTA FORMA NO HAYAN EMAILS REPETIDOS
            if ( existeEmail ){ //SI EXISTE EMAIL NO PERMITE LA MODIFICACION
                return res.status(400).json({
                    ok: false,
                    msg: 'Ya existe un usuario con ese email'
                })
            }

        }

        campos.email = email; //SI EL USUARIO NO TRATABA DE CAMBIAR EL EMAIL SE INCLUYE EN CAMPOS PARA PODER MOSTRALO
        const usuarioActualizado = await Usuario.findByIdAndUpdate( uid, campos, { new: true } ); //ACA SE ACTUALIZA EL USUARIO SE NECESITA EL ID DEL USUARIO QUE SE QUIERE ACTUALIZAR Y LOS CAMPOS QUE SE MODIFICARAN

        res.json({
            ok: true,
            usuario: usuarioActualizado
        });

        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado'
        })
    }

}

const borrarUsuario = async( req, res ) => {

    const uid = req.params.id;

    try {

        const usuarioDB = await Usuario.findById( uid );  
       
        if ( !usuarioDB ) {                             
            return res.status(404).json({                
            ok: false,
            msg: 'No existe un usuario por ese id'
            });
        }  
        
        await Usuario.findByIdAndDelete( uid );
        
        res.json({
            ok: true,
            uid
        })


    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado'
        })
    }

}


module.exports = {
    getUsuarios,
    crearUsuario,
    actualizarUsuario,
    borrarUsuario

}