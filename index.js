const { dbConnection } = require('./database/config');
require('dotenv').config();
var cors = require('cors');

express = require('express');

//crear el servidor de express
app = express();

//configurar Cors
app.use( cors());

//Base de datos
dbConnection();

//umifRmGjVhQA9Seo

app.get('/', ( req, res) => {
    res.status(400).json({
        ok: true,
        msg: 'Hola mundo'
    });
});

app.listen( process.env.PORT,  () =>  {
    console.log('Servidor corriendo en el puerto ' + process.env.PORT )
})