/*
 * Time routes
 */

var controller = require("../controllers/status.js");

module.exports = function(app, passport) {
	
	app.post('/api/timedata-with-authen', controller.apply);
	app.post('/api/timedata-with-authen', controller.approve);
	app.post('/api/timedata-with-authen', controller.reject);
}
