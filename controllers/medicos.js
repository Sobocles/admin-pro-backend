const { response } = require('express');

const Medico = require('../models/medico');

const getMedicos = async(req, res = response) => {

    const medicos = await Medico.find()
                                .populate('usuario','nombre img')
                                .populate('hospital','nombre img')


    res.json({
        ok: true,
        medicos
    })
}

const crearMedico = async (req, res = response) => {

    const uid = req.uid;
    const medico = new Medico({
        usuario: uid,
        ...req.body
    });


    try {

        const medicoDB = await medico.save();

        
        res.json({
            ok: true,
            medico: medicoDB
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        })
    }


}

const actualizarMedico = async(req, res = response) =>{

    const id = req.params.id; //ESTE ID DEL MEDICO SE ENVIA EN LA SOLICITUD HTTP
    const uid = req.uid; //SE TIENE ACCESO AL UID DEL USUARIO PORQUE PASAMOS POR EL JSONWEBTOKEN

    try{

        const medico = await Medico.findById( id );

        if( !medico ){
            return res.status(404).json({
                ok: true,
                msg: 'medico no encontrado por id'
            });
        }
        //SI LO ENCONTRO EN LA BASE DE DATOS HAY QUE ACTUALIZARLO
        const cambioMedico = { //SE CREA UN OBJETO QUE ES EL HOSPITAL POR EL CUAL QUIERO CAMBIAR EL QUE YA ESTA EN LA BD CON EL ID DE USUAIRO INCLUIDO
            ...req.body,
            usuario: uid
        }

        const MedicoActualizado = await Medico.findByIdAndUpdate( id, cambioMedico, { new: true }); //MANDO LOS PARAMETROS PARA ACTUALIZARLO

        res.json({
            ok: true,
            msg: 'medico Actualizado ',
            medico: MedicoActualizado
        })

    } catch (error) {

        console.log(error)

        res.status(500).json({
            ok: true,
            msg: 'Error al actualizar medico '
        })

    }

    
}

const borrarMedico = async (req, res = response) => {
   
    const id  = req.params.id;

    try {
        
        const medico = await Medico.findById( id );

        if ( !medico ) {
            return res.status(404).json({
                ok: true,
                msg: 'Medico no encontrado por id',
            });
        }

        await Medico.findByIdAndDelete( id );

        res.json({
            ok: true,
            msg: 'Médico borrado'
        }); 

    } catch (error) {

        console.log(error);

        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        })
    }

}



module.exports = {
    getMedicos,
    crearMedico,
    actualizarMedico,
    borrarMedico
}