const express = require("express");
const dotenv = require('dotenv');
const path = require('path');
const mysql = require("mysql");
const session = require('express-session');
const bodyParser = require('body-parser');
const passport= require('passport');
const flash = require('express-flash')
const app = express();
const publicDirectory = path.join(__dirname, './views');

/*-----On configure maintenant le Port de Listening au 3300-----*/

app.listen(3300, () => {
	console.log('Your localhosting Server is now listening to Port: 3300');
});


/*-----ici la configuration de la connexion à la base des données MYSQL----*/

dotenv.config({path: './.env'});

const db = mysql.createConnection({
	host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE
}); 


/*-----Maintenant on spécefie les modules et les paramètres que notre app utilisera-----*/

app.use(
	session({
		secret: process.env.SESSION_SECRET,
		resave: false,
		saveUninitialized: false
	})
);
app.use(express.static('public'));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());
app.use(express.static(publicDirectory));
app.use(express.urlencoded({ extended: false}));
app.use(express.json());
app.use(session({ secret: 'secret', resave: true, saveUninitialized: true }));
app.use(express.static('views/css'));



app.set('view engine', 'ejs');

db.connect( (error) =>{
    if(error){
        console.log(error)
    } else {
        console.log("MYSQL Database is now connected!")
    }
});

app.get("/", (req,res) =>{
	res.render("index");
 
});

app.get("/login-st", (req,res) =>{
    res.render("login-st");
});

app.get("/login-prof", (req,res) =>{
    res.render("login-prof");
});
app.get("/login-admin", (req,res) =>{
    res.render("login-admin");
});




app.post('/login-st', function(request, response) {
	
	let errors = [];

	var email = request.body.email;
	var password = request.body.password;
	if (email && password) {
		db.query('SELECT * FROM users WHERE email = ? AND password = ?', [email, password], function(error, results, fields) {
			if (results.length > 0) {
				request.session.loggedin = true;
				request.session.email = email;
				response.render("home-st");
			} else {
				errors.push({ message: "Wrong Password / email,  try again!" });
				response.render("login-st", { errors});
			}			
			response.end(); 
		});
	} else {
		response.send('Please enter Username and Password!');
		response.end();
	}
});

app.post('/login-prof', function(request, response) {
	
	let errors = [];

	var email = request.body.email;
	var password = request.body.password;
	if (email && password) {
		db.query('SELECT * FROM users WHERE email = ? AND password = ?', [email, password], function(error, results, fields) {
			if (results.length > 0) {
				request.session.loggedin = true;
				request.session.email = email;
				response.render("home-prof");
			} else {
				errors.push({ message: "Wrong Password / email,  try again!" });
				response.render("login-prof", { errors});
			}			
			response.end(); 
		});
	} else {
		response.send('Please enter Username and Password!');
		response.end();
	}
});

app.post('/login-admin', function(request, response) {
	
	let errors = [];

	var email = request.body.email;
	var password = request.body.password;
	if (email && password) {
		db.query('SELECT * FROM users WHERE email = ? AND password = ?', [email, password], function(error, results, fields) {
			if (results.length > 0) {
				request.session.loggedin = true;
				request.session.email = email;
				response.render("home-admin");
			} else {
				errors.push({ message: "Wrong Password / email,  try again!" });
				response.render("login-admin", { errors});
			}			
			response.end(); 
		});
	} else {
		response.send('Please enter Username and Password!');
		response.end();
	}
});


app.use((req, res) => {
	res.status(404).render('error');
});

