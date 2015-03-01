var express = require('express');
var crypto = require('crypto');
var router = express.Router();
var User = require('../models/user');

router.get('/', function(req, res, next) {
  res.render('register', { title: 'Register', error: req.flash('error')});
});
router.post('/',function(req, res){
  //check password match
  if(req.body['password'] != req.body['password-repeat']){
	  req.flash('error', 'Your passwords do not match. Please try again');
	  return res.redirect('/register');
  }
  //generate password
  var md5 = crypto.createHash('md5');
  var password = md5.update(req.body.password).digest('base64');
  var newUser = new User({
  	email: req.body.useremail,
  	password: password
  });
  //check if user name exist
  User.get(newUser.email,function(error,user){
  	if(user)
  		error='User email already exists';
  	if(error){
  		req.flash('error', error);
  		return res.redirect('/register');
  	}
  	//if new user, save into database
  	newUser.save(function(error){
  		console.log('start save callback');
  		if(error){
  			req.flash('error',error);
  			return res.redirect('/register');
  		}
  		req.session.user = newUser;
  		req.flash('success','Registration Success');
  		req.redirect('/');
  	});
  });
});

module.exports = router;
