
const Usuario = require('../models/usuario')
const Medico = require('../models/medico')
const Hospital = require('../models/hospital')
//GET TODO

const getTodo = async(req, res = response ) => {

    const busqueda = req.params.busqueda; //se almacena lo que llega en el url luego del todo/
    const regex = new RegExp( busqueda, 'i' ); //expresion REGULAR SE LE PASA LO QUE SE BUSCA Y UNA I QUE SIMBOLIZA QUE DEBE SER MAS SENSIBLE CON LOS RESULTADOS

    const [ usuarios, medicos, hospitales ] = await Promise.all([ //LOS VALORES ENCONTRADOS SE GUARDAN EN LA DESTRUCTURACION DE ARREGLOS
        Usuario.find({ nombre: regex }),                         //DE ESTA FORMA EL AWAIT ES GENERAL PARA TODO, ES MAS RAPIDO QUE HACER AWAIT POR SEPARADO YA QUE AQUI SOLO SE ESPERA UNA VEZ
        Medico.find({ nombre: regex }),
        Hospital.find({ nombre: regex }),
    ])


    res.json({
        ok: true,
        usuarios,
        medicos,
        hospitales
    })


 }

const getDocumentosColeccion = async(req, res = response ) => {

    const tabla    = req.params.tabla;
    const busqueda = req.params.busqueda;
    const regex    = new RegExp( busqueda, 'i' );

    let data = [];

    switch ( tabla ) {
        case 'medicos':
            data = await Medico.find({ nombre: regex })
                                .populate('usuario', 'nombre img')
                                .populate('hospital', 'nombre img');
        break;

        case 'hospitales':
            data = await Hospital.find({ nombre: regex })
                                    .populate('usuario', 'nombre img');
        break;

        case 'usuarios':
            data = await Usuario.find({ nombre: regex });
            
        break;
    
        default:
            return res.status(400).json({
                ok: false,
                msg: 'La tabla tiene que ser usuarios/medicos/hospitales'
            });
    }
    
    res.json({
        ok: true,
        resultados: data
    })

}

     
 

 module.exports = {
    getTodo,
    getDocumentosColeccion 
}