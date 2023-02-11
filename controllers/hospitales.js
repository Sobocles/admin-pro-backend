const { response } = require('express');

const Hospital = require('../models/hospital');

const getHospitales = async (req, res = response) => {

    const hospitales = await Hospital.find().populate('usuario','nombre img') //te muestra los campos que quieres qe se muestren de ese usuario

    res.json({
        ok: true,
        hospitales
    })
}

const crearHospital = async(req, res = response) =>{
    
    const uid = req.uid; //iud de la persona que se autentico con nuestro token porque ya se paso por el middlewere de autenticacion de json web token
    const hospital = new Hospital({ 
        usuario: uid, ...req.body //se desestructura todos los campos que vienen en le body
    });

    try {
        
        const hospitalDB = await hospital.save(); // hospital se guarda en la base de datos con los valores del id y del objeto destructurado
        

        res.json({
            ok: true,
            hospital: hospitalDB
        });

    } catch (error) {
        console.log(error)
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        })
    }
    
 
}

const actualizarHospital = async(req, res = response) =>{

    const id = req.params.id; //ESTE ID DEL HOSPITAL SE ENVIA EN LA SOLICITUD HTTP
    const uid = req.uid; //SE TIENE ACCESO AL UID DEL USUARIO PORQUE PASAMOS POR EL JSONWEBTOKEN

    try{

        const hospital = await Hospital.findById( id );

        if( !hospital ){
            return res.status(404).json({
                ok: true,
                msg: 'Hospital no encontrado por id'
            });
        }
        //SI LO ENCONTRO EN LA BASE DE DATOS HAY QUE ACTUALIZARLO
        const cambioHospital = { //SE CREA UN OBJETO QUE ES EL HOSPITAL POR EL CUAL QUIERO CAMBIAR EL QUE YA ESTA EN LA BD CON EL ID DE USUAIRO INCLUIDO
            ...req.body,
            usuario: uid
        }

        const hospitalActualizado = await Hospital.findByIdAndUpdate( id, cambioHospital, { new: true }); //MANDO LOS PARAMETROS PARA ACTUALIZARLO

        res.json({
            ok: true,
            msg: 'actualizarHospital ',
            hospital: hospitalActualizado
        })

    } catch (error) {

        console.log(error)

        res.status(500).json({
            ok: true,
            msg: 'Error al actualizar hospital '
        })

    }

    
}

const borrarHospital = async( req, res ) => {

    const id = req.params.id;

    try {

        const hospitalDB = await Hospital.findById( id );  
       
        if ( !hospitalDB ) {                             
            return res.status(404).json({                
            ok: false,
            msg: 'No existe un hospital por ese id'
            });
        }  
        
        await Hospital.findByIdAndDelete( id );
        
        res.json({
            ok: true,
            mgs: 'Hospital eliminado'
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
    getHospitales,
    crearHospital,
    borrarHospital,
    actualizarHospital
}