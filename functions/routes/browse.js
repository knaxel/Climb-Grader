
const ObjectID = require('mongodb').ObjectID;
const express = require("express");
const sessions = require('express-session');
const connect = require('../connect');
const {check, validationResult } = require('express-validator');
const router = express.Router();

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
		session.gym = gym;
		return true;
	}else{
		return true;
	}

}

router.get('/:gym_code', async (req, res) => {
		var session = req.session;
	if(! await gym_session(session, req.params.gym_code)){
		res.status(404).render('404', {url:'/g'+req.url});
		return;
	}
	res.render( 'search', {'user' : req.session.user, "gym" : req.session.gym });
});

router.get('/:gym_code/:climb_code', async (req, res) => {
	var session = req.session;
	
	if(! await gym_session(session, req.params.gym_code)){
		res.status(404).render('404', {url:'/g'+req.url});
		return;
	}

	if(req.params.climb_code.length != 5){
		res.render( 'search', {'user' : req.session.user, "gym" : req.session.gym , "error" : "The climbs code is 5 digits."});
		return;
	}
	
	let q = {"climb_code": req.params.climb_code, "gym_code" : new ObjectID(req.params.gym_code) };
	let climb = await connect.getDb().collection("routes").findOne(q);

	if(climb){
		
		if(req.query.grading){
			res.render('grading', {'user' : req.session.user, "gym" : req.session.gym, "climb" : climb });
			return;
		}

		res.render( 'grade', {'user' : req.session.user, "gym" : req.session.gym, "climb" : climb });
	

	}else{
		res.render( 'search', {'user' : req.session.user, "gym" : req.session.gym, "error" : "We could not find a climb with the code : " + req.body.search});
	}

});
router.post('/:gym_code/:climb_code', async (req, res) => {
	
	res.status(404).render('404', {url:'-- thats not a feature yet' });
	
	var session = req.session;
	
	if(! await gym_session(session, req.params.gym_code)){
		res.status(404).render('404', {url:'/g'+req.url});
		return;
	}

	if(req.params.climb_code.length != 5){
		res.render( 'search', {'user' : req.session.user, "gym" : req.session.gym , "error" : "The climbs code is 5 digits."});
		return;
	}

	//now try to insert the climb grade into the climb document.


});



module.exports = router;