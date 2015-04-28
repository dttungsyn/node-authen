/**
 * @author fpt-dev
 */
var controller = require("../controllers/admin.js");

module.exports = function(app, passport) {
	
	app.get('/admin', isLoggedIn, controller.renderAdminPage);
	app.post('/admin/addStaff', isLoggedIn, controller.addStaff);
	app.post('/admin/removeStaff', isLoggedIn, controller.removeStaff);
	app.post('/admin/changePass', isLoggedIn, controller.changePass);
}

//route middleware to ensure user is logged in
function isLoggedIn(req, res, next) {
	if (req.isAuthenticated())
		return next();

	res.redirect('/');
}