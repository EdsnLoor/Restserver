const {Router}= require('express');
const { check } = require('express-validator');
const { crearProducto, 
        obtenerProductos, 
        obtenerProducto,   
        actualizarProducto, 
        borrarProducto } = require('../controllers/productos');

const { existeCategoriaPorId, existeProductoPorId } = require('../helpers/db-validators');
const { validarJWT, esAdminRol } = require('../middleware');

const { validarCampos } = require('../middleware/validar-campos');

const router = Router();

// crear producto -  privado -  cualquier persona token valido
router.post('/',[
    validarJWT,
    check ('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check ('categoria', 'No es un Id valido').isMongoId(),
    check ('categoria').custom(existeCategoriaPorId),
    validarCampos
    ] ,crearProducto);

// obtener todos los productos -publico
router.get('/', obtenerProductos);


// obtener un producto por id -publico
router.get('/:id', [
    check('id', 'No es un ID valido').isMongoId(),
    check('id').custom(existeProductoPorId),
    validarCampos
],obtenerProducto);

// actualizar - privado cualquiera con token valido
router.put('/:id',[
    validarJWT,
    check ('categoria', 'No es un Id valido').isMongoId(),
    check('id').custom(existeProductoPorId),
    validarCampos
] ,actualizarProducto);

// borrar producto - admin
router.delete('/:id',[
    validarJWT,
    esAdminRol,
    check('id', 'No es un ID valido').isMongoId(),
    check('id').custom(existeProductoPorId),
    validarCampos
], borrarProducto);

module.exports = router;