/**
 * New node file
 */
var Timedata = require("../models/time-data.js");
var APPROVE = 1;
var UNAPPROVE = 2;
var REJECT = 3;

exports.approve = approve;
exports.unapprove = unapprove;
exports.reject = reject;

function approve(req, res) {

	var data = {
		"username" : req.params.username,
		"monthStr" : req.body.monthstr
	};

	changeStatus(data, APPROVE, function(err, result) {
		res.json(err ? err : result);
	});
}

function unapprove(req, res) {

	var data = {
		"username" : req.params.username,
		"monthStr" : req.body.monthstr
	};

	changeStatus(data, UNAPPROVE, function(err, result) {
		res.json(err ? err : result);
	});

}

function reject(req, res) {
	var data = {
		"username" : req.params.username,
		"monthStr" : req.body.monthstr
	};
	changeStatus(data, REJECT, function(err, result) {
		res.json(err ? err : result);
	});
}

function changeStatus(data, type, callback) {

	if (data.monthStr === null || data.monthStr.trim() === ""
			|| data.username.trim() === "") {
		callback({
			"success" : false,
			"message" : "Invalid parameter"
		});
		return;
	}

	checkStatus(data, function(err, state) {
		if (err || state === null) {
			callback({
				"success" : false,
				"message" : "Invalid data"
			});
		} else {
			var message;
			switch (type) {
			case 1:
				data.state = (state >= 3) ? 3 : state + 1;
				message = "approved";
				break;
			case 2:
				data.state = (state <= 0) ? 0 : state - 1;
				message = "unapproved";
				break;
			case 3:
				data.state = 0;
				message = "rejected";
				break;
			}

			Timedata.updateState(data, function(err, result) {
				if (err) {
					callback({
						"success" : false,
						"message" : err
					});
				} else {
					callback(null, {
						"success" : true,
						"message" : message + " successful"
					});
				}
			});
		}
	});
}

function checkStatus(data, callback) {
	Timedata.findState(data, function(err, result) {
		if (err) {
			callback(err, false);
			return;
		}
		if (result.length === 0 || result === null) {
			callback("not exist data", false);
		}
		return callback(null, result.state);
	});
}