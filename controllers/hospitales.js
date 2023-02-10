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

const actualizarHospital = (req, res = response) =>{
    res.json({
        ok: true,
        msg: 'actualizarHospital '
    })
}

const borrarHospital = (req, res = response) =>{
    res.json({
        ok: true,
        msg: 'borrarHospital '
    })
}


module.exports = {
    getHospitales,
    crearHospital,
    borrarHospital,
    actualizarHospital
}