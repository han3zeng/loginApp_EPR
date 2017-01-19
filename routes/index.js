var express = require('express');
var router = express.Router();

// Get Homepage
router.get('/', ensureAuthenticated,function(req, res){
	res.render('index');
});

// isAuthenticated is passport function
// https://github.com/jaredhanson/passport/blob/a892b9dc54dce34b7170ad5d73d8ccfba87f4fcf/lib/passport/http/request.js#L74
function ensureAuthenticated(req, res, next){
	if(req.isAuthenticated()){
		return next();
	} else {
		req.flash('error_msg','You are not logged in');
		res.redirect('/users/login');
	}
}

module.exports = router;
