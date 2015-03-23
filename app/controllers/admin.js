/**
 * @author fpt-dev
 */

exports.renderAdminPage = renderAdminPage;

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