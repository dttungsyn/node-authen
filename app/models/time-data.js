'use strict'

/**
 * time-data model
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// ============ define the schema for time-data model ==========
var TimeDataSchema = new Schema({

	username : String,

	monthStr : {
		type : String
	},

	fieldset : { type: mongoose.Schema.Types.ObjectId, ref: 'fieldset' },

	data : [],
	
	state: Number
	/*
	 * 0: unapply
	 * 1: applied  -  Leader can see to approve
	 * 2: approved -  Admin can see to approve, user can not modify
	 * 3: approved 2 - done, leader can not modify
	 */

});

// add new or update time data
TimeDataSchema.statics.updateTimeData = function(data, callback) {
	var username = data.username;
	var monthStr = data.monthStr;
	this.findOne({
		"username" : data.username,
		"monthStr" : data.monthStr
	}, function(err, timedata) {
		if (err) {
			return callback({
				"status" : 1,
				"message" : "interal error!"
			});

		}

		if (!timedata) {
			// not found -> add new
			timedata = new TimeData();
			timedata.username = data.username;
			timedata.monthStr = data.monthStr;
			timedata.data = data.data;
			
			//add default fieldset
			FieldSet.findOne(function(err, fieldset){
				if (!err) timedata.fieldset = fieldset._id;
				
				timedata.save(function(err) {
					if (err)
						return callback({
							"status" : 1,
							"message" : "save error!"
						});

					callback({
						"status" : 0,
						"message" : "Added successful!"
					});
				})
			});
			
		}

		else {
			// update current data
			timedata.data = data.data;
			timedata.save(function(err) {
				if (err)
					return callback({
						"status" : 1,
						"message" : "save error!"
					});

				callback({
					"status" : 0,
					"message" : "Updated successful!"
				});
			})
		}

	})
}



var TimeData = mongoose.model('time-data', TimeDataSchema);


//=========== define the schema for fields model =========
var FieldSetSchema = new Schema({

	_id : mongoose.Schema.Types.ObjectId,

	fields : []

});
var FieldSet = mongoose.model('fieldset', FieldSetSchema);


//
TimeData.FieldSet = FieldSet;

// create the model for users and expose it to our app
module.exports = TimeData