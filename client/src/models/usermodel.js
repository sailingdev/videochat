exports.getUserByUsernameOrEmail = (username_email, callback) => {
	appDB.select('*').where({username: username_email}).or_where({email: username_email}).get('t_user', callback);
}

exports.updateUserProfile = (userId, username, password, avatarUrl, callback) => {
	const data = {
		id: userId
	};
	const updateData = {
		username: username,
		password: password,
		avatar: avatarUrl
	};

	appDB.update('t_user', updateData, data, callback);
}

exports.getUserById = (userId, callback) => {
	appDB.select('*').where({
		id: userId
	}).get("t_user", callback);
}

exports.getUserByEmail = (email, callback) => {
	appDB.select('*').where({
		email: email
	}).get("t_user", callback);
}


// exports.getUserByUsername = (username, callback) => {
// 	appDB.select('*').where({
// 		username: username
// 	}).get("t_user", callback);
// }
exports.getUserByUsername = function(username){
	return new Promise(function(resolve){
		appDB.select('*').where({
			username: username
		}).get("t_user", function(db_err, db_res){
			if(db_err){
				console.log(db_err);
				resolve(null);
			}else {
				if(db_res.length == 0){
					resolve(null);
				}else {
					resolve(db_res[0]);
				}
				
			}
		});
	});
	
}


// exports.addUser = (email, username, password, avatar, callback) => {
// 	const data = {
// 		username: username,
// 		email: email,
// 		password: password,
// 		avatar: avatar,
// 		create_datetime: commonTool.getCurrentDateTime(),
// 		is_email_verified: "YES"
// 	}

// 	appDB.insert("t_user", data, callback);
// }
exports.addUser = function(email, username, password, avatar){
	return new Promise(function(resolve){
		const data = {
			username: username,
			email: email,
			password: password,
			avatar: avatar,
			create_datetime: commonTool.getCurrentDateTime(),
			is_email_verified: "YES"
		}

		appDB.insert("t_user", data, function(db_err, db_res){
			if(db_err){
				console.log(db_err);
				resolve(null);
			}else{
				resolve(db_res);
			}
		});
	});
	
}

exports.setUserEmailVerified = (username, callback) => {
	const data = {
		username: username
	};
	const updateData = {
		is_email_verified: "YES"
	};

	appDB.update('t_user', updateData, data, callback);
}


// exports.checkUsernameAndPassword = (username, password, callback) => {

// 	const data = {
// 		username: username,
// 		password: password
// 	};

// 	appDB.select("*").where(data).get("t_user", callback);
// }

exports.checkUsernameAndPassword = function (username, password){
	return new Promise(function(resolve){
		const data = {
			username: username,
			password: password
		};
		appDB.select("*").where(data).get("t_user", function(db_err, db_res){
			if(db_err){
				console.log(db_err);
				resolve(false);
			} else {
				if(db_res.length == 0){
					resolve(false);
				}else{
					resolve(true);
				}
			}
		});
	});
}