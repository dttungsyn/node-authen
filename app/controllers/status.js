/**
 * New node file
 */
var Timedata = require("../models/time-data.js");

exports.approve = approve;
exports.reject = reject;

function approve(req, res) {

	var data = {
		"username" : req.params.username,
		"monthStr" : req.body.monthstr
	};
	if (data.monthStr === null || data.monthStr.trim() === "" || data.username.trim()) {
		res.json({
			"success" : false,
			"message" : "Invalid parameter"
		});
		return;
	}

	checkStatus(data, function(err, state) {
		if (err) {
			res.json({
				"success" : false,
				"message" : err
			});
			return;
		}
		if (state === null) {
			res.json({
				"success" : false,
				"message" : "Invalid data"
			});
			return;
		} else {
			data.state = state + 1;
			Timedata.updateState(data, function(err, result) {
				if (err) {
					res.json({
						"success" : false,
						"message" : err
					});
					return;
				} else {
					res.json({
						"success" : true,
						"message" : result
					});
				}
			});
		}

	});
}

function reject(req, res) {
	var data = {
		"username" : req.params.username,
		"monthStr" : req.body.monthstr
	};
	if (data.monthStr === null || data.monthStr.trim() === "" || data.username.trim()) {
		res.json({
			"success" : false,
			"message" : "Invalid parameter"
		});
		return;
	}

	checkStatus(data, function(err, state) {
		if (err) {
			res.json({
				"success" : false,
				"message" : err
			});
			return;
		}
		if (state === null) {
			res.json({
				"success" : false,
				"message" : "Invalid data"
			});
			return;
		} else {
			data.state = 0;
			Timedata.updateState(data, function(err, result) {
				if (err) {
					res.json({
						"success" : false,
						"message" : err
					});
					return;
				} else {
					res.json({
						"success" : true,
						"message" : result
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