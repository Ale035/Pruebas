const express = require('express');
const router = express.Router();
const sqlite3=require('sqlite3').verbose();
const path = require('path');
const geoip = require('geoip-lite');


const basededatos=path.join(__dirname,"basededatos","basededatos.db");
const bd=new sqlite3.Database(basededatos, err =>{ 
if (err){
	return console.error(err.message);
}else{
	console.log("...");
}
})


const create="CREATE TABLE IF NOT EXISTS contactos(email VARCHAR(20),nombre VARCHAR(20), comentario TEXT,fecha DATATIME,ip TEXT, pais VARCHAR(15));";

bd.run(create,err=>{
	if (err){
	return console.error(err.message);
}else{
	console.log("...");
}
})


router.get('/contactos',(req,res)=>{
	const sql="SELECT * FROM contactos;";
	bd.all(sql, [],(err, rows)=>{
			if (err){
				return console.error(err.message);
			}else{
			res.render("contactos.ejs",{tarea:rows});
			}
	})
})





router.post('/',(req,res)=>{
  	var hoy = new Date();
  	var horas = hoy.getHours();
  	var minutos = hoy.getMinutes();
  	var segundos = hoy.getSeconds();
  	var hora = horas + ':' + minutos + ':' + segundos + ' ';
  	var fecha = hoy.getDate() + '-' + ( hoy.getMonth() + 1 ) + '-' + hoy.getFullYear() + '//' + hora;
	  var ip = req.headers["x-forwarded-for"];
  	if (ip){
    var list = ip.split(",");
    ip= list[list.length-1];
 	 } else {
	  ip = req.connection.remoteAddress;
  	}
	var geo = geoip.lookup("207.97.227.239");
	console.log(geo);
	var pais = geo.country;
	const sql="INSERT INTO contactos(nombre, email, comentario, fecha ,ip, pais) VALUES (?,?,?,?,?,?)";
	const nuevos_mensajes=[req.body.nombre, req.body.email, req.body.comentario,fecha,ip,pais];
	bd.run(sql, nuevos_mensajes, err =>{
	if (err){
		return console.error(err.message);
	}
	else{
		res.redirect("/");
		}
	})
});


router.get('/',(req,res)=>{
	res.render('index.ejs',{tarea:{}})
});



module.exports = router;








