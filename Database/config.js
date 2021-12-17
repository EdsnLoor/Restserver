const mongoose = require('mongoose');

const dbConnection = async ()=>{

    mongoose.connect(process.env.MONGODB_CNN,{
 
        useNewUrlParser: true,
        useUnifiedTopology: true
 
    })
    .then(()=> console.log('base de datos ONLINE'))
    .catch(err => console.log('No se pudo conectar',err));


}

module.exports= {
    dbConnection
}