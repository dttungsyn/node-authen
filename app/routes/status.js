/*
 * state routes
 */

var controller = require("../controllers/status.js");

module.exports = function(app, passport) {
	
	//app.post('/api/apply-timedata', controller.apply);
	app.post('/api/approve-timedata/:username', controller.approve);
	app.post('/api/reject-timedata/:username', controller.reject);
}
