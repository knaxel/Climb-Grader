// Made by Emerson Cole Philipp
// 
const express = require("express");
const sessions = require('express-session');
const {check, validationResult } = require('express-validator');
const router = express.Router();

const connect = require('../connect');
const bcrypt = require('bcrypt');

module.exports = router;


var validation = [
  check('email', 'The email adress is not a valid email!').isEmail(),
  check('password')
  .isLength({ min: 8 }).withMessage('Password must be at least 8 characters!')
  .matches('[0-9]').withMessage('Password must contain a number!')
  .matches('[A-Z]').withMessage('Password must contain an uppercase letter!')
];

router.get('/', (req , res) => {
	
	if(req.session.user){
		res.redirect('/account');
		return;
	}
	var msg = req.session.message;
	res.render( 'login',{'msg' : msg});
});

router.post('/', async (req, res) => {

	
	const errors = validationResult(req);

	const incorrect_res = {'errors': [{"value": req.body.email, "msg" : "You have entered an incorrect username or password!", "param": "email", "location":"body"}]};

	if (!errors.isEmpty()) {
	  res.status(401).render( 'login', incorrect_res);
	  return;
	}
	
	const userDocument = await getUser(req.body.email);

	if(userDocument == null){
	  res.status(401).render( 'login', incorrect_res);
	  return;
	}


    bcrypt.hash(req.body.password, userDocument.definitely_not_a_password_salt, async function(error, hash) {
    	if(hash == userDocument.definitely_not_a_password_hash){
				session=req.session;

  			let gymDocument = await connect.getDb().collection("gyms").findOne({"gym_associate" : userDocument._id });

        session.user= {"_id" : userDocument._id, 'email': req.body.email , 'gym': gymDocument };
     //console.log(session.user);
    		res.redirect('/account');
    		return;
    	}else{

	  		res.status(401).render( 'login', incorrect_res);
    		return;
    	}
    });

});

async function getUser(email){
  let res = await connect.getDb().collection("users").findOne({"email" : email });
  return res;
}