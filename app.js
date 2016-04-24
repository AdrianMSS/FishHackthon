/**
* @descripción Módulos, archivos y servicios REST usados por el servidor
* @autor Bryan Navarro <contact@imaginexyz.com>
*/

//Módulos Necesitados
var express = require('express'), //Biblioteca para permitir servicios REST
    cookieParser = require('cookie-parser'), 
    bodyParser = require('body-parser'); //Biblioteca para manejar los datos de las solicitudes

//REST APIS
var  database = require('./database'); //Archivo donde vamos a comunicarnos con la base de datos

var app = express(); //Instancia de express
app.use(express.logger('dev')); //Método de ver los mensajes en consola
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());

app.use(express.static(__dirname + '/graphs')); //Página por defecto al ingresar al servidor

//Servicios REST permitidos
app.get('/position', database.getPositions);  //GET Positions
app.post('/position', database.newPosition); //POST Position

app.get('/state', database.getState);  //GET State
app.post('/state', database.newState); //POST State

//Redirección por defecto
app.get('*', function (req, res) {
    res.redirect('../#home', 404);
});

//Habilitar puerto de escucha para el servidor
var port = Number(process.env.PORT || 3000);
app.listen(port);
console.log('Listening on port ' + port + '...');