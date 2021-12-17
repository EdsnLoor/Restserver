const {Router}=require('express');
const { check } = require('express-validator');
const { cargarArchivo, mostrarImagen, actualizarImagenCloudinary } = require('../controllers/uploads');
const { coleccionesPermitidas } = require('../helpers');
const { validarArchivoSubir , validarCampos} = require('../middleware');

const router = Router();

router.post('/', cargarArchivo)

router.put('/:coleccion/:id',[
    validarArchivoSubir,
    check('id', 'El id debe ser de mongo').isMongoId(),
    check('coleccion').custom(c=>coleccionesPermitidas(c,['usuarios','productos'])),
    validarCampos
],actualizarImagenCloudinary);

router.get('/:coleccion/:id',[
    check('id', 'El id debe ser de mongo').isMongoId(),
    check('coleccion').custom(c=>coleccionesPermitidas(c,['usuarios','productos'])),
    validarCampos
], mostrarImagen)

module.exports = router;
