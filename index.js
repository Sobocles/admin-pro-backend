const { dbConnection } = require('./database/config');
require('dotenv').config();
var cors = require('cors');
express = require('express');

//crear el servidor de express
app = express();

//configurar Cors
app.use( cors());

//lectura y parseo del body
app.use( express.json() );


//Base de datos
dbConnection();

//umifRmGjVhQA9Seo
//Rutas
app.use('/api/usuarios', require('./routes/usuarios') );

app.use('/api/login', require('./routes/auth') );

app.listen( process.env.PORT,  () =>  {
    console.log('Servidor corriendo en el puerto ' + process.env.PORT )
})