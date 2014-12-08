/**
 * New node file
 */
var Timedata = require("../models/time-data.js");

exports.approve = approve;
exports.reject = reject;

function approve(req, res) {
	
	var data = req.body.data;
	if (data === null || data === "") {
		res.json({
			"success" : false,
			"message" : "Invalid parameter"
		});
		return;
	}

	checkStatus(data, function(err, canApprove) {
		if (err) {
			res.json({
				"success" : false,
				"message" : err
			});
			return;
		}
		if (!canApprove) {
			res.json({
				"success" : false,
				"message" : "Invalid data"
			});
			return;
		} else {
			if (data.type === "apply") data.state = 1;
			if (data.type === "approved1") data.state = 2;
			if (data.type === "approved2") data.state = 3;
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
	var data = req.body.data;
	if (data === null || data === "") {
		res.json({
			"success" : false,
			"message" : "Invalid parameter"
		});
		return;
	}

	checkStatus(data, function(err, canReject) {
		if (err) {
			res.json({
				"success" : false,
				"message" : err
			});
			return;
		}
		if (!canReject) {
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
		if (result.length === 0) {
			callback("not exist data", false);
		}
		if (data.type === "approve1" || data.type === "reject1") return callback(null, result.state === 1);
		if (data.type === "approve2" || data.type === "reject2") return callback(null, result.state === 2);
		if (data.type === "apply" || data.type ==="unapply") return callback(null, result.state === 0);
	});
}