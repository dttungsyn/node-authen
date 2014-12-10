/**
 * New node file
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// =========== define the schema for fields model =========
var FieldSetSchema = new Schema({

	_id : mongoose.Schema.Types.ObjectId,

	fields : []

});
var FieldSet = mongoose.model('fieldset', FieldSetSchema);

module.exports = FieldSet