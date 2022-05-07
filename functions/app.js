// Made by Emerson Cole Philipp
// 
// "their" stuff
const path = require ('path');
const express = require('express');
const {engine} = require('express-handlebars');
const sessions = require('express-session');
const dotenv = require('dotenv').config({path: path.join(__dirname,'../private/.env')})

// my stuff :] (its way cooler)
const connect = require('./connect');
const route_signup = require("./routes/signup");
const route_login = require("./routes/login");
const route_browse = require("./routes/browse")
const base62 = require('./my_modules/base62');

var nodemailer = require('./mailer.js');

//express app object
const app = express();

//variables throughout 


//connect to the database and then start the application
connect.connectToServer( function( error, client ) {
	if (error) {
		console.log(error);
	}
  
  //start the app regardless if we can connect to the database.

  init();
});


//initialize express app settings/engines
async function init(){

	app.use(sessions({
	    secret: process.env.SESSION_SECRET,
	    saveUninitialized:true,
	    cookie: { maxAge: 1000 * 60 * 60 * 24 },
     resave: true
	}));
	
	app.use(express.static( './public'));
	app.use(express.json({limit: '20mb'}));
	app.use(express.urlencoded({ extended: false, limit: '20mb' }));

	app.set('port', (process.env.PORT || 5000));

	app.engine( 'hbs', engine( { 
		extname: 'hbs', 
		defaultLayout: "main" ,
		partialsDir: path.join(__dirname, '../views/partials/')
	} ) );
	app.set("view engine", "hbs") ;
	app.set("views",path.join(__dirname, '../views/'));

	init_routes();

}


// initialize all direct routes and middleware
async function init_routes(){
	
	// HOME
	app.get('/', (req , res) => {
			res.render( 'index', {'user' : req.session.user});

	});

	//the complex route stuff is in these 'route' modules:)
	app.use('/signup', route_signup);
	app.use('/login', route_login);
	app.use('/g', route_browse);
	app.all('/logout', (req,res)=>{
    req.session.destroy();
    res.redirect('/login');
	});

	app.get('/account', (req , res) => {
		if(!req.session.user){
			res.redirect('/login');
			return;
		}

		res.render( 'account', {'user' : req.session.user});
	});

	app.get('/grade', (req , res) => {
		res.render( 'grade', {'user' : req.session.user});
	});

	app.get('/grading', (req , res) => {
		res.render( 'grading', {'user' : req.session.user});
	});

	app.get('/set', (req , res) => {
		res.render( 'set', {'user' : req.session.user});
	});

	app.get('*', function(req, res){
  res.status(404).render("404", {url: req.url});
});
	app.listen(app.get('port'), '192.168.0.110', function() {
		console.log("Node app is running at localhost:" + app.get('port'))
	});
}

