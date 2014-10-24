/**
 * time-data model
 */

var mongoose = require('mongoose');

// define the schema for time-data model
var timeDataSchema = mongoose.Schema({
	
	username: String,
	
	monthStr:  { type: String},
	
	fields: [],
	
	data:   []

});

// add new or update time data
timeDataSchema.statics.updateTimeData = function(data, callback){
	var username = data.username;
	var monthStr = data.monthStr;
	this.findOne({"username": data.username, "monthStr": data.monthStr}, function(err, timedata){
		if (err)
		{
			return callback({
				"status": 1,
				"message": "interal error!"
			});
			
		}
		
		if (!timedata){
			//not found -> add new
			timedata = new TimeData();
			timedata.username = data.username;
			timedata.monthStr = data.monthStr;
			timedata.data = [ JSON.parse(data.data) ];
			timedata.save(function(err){
				if (err)
					return callback({
						"status": 1,
						"message": "save error!"
					});
				
				callback({
					"status": 0,
					"message": "Added successful!"
				});
			})
		}
		
		else {
			// update current data
			timedata.data = [ JSON.parse(data.data) ];
			timedata.save(function(err){
				if (err)
					return callback({
						"status": 1,
						"message": "save error!"
					});
				
				callback({
					"status": 0,
					"message": "Updated successful!"
				});
			})
		}
				
		
		
	})
}

//create the model for users and expose it to our app
var TimeData = module.exports = mongoose.model('time-data', timeDataSchema);