const {Router}=require('express');
const { check } = require('express-validator');

//const {validarCampos}= require('../middleware/validar-campos');
//const { validarJWT } = require('../middleware/validar-jwt');
//const { esAdminRol, tieneRol } = require('../middleware/validar-roles');

const {
    validarCampos, validarJWT, esAdminRol, tieneRol
}= require('../middleware')


const { usuariosGet, usuariosPut, usuariosPost, usuariosDelete, usuariosPatch } = require('../controllers/usuarios');
const { esRolValido, emailExiste, existeUsuarioId } = require('../helpers/db-validators');


const router=Router();

router.get('/', usuariosGet);

router.put('/:id',[
    check('id', 'No es un ID valido').isMongoId(),
    check ('id').custom( existeUsuarioId),
    check ('rol').custom( esRolValido),
    validarCampos
], usuariosPut);

router.post('/',[
    check('nombre','El nombre es obligartorio').not().isEmpty(),
    check('password','El password debe ser mas de 6 letras').isLength({min:6}),
    check('correo').custom(emailExiste),
    //chek('rol','No es un rol valido').isIn(['ADMIN_ROL','USER_ROL']),
    check ('rol').custom( esRolValido),
    validarCampos
], usuariosPost);

router.delete('/:id',[
    validarJWT,
    esAdminRol,
    tieneRol( 'ADMIN_ROL','ABC_ROL'),
    check('id', 'No es un ID valido').isMongoId(),
    check ('id').custom( existeUsuarioId),
    validarCampos
], usuariosDelete);

router.patch('/', usuariosPatch);

module.exports=router;
