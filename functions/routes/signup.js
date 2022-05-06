// Made by Emerson Cole Philipp
// 
//'their' stuff
const ObjectID = require('mongodb').ObjectID;
const express = require("express");
const router = express.Router();
//stuff this middleware needs
const {check, validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const connect = require('../connect');
const base62 = require('../my_modules/base62');

module.exports = router;

// Validation rules.
var validation = [
  check('gym_name')
  .isLength({min:4}).withMessage("Your gyms name needs to be atleast 4 characters long."),
  check('name')
  .isLength({min:2}).withMessage("Your name needs to be atleast 2 characters long."),
  check('email', 'The email adress is not a valid email!').isEmail(),
  check('phone').optional({checkFalsy: true})
  .matches(/^(\+\d{1,2}\s)?\(?\d{3}\)?[\s.-]\d{3}[\s.-]\d{4}/).withMessage("Please use a valid phone number."),
  check('password')
  .isLength({ min: 8 }).withMessage('Password must be at least 8 characters!')
  .matches('[0-9]').withMessage('Password must contain a number!')
  .matches('[A-Z]').withMessage('Password must contain an uppercase letter!'),
  check('password_repeat').custom((value,{req}) =>{
    if(value !== req.body.password){
      throw new Error('Password repeat does not match with password!');
    }
    return true;
  })
];

//routes "../signup"

router.get('/', (req , res) => {

  if(req.session.user){
    res.redirect('/account');
    return;
  }
  res.render('signup',{});
});


router.post('/', validation, async (req , res) => {

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(422).render( 'signup', {'errors':errors.errors, 'req':req.body});
    return;
  }

  if(await getUser(req.body.email) != null){
    res.render('signup', {'errors': 
                      [{"value": req.body.email, "msg" : "That email address is already used by another user account!", "param": "email", "location":"body"}]
                      , 'req':req.body
                    });
    return ;
  }

  const userDocument = {
    _id: new ObjectID(),
    last_ip: req.socket.remoteAddress,
    date_created: new Date(),
    //expire_at: new Date(new Date()+3600*1000*24*30),
    email: req.body.email,
    definitely_not_a_password_hash: req.body.password,
    definitely_not_a_password_salt: ''
  };

  let gym = await createGym(req.body.gym_name, userDocument._id);
  userDocument.gyms = [gym.insertedId];
  
  if(req.body.phone != null){
    userDocument.phone = req.body.phone;
  }


  //wait for bcrypt password hashing
  bcrypt.genSalt(saltRounds, function(error, salt) {

    userDocument.definitely_not_a_password_salt = salt;

    bcrypt.hash(req.body.password, salt, function(error, hash) {

      userDocument.definitely_not_a_password_hash = hash;

      // Store user in your DB.
      connect.getDb()
      .collection("users")
      .insertOne(userDocument, function (error, result) {
        if (error) {
          res.status(400).send("Error inserting matches!");
        } else {
          //res.render( 'signup',{});
          req.session.message = "You have successfully registered an account." + req.body.name ;
          res.redirect('/login' );
        }      
      });
    });
  });

});


async function createGym(gymname, ownerId){
  let gymDocument = {
    _id:new ObjectID(),
    date_created : new Date(),
    name: gymname,
    gym_associate: ownerId,
    setter_code: base62.encode( 62**5 + Math.floor(Math.random()*62**5 )),
  };

  try{
    //add the new gym
    let ress = await connect.getDb().collection("gyms").insertOne(gymDocument);
    return ress;

  }catch(error){
    //I wanna know this error happened, dont tell users. ie There is no good reason why that insert should not work.
    console.log(error);
    return null;
  }
}
async function getUser(email){
  let res = await connect.getDb().collection("users").findOne({"email" : email });
  return res;
}
