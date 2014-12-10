/**
 * New node file
 */
var Fieldset = require("../models/fieldset.js");

exports.getFieldset = getFieldset;

function getFieldset(req, res){
	Fieldset.findOne(function(err, fieldset){
		if (err) {
			return res.json({
				"success" : false,
				"message" : "interal error!"
			});
		}
		
		if (!fieldset){
			return res.json({
				"success" : false,
				"message" : "fieldset not found!"
			});
		}
		
		res.json({
			"success" : true,
			"message" : "",
			"data": fieldset.fields
		});
	})
}