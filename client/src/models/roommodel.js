exports.loadLanguage = (callback) => {
	appDB.select('*').get("t_language", callback);
}

exports.loadTheme = function(){
	return new Promise(function(resolve){
		appDB.select('*').get("t_theme", function(db_err, db_res){
			if(db_err){
				console.log(db_err);
				resolve(null);
			}else {
				resolve(db_res);
			}
		});

	});
}


exports.loadBadwordList = function (){
	return new Promise(function (resolve){
		appDB.select('*').get("t_bad_word", function(db_err, db_res) {
			if(db_err){
				console.log(db_err);
				resolve(null);
			}else {
				resolve(db_res);
			}
		});
	});
}

// set user banned or un banned.
exports.setUserBanned = (userId, roomId, isBan, callback) => {
	const data = {
		room_id: roomId,
		user_id: userId,
	};
	const updateData = {
		is_banned: isBan ? "YES" : "NO"
	};

	appDB.update('t_user_room_relation', updateData, data, callback);
}

// get moderator options from user room relation table
exports.getRoomUserInformation = (userId, callback) => {
	appDB.select("*").where({
		user_id: userId
	}).get("t_user_room_relation", callback);
}


//enable text from moderator
exports.setTextEnableFromModerator = (roomId, userId, callback) => {
	const data = {
		room_id: roomId,
		user_id: userId,

	};
	const updateData = {
		is_moderator_text: "YES"
	};

	appDB.update('t_user_room_relation', updateData, data, callback);
}
//disable text from moderator
exports.setTextDisableFromModerator = (roomId, userId, callback) => {
	const data = {
		room_id: roomId,
		user_id: userId,

	};
	const updateData = {
		is_moderator_text: "NO"
	};

	appDB.update('t_user_room_relation', updateData, data, callback);
}


//enable mic from moderator
exports.setMicEnableFromModerator = (roomId, userId, callback) => {
	
	const data = {
		room_id: roomId,
		user_id: userId,

	};
	const updateData = {
		is_moderator_voice: "YES"
	};

	appDB.update('t_user_room_relation', updateData, data, callback);
}
//disable mic from moderator
exports.setMicDisableFromModerator = (roomId, userId, callback) => {
	
	const data = {
		room_id: roomId,
		user_id: userId,

	};
	const updateData = {
		is_moderator_voice: "NO"
	};

	appDB.update('t_user_room_relation', updateData, data, callback);
}


//enable video from moderator
exports.setVideoEnableFromModerator = (roomId, userId, callback) => {
	
	const data = {
		room_id: roomId,
		user_id: userId,

	};
	const updateData = {
		is_moderator_video: "YES"
	};

	appDB.update('t_user_room_relation', updateData, data, callback);
}
//disable video from moderator
exports.setVideoDisableFromModerator = (roomId, userId, callback) => {
	
	const data = {
		room_id: roomId,
		user_id: userId,

	};
	const updateData = {
		is_moderator_video: "NO"
	};

	appDB.update('t_user_room_relation', updateData, data, callback);
}

exports.addRoom = function(name, password, detail, capacity, image, canText, canVoice, canVideo, moderatorId){
	return new Promise(function(resolve){
		const data = {
			room_name: name,
			password: password,
			is_password_protected: password == "" ? "NO" : "YES",
			detail: detail,
			capacity: capacity,
			image: image,
			is_text: canText == true ? "YES" : "NO",
			is_voice: canVoice == true ? "YES" : "NO",
			is_video: canVideo == true ? "YES" : "NO",
			is_activated: "YES",
			create_datetime: commonTool.getCurrentDateTime(),
			last_event_datetime: commonTool.getCurrentDateTime(),
			moderator_id: moderatorId
		}

		appDB.insert("t_room", data, function(db_err, db_res){
			if(db_err){
				console.log(db_err);
				resolve(0);
			}else {
				resolve(db_res.insert_id);
			}
		});
	});

}

exports.getActiveRoomList = function(start = 0) {
	return new Promise(function(resolve){
//		appDB.query("SELECT *, ( SELECT COUNT(*) FROM t_user_room_relation WHERE t_user_room_relation.room_id = t_room.id ) AS `online_user_count` FROM t_room", function (db_err, db_res){
		sql = "SELECT *, ( SELECT COUNT(*) FROM t_user_room_relation WHERE t_user_room_relation.room_id = t_room.id ) AS `online_user_count` FROM t_room ORDER BY create_datetime ASC LIMIT " + start + ", " + appConfig.pageCount;
			appDB.query(sql, function (db_err, db_res){
			if(db_err){
				console.log(db_err);
				resolve(null);
			}else {
				resolve(db_res);
			}
		});
	});

}

exports.getRoomList = function(){
	return new Promise(function(resolve){
		appDB.select('*').get('t_room',function(db_err, db_res){
			if(db_err){
				console.log(db_err);
				resolve(null);
			}else{
				resolve(db_res);
			}
		});
	});
}

exports.checkRoomPasswordById = function(roomId, password){
	return new Promise(function(resolve){
		appDB.select('*').where({
			id: roomId,
			password: password
		}).get('t_room', function(db_err, db_res){
			if(db_err){
				console.log(db_err);
				resolve(false);
			}else {
				if(db_res.length == 0){
					resolve(false);
				}else {
					resolve(true);
				}
			}
		});
	});
}

exports.getUserCountOfRoom = (roomId, callback) => {
	appDB.where({
		room_id: roomId
	}).count('t_user_room_relation',callback);
}

exports.checkUserBanned = (userId, roomId, callback) => {
	appDB.select("*").where({
		user_id: userId,
		room_id: roomId,
		is_banned: "YES"
	}).get("t_user_room_relation", callback);
}

exports.checkUserAlreadyJoinedRoom = function(userId, roomId) {
	return new Promise(function(resolve){
		appDB.select("*").where({
			user_id: userId,
			room_id: roomId
		}).get("t_user_room_relation", function(db_err, db_res){
			if(db_err){
				console.log(db_err);
				resolve(null);
			}else {
				if(db_res.length == 0){
					resolve(false);
				}else{
					resolve(true);
				}
			}
		});
	});
}

exports.checkIsUserBanned = function(userId, roomId) {
	return new Promise(function(resolve){
		appDB.select("*").where({
			user_id: userId,
			room_id: roomId
		}).get("t_user_room_relation", function(db_err, db_res){
			if(db_err){
				console.log(db_err);
				resolve(null);
			}else {
				if(db_res.length == 0){
					resolve(false);
				}else{
					resolve(isBanned = db_res[0].is_banned == "YES");
				}
			}
		});
	});
}





// exports.addUserToRoom = (userId, roomId, callback) => {
// 	const data = {
// 		user_id: userId,
// 		room_id: roomId,
// 		last_login_time: commonTool.getCurrentDateTime()
// 	}

// 	appDB.insert("t_user_room_relation", data, callback);
// }

exports.addUserToRoom = function(userId, roomId) {
	return new Promise(function(resolve){
		const data = {
			user_id: userId,
			room_id: roomId,
			last_login_time: commonTool.getCurrentDateTime()
		}

		appDB.insert("t_user_room_relation", data, function(db_err, db_res){
			if(db_err){
				console.log(db_err);
				resolve(null);
			}else {
				resolve(db_res);
			}
		});
	});
}

exports.removeUserFromRoom = (userId, roomId, callback) => {
	const data = {
		user_id: userId,
		room_id: roomId
	}
	appDB.delete("t_user_room_relation", data, callback);
}


exports.getRoomById = function(roomId){
	return new Promise(function(resolve){
		appDB.select("*").where({
			id: roomId
		}).get("t_room", function(db_err, db_res){
			if(db_err){
				console.log(db_err);
				resolve(null);
			}else {
				if(db_res.length == 0){
					resolve(null);
				}else{
					resolve(db_res[0]);
				}
			}
		});
	});
}