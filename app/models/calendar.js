/**
 * New node file
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// =========== define the schema for fields model =========
var CalendarSchema = new Schema({

	year : Number,
	
	months: {}

});
var Calendar = mongoose.model('calendar', CalendarSchema);

module.exports = Calendar