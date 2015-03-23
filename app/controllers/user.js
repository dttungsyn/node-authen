'use strict'

/**
 * New node file
 * user controller
 */

var User = require("../models/user.js");

exports.getUserData = getUserData;
exports.getUserDataByUsername = getUserDataByUsername;
exports.updateUserDataByUsername = updateUserDataByUsername;
exports.getStaffUserData = getStaffUserData;

/**
 * 
 * @param req
 * @param res
 * @returns
 */
function getUserData(req, res){
	var user = req.user;
	
	//not approver
	if (!user.staffs || user.staffs.length === 0)
		return res.json(user);
	
	//approver
	User.findOne({"_id": user._id}).populate("staffs", "fullname local.username").exec(function(err, user){
		if (err){
			return res.json("error!");
		}
		if (!user){
			return res.json("user not found!");
		}
		
		return res.json(user);
	});
}

/**
 * 
 * @param req
 * @param res
 */
function getUserDataByUsername(req, res){
	//console.log(req.params);
	
	//TODO check right
	User.findOne({"local.username": req.params.username}).exec(function(err, user){
		if (err){
			return res.json("error!");
		}
		if (!user){
			return res.json("user not found!");
		}
		
		return res.json(user);
	});
}

/**
 * 
 * @param req
 * @param res
 */
function updateUserDataByUsername(req, res){
	// check update right
	//TODO check right
	User.findOne({"local.username": req.params.username}).exec(function(err, user){
		if (err){
			return res.json("error!");
		}
		if (!user){
			return res.json("user not found!");
		}

		//Update
		user.fullname = req.body.fullname;
		user.local.email = req.body.local.email;

		user.save(function(err) {
			if (err)
				return res.json({
					"success" : false,
					"message" : "server error"
				});

			return res.json({
				"success" : true,
				"message" : "Update successful! " + user.fullname
			})
		})
	});
}

/**
 * 
 * @param req
 * @param res
 */
function getStaffUserData(req, res){
	var user = req.user;

	User.findOne({"_id": req.user._id}).populate("staffs", "local.username data").exec(function(err, user){
		if (err){
			return res.json("error!");
		}
		if (!user){
			return res.json("user not found!");
		}
		
		user.staffs.unshift({
			local: {
				username: user.local.username
			},
			data: user.data,
			data_fields: user.data_fields
		});
		
		res.json( user.staffs );
	});
}