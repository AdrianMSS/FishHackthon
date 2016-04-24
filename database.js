/**
* @descripción Funciones relacionadas con la base de datos
* @autor Bryan Navarro <contact@imaginexyz.com>
*/

var mongo = require('mongodb'); //Biblioteca para comunicarse con la base de datos MongoDB

//Puerto de conexión con la base de datos (no es el mismo de escucha del servidor)
var uristring = 
  process.env.MONGODB_URI || 
  process.env.MONGOHQ_URL || 
  process.env.MONGOLAB_URI||
  'mongodb://localhost/Fishackathon';

var db;

//Conexión con la base de datos
mongo.MongoClient.connect(uristring, function(err, database) {
    if(!err) {
        db = database; //Instancia de la base de datos
        console.log('Connected to the "Fishackathon" database');
    }
    else{
        console.log(404, 'Error Connecting to the "Fishackathon" database');
    }
});

//Función para el manejo de la zona horaria
Date.prototype.addHours= function(h){
    this.setHours(this.getHours()+h);
    return this;
}


/* Funciones CRUD Básicas */

//GET Positions
exports.getPositions = function(req,res) {
    db.collection('Position').find({}).toArray(function(error, doc){
        if(error) {
            throw error;
            res.send(400, error);
        }
        else{
            res.send(200, doc);
        }
    });
}

//POST Positions
exports.newPosition = function(req, res) {
    var resource = req.body;
    resource['date'] = new Date().addHours(-6);
    resource['hour'] = new Date().addHours(-6).getHours();
    resource['minute'] = new Date().addHours(-6).getMinutes();
    db.collection('Ids').findAndModify({_id:1},{},{$inc:{position:1}},function(err, doc_ids) {
        if(err) {
            throw err;
            res.send(400, err);
        }
        else{
            resource["_id"] = doc_ids.value.position;
            db.collection('Position').insert(resource, function(error, doc_project){
                if(error) {
                    throw error;
                    res.send(400, error);
                }
                else{
                    res.send(200, resource);
                }
            })
        }
    });
}

//GET State
exports.getState = function(req,res) {
    db.collection('State').findOne({_id:1}, function(error, doc){
        if(error) {
            throw error;
            res.send(400, error);
        }
        else{
            res.send(200, doc);
        }
    });
}

//POST Positions
exports.newState = function(req, res) {
    var resource = {};
    resource['date'] = new Date().addHours(-6);
    resource['hour'] = new Date().addHours(-6).getHours();
    resource['minute'] = new Date().addHours(-6).getMinutes();
    resource['emergency'] = JSON.parse(req.body.emergency);
    resource['pirates'] = JSON.parse(req.body.pirates);
    db.collection('State').update({_id:1},resource,{upsert: true, new: true}, function(err, doc){
        if(err) throw err;
        res.send(200, resource);
    });
}