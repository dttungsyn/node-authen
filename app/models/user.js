// load the things we need
var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');
var Schema = mongoose.Schema;
// define the schema for our user model
var userSchema = new Schema({
	
    local            : {
    	username	 : String,
        email        : String,
        password     : String,
    },
/*    facebook         : {
        id           : String,
        token        : String,
        email        : String,
        name         : String
    },
    twitter          : {
        id           : String,
        token        : String,
        displayName  : String,
        username     : String
    },
    google           : {
        id           : String,
        token        : String,
        email        : String,
        name         : String
    },*/
    
    fullname		 : String,//todo move into data below 
    data			 : {},
    data_fields		 : [String],
    staffs: [{type: Schema.Types.ObjectId, ref: 'User'}],
	approver: {type: Schema.Types.ObjectId, ref: 'User'},
	
	/*
	 * 0: user
	 * 1: leader
	 * 2: admin
	 */
	role: Number

});

// generating a hash
userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.local.password);
};

// create the model for users and expose it to our app
module.exports = mongoose.model('User', userSchema);

/*User = mongoose.model('User', userSchema);
User.findOne({ 'local.username' :  "dttung1412" }).populate("approver").exec( function(err, user) {
	
	
    // if there are any errors, return the error
    if (err)
        return done(err);

    console.log(user);

});*/
