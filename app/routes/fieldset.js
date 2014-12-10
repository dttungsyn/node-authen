/**
 * fieldset routes
 */

var controller = require("../controllers/fieldset.js");

module.exports = function(app, passport) {
	
	app.post('/api/get-fieldset', controller.getFieldset);
}
