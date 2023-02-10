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
app.use('/api/hospitales', require('./routes/hospitales') );
app.use('/api/medicos', require('./routes/medicos') );
app.use('/api/todo', require('./routes/busquedas') );
app.use('/api/login', require('./routes/auth') );
app.use('/api/upload', require('./routes/uploads') );

app.listen( process.env.PORT,  () =>  {
    console.log('Servidor corriendo en el puerto ' + process.env.PORT )
})