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

	fieldset : {
		type : mongoose.Schema.Types.ObjectId,
		ref : 'fieldset'
	},

	data : [],

	state : Number
/*
 * 0: unapply, 1: applied - Leader can see to approve, 2: approved - Admin can see
 * to approve, user can not modify, 3: approved level 2 - done, leader can not modify
 */

});

TimeDataSchema.statics.updateState = function(data, callback) {
	var username = data.username;
	var monthStr = data.monthStr;
	this.findOne({
		"username" : data.username,
		"monthStr" : data.monthStr
	}, function(err, timedata) {
		if (err) {
			return callback(err);

		}
		if (!timedata) {
			// not found -> show msg
			return callback("Data not exist!");

		} else {
			timedata.state = data.state;
			timedata.save(function(err) {
				if (err)
					return callback(err);
				callback();
			});
		}
	});
}

TimeDataSchema.statics.findState = function(data, callback) {
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
			return callback({
				"status" : 1,
				"message" : "Data not exist!"
			});
		}

		callback(null, {
			"state" : timedata.state
		});
	});
}
// add new or update time data
TimeDataSchema.statics.updateTimeData = function(data, callback) {
	var username = data.username;
	var monthStr = data.monthStr;
	this
			.findOne(
					{
						"username" : data.username,
						"monthStr" : data.monthStr
					},
					function(err, timedata) {
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
							timedata.state = 0;

							// add default fieldset
							FieldSet.findOne(function(err, fieldset) {
								if (!err)
									timedata.fieldset = fieldset._id;

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
								});
							});

						}

						else {
							
							if (!timedata.state){
								timedata.state = 0;
							}

							if (!(timedata.state === 0 || timedata.state === 1)) {
								return callback({
									"status" : 1,
									"message" : "Data has been approved already, cannot update!"
								});
							}
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
							});
						}

					})
}

/*
 * Get approve state of 'users' in 'monthstr'
 */
TimeDataSchema.statics.getTimeDataState = function(users, monthstr, cb) {
	this.find({
		monthStr: monthstr,
		username: {
			"$in": users
		}
	}, function(err, docs){
		
		if (err){
			cb( null );
			return;
		}
		
		var states = {};
		for (var i = 0; i < docs.length; i ++){
			states[ docs[i].username ] = docs[i].state;
		}
		
		cb( states );
	})
}

var TimeData = mongoose.model('time-data', TimeDataSchema);

// =========== define the schema for fields model =========
var FieldSet = require("./fieldset.js");

//
TimeData.FieldSet = FieldSet;

// create the model for users and expose it to our app
module.exports = TimeData