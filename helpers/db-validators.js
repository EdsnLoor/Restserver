const Role = require ('../models/rol');
const usuario = require('../models/usuario');


const esRolValido = async (rol='') =>{
    const existeRol = await Role.findOne({rol});
    if(!existeRol){
        throw new Error (`El rol ${rol}  no esta registrado en la BD`)
    }
}

//verificar si el correo existe
const emailExiste = async (correo='')=>{
    const existeEmail = await usuario.findOne({correo});
    if (existeEmail){
        throw new Error(`El correo: ${correo} ya esta registrado`)
    }
}

const existeUsuarioId = async (id)=>{
    const existeUsuario= await usuario.findById(id);
    if (!existeUsuario){
        throw new Error(`El id: ${id} no existe`)
    }
}


module.exports = {
    esRolValido,
    emailExiste,
    existeUsuarioId
}