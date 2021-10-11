const mongoose = require('mongoose');

require('dotenv').config({path:'variables.env'});

const conectarDB= async  ()=> {
try {
    await mongoose.connect(process.env.DB_MONGO, {
        useNewUrlParser:true,
        useUnifiedTopology:true,
         
    })
    console.log('HOla');
} catch (error) {
    console.log(error);
    process.exit(1); //* Esto lo que hace es que en caso de que haya un error detenga la app
}
}


module.exports = conectarDB
