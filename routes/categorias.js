const {Router}= require('express');
const { check } = require('express-validator');
const { crearCategoria, 
        obtenerCategorias, 
        borrarCategoria, 
        obtenerCategoria, 
        actualizarCategoria } = require('../controllers/categorias');

const { existeCategoriaPorId } = require('../helpers/db-validators');
const { validarJWT, esAdminRol } = require('../middleware');

const { validarCampos } = require('../middleware/validar-campos');

const router = Router();

// {{url}}api/categorias

// crear categoria -  privado -  cualquier persona token valido
router.post('/',[
    validarJWT,
    check ('nombre', 'El nombre es obligatorio').not().isEmpty(),
    validarCampos
    ] ,crearCategoria);

// obtener todas las categorias -publico
router.get('/', obtenerCategorias);

// obtener una categoria por id -publico
router.get('/:id', [
    check('id', 'No es un ID valido').isMongoId(),
    check('id').custom(existeCategoriaPorId),
    validarCampos
],obtenerCategoria);

// actualizar - privado cualquiera con token valido
router.put('/:id',[
    validarJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('id').custom(existeCategoriaPorId),
    validarCampos
] ,actualizarCategoria);

// borrar categoria - admin
router.delete('/:id',[
    validarJWT,
    esAdminRol,
    check('id', 'No es un ID valido').isMongoId(),
    check('id').custom(existeCategoriaPorId),
    validarCampos
], borrarCategoria);

module.exports = router;