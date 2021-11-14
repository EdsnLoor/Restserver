
const {response, request}=require('express');
const bcryptjs= require ('bcryptjs');
const Usuario = require('../models/usuario');


const usuariosGet = async (req=request, res=response) =>{

    //const {q,nombre='no name',apikey, limit, page=1} = req.query;
    const {limite =5, desde=0}=req.query;
    const query = {estado:true};

    const [total, usuarios] = await Promise.all ([
        Usuario.countDocuments(query),
        Usuario.find(query)
            .skip(Number(desde))
            .limit(Number(limite))
    ])

    res.json({
        total,
        usuarios

    });

};

const usuariosPost = async (req, res=response) =>{

    const {nombre, correo, password, rol}= req.body;
    const usuario = new Usuario({nombre, correo, password, rol});

    //encriptar la contrasena
    const salt = bcryptjs.genSaltSync();
    usuario.password= bcryptjs.hashSync(password, salt);
    //guardar BD
    await usuario.save();

    res.json({
        msg:'post API-controller',
        usuario
    });

};

const usuariosPut = async (req, res=response) =>{
    
    const {id} = req.params;
    const {password, google, ...resto} = req.body;

    //validar con la base de datos
    if (password){
        const salt = bcryptjs.genSaltSync();
        resto.password= bcryptjs.hashSync(password, salt);
    }
    const usuario = await Usuario.findByIdAndUpdate(id,resto);
    
    res.json(usuario);

};

const usuariosPatch = (req, res=response) =>{
    res.json({
        msg:'patch API-controller'
    });

};
const usuariosDelete = async (req, res=response) =>{
    const {id} =req.params;
    const usuario = await Usuario.findByIdAndUpdate(id, {estado:'false'} );

    res.json(usuario);

};


  module.exports={
      usuariosGet,
      usuariosPost,
      usuariosPut,
      usuariosPatch,
      usuariosDelete
  }