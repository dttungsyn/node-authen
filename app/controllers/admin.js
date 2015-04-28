/**
 * @author fpt-dev
 */

var User = require("../models/user.js");

exports.renderAdminPage = renderAdminPage;
exports.addStaff = addStaff;
exports.removeStaff = removeStaff;

/**
 * 
 */
function renderAdminPage(req, res){
	var user = req.user;	//get from session
	var isApprover = user.staffs && user.staffs.length > 0;
	
	if (!isApprover) {
		return res.json("err: not approver");
	}
	
	res.render('../../admin/index.ejs', {
		user : user,
		page : "admin",
		isApprover: user.staffs && user.staffs.length > 0
	});
	
}

function addStaff(req, res){
	var user = req.user;	//get from session
	var staff_username = req.body.staff_username;
	
	User.findOne({'local.username': staff_username}, {'_id': 1}).exec(function(err, staff){
		if (err || !staff){
			console.log('find staff error!');
			res.json('find staff error!');
			return;
		}
		if (user.staffs.indexOf(staff._id) >= 0){
			console.log('staff already added');
			res.json('staff already added!');
			return;
		}
		user.staffs.push( staff._id );
		user.save(function(err){
			if (err){
				console.log(err);
				return;
			}
			
			res.json('add staff success');
		});
	});
	
}

function removeStaff(req, res){
	var user = req.user;	//get from session
	var staff_username = req.body.staff_username;
	
	User.findOne({'local.username': staff_username}, {'_id': 1}).exec(function(err, staff){
		if (err || !staff){
			console.log('find staff error!');
			res.json('find staff error!');
			return;
		}
		var pos;
		if ( (pos = user.staffs.indexOf(staff._id)) == -1){
			console.log('staff not found in list');
			res.json('staff not found in list!');
			return;
		}
		user.staffs.splice( pos, 1 );
		user.save(function(err){
			if (err){
				console.log(err);
				return;
			}
			
			res.json('remove staff success');
		});
	});
}