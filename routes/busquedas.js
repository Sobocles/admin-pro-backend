/*
    ruta: api/todo/:busqueda
*/

const { Router } = require('express');
const { validarJWT } = require('../middlewares/validar-jwt')

const { getTodo, getDocumentosColeccion } = require('../controllers/busquedas');

const router = Router();

router.get('/:busqueda', validarJWT , getTodo ); //BUSQUEDA ES LO QUE VIENE EN EL URL COMO EL :ID
router.get('/coleccion/:tabla/:busqueda', validarJWT , getDocumentosColeccion );

module.exports = router;