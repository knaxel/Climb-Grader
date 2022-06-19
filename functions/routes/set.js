
const express = require("express");
const sessions = require('express-session');
const {check, validationResult } = require('express-validator');
const router = express.Router();
const {verify} = require('hcaptcha');
const ObjectID = require('mongodb').ObjectID;

const connect = require('../connect.js');

const m = 2**16 ; //2**8,2**16,2**32
module.exports = router;

var validation_post = [
  check('setter_name')
  .isLength({min:3, max: 10}).withMessage('Your "setter name" must be between 3 and 10 characters long.'),
  check('setter_grade')
  .isInt().withMessage('The grade you originally set must be a number, right now we only use V-scale!'),
  check('h-captcha-response')
  .custom(async (value,{req})=>{
  	if((await verify(process.env.HCAPTCHA_SECRET, value).catch(console.error)).success === false){
  	   throw new Error("You must successfully complete the hCaptcha to continue.");
  	}
  	return true;
  })
 ];

router.get('/:gym_code/:setter_code', async (req, res) => {

	var session = req.session;
	let gym = await gym_session(session, req.params.gym_code);

	if(! gym || req.params.setter_code.length != 6 || gym.setter_code==req.params.setter_code){
		res.status(404).render('404', {url:'/s'+req.url});
		return;
	}
 	
	res.render('set', {'captcha_site_key' : process.env.HCAPTCHA_SITE_KEY});

});

router.post('/:gym_code/:setter_code',validation_post, async (req, res) => {

	var session = req.session;

	let gym = await gym_session(session, req.params.gym_code);

	if(! gym || !session.gym._id || req.params.setter_code.length != 6 || gym.setter_code==req.params.setter_code){
		res.status(404).render('404', {url:'/s'+req.url});
		return;
	}


	const errors = validationResult(req);
	if (!errors.isEmpty()) {
	  res.status(422).render( 'set', {'errors':errors.errors, 'captcha_site_key' : process.env.HCAPTCHA_SITE_KEY});
	  return;
	}  

	let most_recent = await connect.getDb().collection("routes").find({gym_code:new ObjectID(gym._id)}).sort({date_created: 1}).limit(1).toArray();
	
	//default itteration randome 1-2**16   m=2**16
	var next_code = Math.floor(Math.random() * m);
	if(most_recent && most_recent.length > 0){
		next_code = most_recent.climb_code;
	}

	next_code = fetch16(next_code);
	let date_today = new Date();

	let climbDocument = {
		_id : new ObjectID(),
		gym_code : new ObjectID(session.gym._id),
		date_created : date_today,
		//expire after 30 days
		// 1000 ms/s * 60 s/m * 60m/hr * 24 hr/d * 30 days
		expire_at : new Date(date_today.valueOf() + 1000*60*60*24*30 ),
		climb_code : next_code,
		setter_name : req.body.setter_name,
		grade : {
			system: "V-Scale",
			setter : req.body.setter_grade
		},
		votes : [{
			id: req.sessionID,
			grade : req.body.setter_grade

		}]
	};

	let response = await connect.getDb().collection("routes").insertOne(climbDocument);

	if(!response.insertedId || response.acknowledged!=true){

		res.render('set', {'errors' : [json_error('502', 'The server could not handle your request at this time. Try again in a few minutes', '', '')], 'captcha_site_key' : process.env.HCAPTCHA_SITE_KEY})
		return;

	}

	var code_str = ""+climbDocument.climb_code;
	while(code_str.length < 5){
		code_str = "0"+climbDocument.climb_code;

	}
	res.render('set', 
		{'new_climb':{'setter_name': climbDocument.setter_name,
				  'climb_code': code_str, 
				  'expire_at' : climbDocument.expire_at},
		'captcha_site_key' : process.env.HCAPTCHA_SITE_KEY});


});

const fetch16 = createFetch(m, 97, (m>>1)-1);
function createFetch(m, a, c) { // Returns a function
     return x => (a * x + c) % m;
}
function json_error(value,msg,param,location){
	return {'value':value,'msg':msg,'param':param, 'location': location};
}
async function gym_session(session, gym_code){

	if(gym_code.length != 24){
		return false;
	}

	if(!session.gym){
		let gym = await connect.getDb().collection("gyms").findOne({ "_id" : new ObjectID(gym_code) });


		if(!gym){
			return false;
		}
		gym.setter_code = null;
		session.gym = gym;
		return true;
	}else{
		return true;
	}

}