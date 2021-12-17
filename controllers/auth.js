const { response, json } = require("express");
const bcryptjs = require ('bcryptjs');
const Usuario= require ('../models/usuario');
const { validationResult, body } = require("express-validator");
const { generarJWT } = require("../helpers/generar-jwt");
const { googleVerify } = require("../helpers/google-verify");

const login = async (req, res=response)=>{

    const {correo , password }=req.body;
    try {

        //verificar si el email existe
        const usuario= await Usuario.findOne({correo});
        if(!usuario){
            return res.status (400).json ({
                msg: 'Usuario/ Password no son correctos - correo'
            });
        }

        //verificar si el usuario esta activo
        if(!usuario.estado ){
            return res.status (400).json ({
                msg: 'Usuario/ Password no son correctos - estado:false'
            });
        }
        // verificar la contrasena
        const validPassword = bcryptjs.compareSync(password, usuario.password);
        if (!validPassword ){
            return res.status (400).json({
                msg: 'Usuario/ Password no son correctos - password'
            });
        }

        //generar el JWT
        const token = await generarJWT(usuario.id);

        res.json({
        usuario,
        token

        })
    } catch (error) {
        console.log(error)
        return res.status (500).json({
            msg: 'Hable con el administrador'
        });
    }
    
}

const googleSingIn = async (req,res=response)=>{
    const {id_token}=req.body;

    try {
        const googleUser = await googleVerify(id_token);
        
        
        //console.log(id_token);
        
        let usuario =await Usuario.findOne ({email:googleUser.email});
        
        if (!usuario){
            // tengo que crear usuario
            const data ={
                correo: googleUser.email,
                nombre: googleUser.name,
                password: ':P',
                img: googleUser.picture,
                rol: 'ADMIN_ROLE',
                google: true
            };
            
            
            usuario = new Usuario ( data );
            await usuario.save();
            
        }
        
        // si el usuario en DB
        if (!usuario.estado){
            return res.status(401).json({
                msg: 'Hable con el administrador, usuario bloqueado'
            });
        }
        
        //generar el JWT
        const token = await generarJWT (usuario.id);
        
        res.json ({
            usuario,
            token
        });

    } catch (error) {
        console.log(error);
        res.status(400).json({
            msg: 'Token de google no es valido'
        })
    }
    
}

module.exports={
    login,
    googleSingIn
}