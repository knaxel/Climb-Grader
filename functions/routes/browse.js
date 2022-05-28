
const ObjectID = require('mongodb').ObjectID;
const express = require("express");
const sessions = require('express-session');
const connect = require('../connect');
const {check, validationResult } = require('express-validator');
const router = express.Router();
const {verify} = require('hcaptcha');
//


router.get('/:gym_code', async (req, res) => {
	var session = req.session;
	if(! await gym_session(session, req.params.gym_code)){
		res.status(404).render('404', {url:'/g'+req.url});
		return;
	}
	res.render( 'search', {'user' : req.session.user, "gym" : req.session.gym });
});

router.get('/:gym_code/:climb_code', async (req, res) => {
/*
So basically were making two api calls to the database in this function
this is the stupidest thing we could be doing if were trying
to minimize the usage of the database (which we are because money)

I should seriously be using aggregation  like this
but fuggit- that would mean i gott areqrite like 30+ lines!

db.gyms.aggregate([
	{$match: {'_id' : ObjectId("6279aec071fa7129cbe918b9") }},
	{$lookup : {
		from: 'routes',
		as : 'routes',//definitely not gonna be confused by this later
		let : { 'gym_id' : '$_id' },
		pipeline: [{
			$match: 
				{ $expr:
					{$and : [
						{ $eq : [ '$gym_code',  '$$gym_id' ] },
						{ $eq : [ '$climb_code',  23769 ] }
					]}
				}
			}]
	}},
	{$project: {'setter_code':0, 'routes.expire_at': 0, 'routes.gym_code': 0}}
]);

*/
	var session = req.session;
	
	if(! session.gym || session.gym == null){
		res.status(404).render('404', {url:'You seem suspicious so just stop- I made this for fun, dont ruin it for everone else. I know that you are trying to spam.' });
		return;
	}

	if(req.params.climb_code.length > 5){
		res.render( 'search', {'user' : req.session.user, "gym" : req.session.gym , "error" : "The climbs code is 0-5 digits."});
		return;
	}
	
	let q = {"climb_code": parseInt(req.params.climb_code), "gym_code" : new ObjectID(req.params.gym_code) };
	let climb = await connect.getDb().collection("routes").findOne(q);

	if(climb){
		

		res.render( 'grade', {'user' : req.session.user, "gym" : req.session.gym, "climb" : climb ,'success':req.query.success, 'captcha_site_key' : process.env.HCAPTCHA_SITE_KEY});
	

	}else{
		res.render( 'search', {'user' : req.session.user, "gym" : req.session.gym, "error" : "We could not find a climb with the code : " + req.params.climb_code});
	}

});

let validation = [
	check('incorrect_opinion')
	.isInt({min:0}).withMessage("Your opinion on the grade must be V0-17."), 
	check('h-captcha-response')
	.custom(async (value,{req})=>{
  		if((await verify(process.env.HCAPTCHA_SECRET, value).catch(console.error)).success === false){
  	   		throw new Error("You must successfully complete the hCaptcha to continue.");
  		}
  	return true;
  })];
router.post('/:gym_code/:climb_code', validation, async (req, res) => {
	
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
	  res.status(401).render( 'search', {'errors': errors.errors});
	  return;
	}
	
	// right now this is the same as a get page
	// we should simply require a session, if it hasnt started yet we should cancel post
	// this is because we only intend on this being used in browser
	// the only thing that would make a post request without having started a session (using a GET request)
	// is an AI spam bot, therefore require a session
	
	var session = req.session;
	
	if(! await gym_session(session, req.params.gym_code)){
		res.status(404).render('404', {url:'/g'+req.url});
		return;
	}
	if(req.params.climb_code.length > 5){
		res.render( 'search', {'user' : req.session.user, "gym" : req.session.gym , "error" : "The climbs code is 5 digits."});
		return;
	}

	//now try to insert the climb grade into the climb document.
	let q = {"climb_code": parseInt(req.params.climb_code), "gym_code" : new ObjectID(req.params.gym_code) };

	//definitely didnt steal this 'aggregation' insert method
	let push = await connect.getDb().collection("routes").updateOne(q, 
		[{
		  $addFields: {
		    votes: {
		      $reduce: {
		        input: "$votes",
		        initialValue: [{ 'id': req.sessionID, 'grade': req.body.incorrect_opinion }], // Input
	            in: {
                  $cond: [
		            { $in: ["$$this.id", "$$value.id"] }, /** Check id exists in 'scores' array */
		            "$$value", /** If YES, return input */
		            { $concatArrays: ["$$value", ["$$this"]] }/** If NO, concat value(holding array) with current object as array */
		          ]
		        }
		      }
		    }
		  }
		}]);


	if(!push || !push.acknowledged){
		console.log(push);
		//res.render('grade',{'user' : req.session.user, "gym" : req.session.gym});
		return;
	}

	res.redirect('/g/'+req.params.gym_code+'/'+req.params.climb_code + '?success=true');


});


async function gym_session(session, gym_code){

	if(gym_code.length != 24){
		return false;
	}

	if(!session.gym){
		let gym = await connect.getDb().collection("gyms").findOne({ "_id" : new ObjectID(gym_code) });


		if(!gym){
			return false;
		}
		gym._id = gym._id.toString();
		gym.setter_code = null;
		session.gym = gym;
		return true;
	}else{
		return true;
	}

}

module.exports = router;