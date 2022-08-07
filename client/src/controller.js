var formidable = require('formidable');
var fs = require('fs');

function formidableSync(req, uDir){
	return new Promise(function(resolve){
		var form = new formidable.IncomingForm();
		form.uploadDir = uDir;
		form.parse(req, function  (err, fields, files) {

			resolve({
				err: err,
				fields: fields,
				files: files
			});

		});
	});
	
}


exports.signOut = (req, res) => {
	sess = req.session;
	sess.isLoggedIn = undefined;
	sess.userData = undefined;
	sess.isGuest = undefined;


	let options = {
        maxAge: 1000 * 60 * 15, // would expire after 15 minutes
        httpOnly: true, // The cookie only accessible by the web server
        signed: false // Indicates if the cookie should be signed
    }

    
    // Set cookie
    res.cookie('autoLogin', "", options) // options is optional

	res.redirect("/frontpage" + (sess.showallroom ? "?showall=true" : ""));
}

exports.processPasswordRetrieveRequest = (req, res) => {
	var email_username = req.body.emailorusername;
	if (email_username == undefined) {
		res.json({
			status: "fail",
			msg: "Bad username or email."
		});
		return;
	}
	userModel.getUserByUsernameOrEmail(email_username, (db_err, db_res) => {
		if (db_err) {
			res.json({
				status: "fail",
				msg: "Searching with this username or email failed from DB."
			});
			return;
		}
		if (db_res.length == 0) {
			res.json({
				status: "fail",
				msg: "No user or email found."
			});
			return;
		}
		userData = db_res[0];
		var emailHtml = "<h1>Welcome to VideoChat</h1>" + "<span>We sent you this mail for your forgotten password.</span><br><span>Your password:" + userData.password + "</span><br>";
		let mailOptions = {
			from: '"VideoChat" <jogger_admin@126.com>', // sender address
			to: userData.email, // list of receivers
			subject: '✔', // Subject line
			html: emailHtml // html body
		};

		transporter.sendMail(mailOptions, (error, info) => {
			if (error) {
				res.json({
					status: "fail",
					msg: "sendMail failed."
				});
				return;
			} else {
				console.log('Email sent: ' + info.response);

				res.json({
					status: "ok",
					type: "forgotten_password_email_sent",
					msg: "Plz check your email for forgotten password."
				});
				return;
			}
		});
	});
}

exports.processCreateNewRoomRequest = async function (req, res) {

	// check about session.

	sess = req.session;
	if (sess.isLoggedIn != true || sess.userdata == null) {
		res.json({
			status: "fail",
			msg: "Please login to create room."
		});
		return;
	}

	var createUserId = sess.userdata.id;

	var formData = await formidableSync(req, appConfig.roomBasePath4Formidable);

	fields = formData.fields;
	files = formData.files;


	if (files.roomimage == undefined || files.roomimage.size == 0) {
		res.json({
			status: "fail",
			msg: "Please select room image."
		});
		return;
	}



	var roomName = fields.roomname;
	var roomDetails = fields.roomdetails;
	var roomCapacity = fields.roomcapacity;
	var canText = !fields.cantext == "on";
	var canVoice = !fields.canmic == "on";
	var canVideo = !fields.canvideo == "on";
	var password = fields.roompassword;


	if (roomName == undefined || roomName == "") {
		res.json({
			status: "fail",
			msg: "Enter room name correctly."
		});
		return;
	}
	if (roomDetails == undefined || roomDetails == "") {
		res.json({
			status: "fail",
			msg: "Enter room Details correctly."
		});
		return;
	}
	if (roomCapacity == undefined || roomCapacity == "") {
		res.json({
			status: "fail",
			msg: "Enter room capacity correctly."
		});
		return;
	}


	if (password == undefined) {
		password = "";
	}

	if (password.length != 0 && password.length < appConfig.passwordLength) {
		res.json({
			status: "fail",
			msg: "Password length must be at least " + appConfig.passwordLength + "."
		});
		return;
	}

	var romImgUrl = files.roomimage.path;
	romImgUrl = romImgUrl.replace(new RegExp(/\\/g), "/");
	romImgUrl = romImgUrl.substring(romImgUrl.lastIndexOf("/") + 1);

	var newRoomId = await roomModel.addRoom(roomName, password, roomDetails, roomCapacity, romImgUrl, canText, canVoice, canVideo, createUserId);

	res.json({
		status: "ok",
		type: "createroom",
		msg: "Room created successfully",
		data: protocolName + req.headers.host + "/room?roomid" + newRoomId
	});
}

// global.theme = {
// 	c_main_r: 255,
// 	c_main_g: 255,
// 	c_main_b: 255,
// 	c_main_a: 1,
// 	c_accent_r: 63,
// 	c_accent_g: 63,
// 	c_accent_b: 63,
// 	c_accent_a: 1,
// 	c_alt_r: 255,
// 	c_alt_g: 245,
// 	c_alt_b: 104,
// 	c_alt_a: 1,
// 	font_big: 30,
// 	font_normal: 20,
// 	font_small: 15
// };

async function refreshNavbarInfo() {
	if(isThemeLoaded == false){
		var themeDB = await roomModel.loadTheme();
		if(themeDB != null){
			var totalColorCount  = 15;
			for(i=0;i<themeDB.length;i++){
				if(themeDB[i].category == "COLOR" && themeDB[i].name == "main"){
					theme.c_main_r = themeDB[i].red;
					theme.c_main_g = themeDB[i].green;
					theme.c_main_b = themeDB[i].blue;
					theme.c_main_a = themeDB[i].alpha;
				}
				if(themeDB[i].category == "COLOR" && themeDB[i].name == "accent"){
					theme.c_accent_r = themeDB[i].red;
					theme.c_accent_g = themeDB[i].green;
					theme.c_accent_b = themeDB[i].blue;
					theme.c_accent_a = themeDB[i].alpha;
				}
				if(themeDB[i].category == "COLOR" && themeDB[i].name == "alternative"){
					theme.c_alt_r = themeDB[i].red;
					theme.c_alt_g = themeDB[i].green;
					theme.c_alt_b = themeDB[i].blue;
					theme.c_alt_a = themeDB[i].alpha;
				}

				for( kk = 1 ; kk <=  totalColorCount; kk ++ ){
					if(themeDB[i].category == "COLOR" && themeDB[i].name == "Color" + kk){
						theme["c" + kk + "_r"] = themeDB[i].red;
						theme["c" + kk + "_g"] = themeDB[i].green;
						theme["c" + kk + "_b"] = themeDB[i].blue;
						theme["c" + kk + "_a"] = themeDB[i].alpha;
					}
				}

				if(themeDB[i].category == "FONT_SIZE" && themeDB[i].name == "big"){
					theme.font_big = themeDB[i].size;
				}
				if(themeDB[i].category == "FONT_SIZE" && themeDB[i].name == "normal"){
					theme.font_normal = themeDB[i].size;
				}
				if(themeDB[i].category == "FONT_SIZE" && themeDB[i].name == "small"){
					theme.font_small = themeDB[i].size;
				}
			}
			//isThemeLoaded = true;
		}
	}
	var allRoomCount = 0;
	var allRooms = await roomModel.getRoomList();
	navbarInfo.allRoomCount = allRooms.length;
}

function loadLanguage(callback){
	roomModel.loadLanguage((db_err, db_res) => {
		if(db_err){
			console.log("loadLanguage => loadLanguage db error.");
		}else{
			for(i=0;i<db_res.length;i++){
				for(j in lang) {
					if(db_res[i].key == j){
						//console.log(j);
						lang[j] = db_res[i].value;
					}
				}
			}
			callback();
		}
		
	});
}

exports.createNewRoomPageRequest = function(req, res){
	sess = req.session;
	if (sess.isLoggedIn != true || sess.userdata == null) {
		res.json({
			status: "fail",
			type: "needtologin",
			msg: "Please login first."
		});
		return;
	} else{
		res.json({
			status: "ok",
			type: "showcreateroom",
			data: protocolName + req.headers.host + "/createroom"
		});
		return;
	}
}


exports.showCreateNewRoomPage = async function(req, res){
	sess = req.session;
	if (sess.isLoggedIn != true || sess.userdata == null) {
		res.redirect("/frontpage" + (sess.showallroom ? "?showall=true" : ""));
		return;
	}
	await refreshNavbarInfo();

	res.render('createnewroompage', {
		lang: lang,
		navbarInfo: navbarInfo,
		session: req.session,
		hostUrl: protocolName + req.headers.host
	});
}

exports.redirectToFrontPage = (req, res) => {
	hostname = req.headers.host;

	sess= req.session;

	res.redirect('/frontpage' + (sess.showallroom ? "?showall=true" : ""));
}

exports.getMoreRooms = async function(req, res){
	var showedRoomCount = req.query.showed_room_count;

	var roomData = await roomModel.getActiveRoomList(showedRoomCount);

	for (i = 0; i < roomData.length; i++) {
		roomData[i].image = protocolName + req.headers.host + appConfig.roomBasePath + roomData[i].image;
		
		var onlineCount = 0;

		for (var p in socketInfo) {
			item = socketInfo[p];
			if (item.type != "public_room") {
				continue;
			}
			if(item.room_id == roomData[i].id){
				onlineCount ++;
			}
		}

		roomData[i].online_user_count = onlineCount;

	}

	res.json({
		data: roomData
	});

}

exports.showFrontPage = async function(req, res){

	loadLanguage(function(){});

	var showAllRoom = req.query.showall == 'true';

	if(showAllRoom) {
		sess = req.session;
		sess.showallroom = true;
	}else{
		sess.showallroom = false;
	}

	var bw = await roomModel.loadBadwordList();

	if( bw!= null){
		badwords = bw;
	}

	hostname = req.headers.host;
	
	var autoLoginInfo = req.cookies.autoLogin;

	if(autoLoginInfo != undefined && autoLoginInfo != "")
	{
		var userdata = JSON.parse(autoLoginInfo).userdata;
		if(userdata != undefined){
			// if this session is not logged in,
			// need to set to auto login
			sess = req.session;
			sess.isLoggedIn = true;
			sess.userdata = userdata;
			sess.username = userdata.username;
			sess.email = userdata.email;
		}
	}
	
    var roomData = await roomModel.getActiveRoomList();

    if (roomData == null){
    	res.json({
			status: "fail",
			msg: "Database error occured."
		});
		return;
    }

	var isRoomHasUser = [];

	if(!showAllRoom){
		for (var i in socketInfo) {
			item = socketInfo[i];
			if (item.type != "public_room") {
				continue;
			}
			if (isRoomHasUser[item.room_id] == undefined) {
				isRoomHasUser[item.room_id] = true;
			}
		}
	}

	for (i = 0; i < roomData.length; i++) {

		navbarInfo.roomInfoArray[roomData[i].id] = {
			room_name: roomData[i].room_name,
		 	room_url: protocolName + req.headers.host + "/room?roomid=" + roomData[i].id
		};
		 
		if(!showAllRoom && isRoomHasUser[roomData[i].id] != true) {
			roomData.splice(i, 1);
			i--;
			continue;
		}
		roomData[i].image = protocolName + req.headers.host + appConfig.roomBasePath + roomData[i].image;
		var onlineCount = 0;
		for (var p in socketInfo) {
			item = socketInfo[p];
			if (item.type != "public_room") {
				continue;
			}
			if(item.room_id == roomData[i].id){
				onlineCount ++;
			}
		}
		roomData[i].online_user_count = onlineCount;

		if (lastManFromRoomSocketId[roomData[i].id] == undefined) {
			continue;
		}

		if (socketInfo[lastManFromRoomSocketId[roomData[i].id]] == undefined) {
			continue;
		}

		roomData[i].lastmanAvatar = socketInfo[lastManFromRoomSocketId[roomData[i].id]].avatar;
		roomData[i].lastmanUsername = socketInfo[lastManFromRoomSocketId[roomData[i].id]].username;
	}

	await refreshNavbarInfo();

	var ejsData = {
		lang: lang,
		navbarInfo: navbarInfo,
		roomData: roomData,
		session: req.session,
		hostUrl: protocolName + req.headers.host,
		isLoggedIn: req.session.isLoggedIn,
		theme: theme
	};
	if(showAllRoom){
		ejsData["loadMoreButton"] = true;
		ejsData["showedRoomCount"] = appConfig.pageCount;
	}

	res.render('frontpage', ejsData);
}

exports.signIn = async function(req, res){

	// console.log(req.body)

	var username = req.body.username;
	var password = req.body.password;

	var isGuestLogin = req.body.isguest == "on" ? true : false;
	var isRemember = req.body.isremember == "on" ? true : false;
	var isAutoLogin = req.body.isautologin == "on" ? true : false;

	if (username == undefined || username == "") {
		res.json({
			status: "fail",
			msg: "Enter username correctly."
		});
		return;
	}

	if (isGuestLogin) {
		// ingore all things.
		// this user is guest.
		sess = req.session;
		sess.isGuest = true;
		sess.isLoggedIn = true;
		sess.userData = undefined;
		sess.username = username;


		var guestUserNameId = guestNames.push(username) - 1;
		sess.guest_username_id = guestUserNameId;

		var url = protocolName + req.headers.host + "/frontpage?showall=true";

		res.json({
			status: "ok",
			type: "login",
			msg: "Login successfully.",
			data: url
		});
		return;
	}


	if (password == undefined || password == "") {
		res.json({
			status: "fail",
			msg: "Enter password correctly."
		});
		return;
	}

	if (password.length < appConfig.passwordLength) {
		res.json({
			status: "fail",
			msg: "Password length must be at least " + appConfig.passwordLength + "."
		});
		return;
	}

	var isPasswordCorrect = await userModel.checkUsernameAndPassword(username, password);
	if (!isPasswordCorrect) { // db error ... or password is incorrect
		res.json({
			status: "fail",
			msg: "Username or Password incorrect."
		});
		return;
	}

	var userData = await userModel.getUserByUsername(username);
	if(userData == null){
		res.redirect("/");
	}

	// save username and password and login data to session.
	var sess = req.session;
	sess.userdata = userData;
	sess.isLoggedIn = true;

	var pathname = "/frontpage?showall=true"; // pathname = '/MyApp'

	var roomUrl = protocolName + req.headers.host + pathname;

	if(isAutoLogin == true || isRemember == true) {
		// need to save info to cookie.

		let options = {
	        maxAge: 1000 * 60 * 15, // would expire after 15 minutes
	        httpOnly: true, // The cookie only accessible by the web server
	        signed: false // Indicates if the cookie should be signed
	    }

	    var cookieInfo = {
	    	userdata: sess.userdata
	    };

	    // Set cookie
	    res.cookie('autoLogin', JSON.stringify(cookieInfo), options) // options is optional
	    console.log("cookie saving...");
	    console.log(cookieInfo);

	}

	res.json({
		status: "ok",
		type: "login",
		msg: "Login successfully.",
		data: roomUrl
	});


}


exports.signUp = async function(req, res){

	var formData = await formidableSync(req, appConfig.avatarBasePath4Formidable);

	fields = formData.fields;
	files = formData.files;


		// console.log(fields);
		// console.log(files);

		var email = fields.email;
		var username = fields.username;
		var password = fields.password;


		// console.log("email: " + email);
		// console.log("username: " + username);
		// console.log("password: " + password);

		if (email == undefined || email == "") {
			res.json({
				status: "fail",
				msg: "Enter email correctly."
			});
			return;
		}

		if (username == undefined || username == "") {
			res.json({
				status: "fail",
				msg: "Enter username correctly."
			});
			return;
		}

		if (password == undefined || password == "") {
			res.json({
				status: "fail",
				msg: "Enter password correctly."
			});
			return;
		}

		if (password.length < appConfig.passwordLength) {
			res.json({
				status: "fail",
				msg: "Password length must be at least " + appConfig.passwordLength + "."
			});
			return;
		}

		if (files.useravatarimage == undefined || files.useravatarimage.size == 0) {
			res.json({
				status: "fail",
				msg: "Please select avatar."
			});
			return;
		}

		var avatarUrl = files.useravatarimage.path;
		avatarUrl = avatarUrl.replace(new RegExp(/\\/g), "/");
		avatarUrl = avatarUrl.substring(avatarUrl.lastIndexOf("/") + 1);

		console.log("New user registeration. " + "email: " + email + ", username: " + username + ", password: " + password + ", avatar: " + avatarUrl);

		var userData = await userModel.getUserByUsername(username);
		if(userData != null){
			res.json({
				status: "fail",
				msg: "This user already exists."
			});
			return;
		}

		await userModel.addUser(email, username, password, avatarUrl);

		res.json({
			status: "ok",
			type: "register",
			msg: "Registeration success."
		});
}


exports.processUpdateProfile = (req, res) => {

	sess = req.session;
	if (sess.isLoggedIn != true || sess.userdata == undefined) {
		res.json({
			status: "fail",
			type: "needlogin",
			msg: "Please Login first",
			data: protocolName + req.headers.host
		});
		return;
	}

	var form = new formidable.IncomingForm();

	form.uploadDir = appConfig.avatarBasePath4Formidable;

	form.parse(req, (err, fields, files) => {

		// console.log(fields);
		// console.log(files);

		var email = fields.email;
		var username = fields.username;
		var password = fields.password;


		// console.log("email: " + email);
		// console.log("username: " + username);
		// console.log("password: " + password);

		if (email == undefined || email == "") {
			res.json({
				status: "fail",
				msg: "Enter email correctly."
			});
			return;
		}

		if (username == undefined || username == "") {
			res.json({
				status: "fail",
				msg: "Enter username correctly."
			});
			return;
		}

		if (password == undefined || password == "") {
			res.json({
				status: "fail",
				msg: "Enter password correctly."
			});
			return;
		}

		if (password.length < appConfig.passwordLength) {
			res.json({
				status: "fail",
				msg: "Password length must be at least " + appConfig.passwordLength + "."
			});
			return;
		}

		if (files.useravatarimage == undefined || files.useravatarimage.size == 0) {
			res.json({
				status: "fail",
				msg: "Please select avatar."
			});
			return;
		}

		var avatarUrl = files.useravatarimage.path;
		avatarUrl = avatarUrl.replace(new RegExp(/\\/g), "/");
		avatarUrl = avatarUrl.substring(avatarUrl.lastIndexOf("/") + 1);

		console.log("New user update. " + "email: " + email + ", username: " + username + ", password: " + password + ", avatar: " + avatarUrl);

		userModel.updateUserProfile(userId, username, password, avatarUrl, (db_err, db_res) => {
			if (db_err) {
				res.json({
					status: "fail",
					msg: "Updating user profile failed. DB error."
				});
				return;
			}
			res.json({
				status: "ok",
				type: "updateprofile",
				msg: "Updating user profile ok."
			});

		});
	});
}

exports.joinRoom = async function(req, res){
	var sess = req.session;

	
	var roomId = req.body.roomid;
	
	var roomData = await roomModel.getRoomById(roomId);
	var isRoomPasswordProtected = roomData.is_password_protected == "YES";

	if(roomData == null){
		res.json({
			status: "fail",
			msg: "Room not found."
		});
		return;
	}

	if (isRoomPasswordProtected) {
		var sess = req.session;
		if (sess.roomPasswordOk == undefined || sess.roomPasswordOk[roomId] != true) {
			// user password not confirmed with this room.
			res.json({
				status: "fail",
				msg: "Password verification failed.",
				type: "roompasswordfail"
			});
			return;
		}
		// redirect to room page.
	}

	if (sess.isGuest == true) {
		var roomUrl = protocolName + req.headers.host + "/room?roomid=" + roomId;
		res.json({
			status: "ok",
			type: "joinroom",
			msg: "Room Joining Okay.",
			data: roomUrl
		});
		return;
	}
	if (sess.userdata == undefined) {
		res.json({
			status: "fail",
			type: "needtologin",
			msg: "Please login first."
		});
		return;
	}

	var userId = sess.userdata.id;
	
	var isAlreadyJoined = await roomModel.checkUserAlreadyJoinedRoom(userId, roomId);
	if(isAlreadyJoined){
		var isBanned = await roomModel.checkIsUserBanned(userId, roomId);
		if (isBanned) {
			//this user is banned.
			res.json({
				status: "fail",
				msg: "This user is banned from the room."
			});
			return;
		}
	}else {
		await roomModel.addUserToRoom(userId, roomId);
	}

	var roomUrl = protocolName + req.headers.host + "/room?roomid=" + roomId;
	res.json({
		status: "ok",
		type: "joinroom",
		msg: "Room Joining Okay.",
		data: roomUrl
	});
}

exports.checkRoomPassword = async function(req, res){

	var sess = req.session;

	if (sess.isLoggedIn != true) {
		res.json({
			status: "fail",
			type: "needtologin",
			msg: "Please Login first."
		});
		return;
	}

	var roomId = req.body.roomwithpasswordid;
	var password = req.body.roompassword;

	if (roomId == undefined) {
		res.json({
			status: "fail",
			msg: "Bad room id."
		});
		return;
	}
	if (password == undefined) {
		password = "";
	}
	
	var isPasswordRight = await roomModel.checkRoomPasswordById(roomId, password);

	if(!isPasswordRight){
		res.json({
			status: "fail",
			msg: "Wrong password."
		});
		return;
	}

	var sess = req.session;
	if (sess.roomPasswordOk == undefined) {
		sess.roomPasswordOk = [];
	}
	sess.roomPasswordOk[roomId] = true;

	res.json({
		status: "ok",
		type: "checkroompassword",
		msg: "password ok.",
		data: roomId
	});
}

exports.showPublicRoom = async function(req, res){

	var sess = req.session;
	var roomId = req.query.roomid;

	if (roomId == undefined) {
		res.redirect("/");
		return;
	}
	var roomInfo = await roomModel.getRoomById(roomId);

	if (sess.isGuest == true) {
		var roomInfo = await roomModel.getRoomById(roomId);

		var isModerator = false;

		res.render('publicchatpage', {
			navbarInfo: navbarInfo,
			details: roomInfo.detail,
			roomName: roomInfo.room_name,
			roomId: roomId,
			userId: 0,
			hostUrl: protocolName + req.headers.host,
			isModerator: isModerator,
			isLoggedIn: req.session.isLoggedIn,
			isGuest: true,
			guestNameId: sess.guest_username_id,
			theme: theme,
			roomInfo: roomInfo
		});
		return;
	}

	if (sess.userdata == undefined) {
		res.redirect('/');
		return;
	}

	var userId = sess.userdata.id;
	var isAlreadyJoined = await roomModel.checkUserAlreadyJoinedRoom(userId, roomId);
	if(isAlreadyJoined == null){
		res.redirect('/');
	}
	if (isAlreadyJoined){
		// check if the user is banned.
		var isBanned = await roomModel.checkIsUserBanned(userId, roomId);
		if(isBanned == true){
			res.redirect('/');
		}
	} else{
		await roomModel.addUserToRoom(userId, roomId);
	}

	

	var isModerator = false;
	if (roomInfo.moderator_id == userId) {
		// this user is moderator.
		if (sess.roomModerator == undefined) {
			sess.roomModerator = [];
		}
		sess.roomModerator[roomId] = true;
		isModerator = true;
	}

	await refreshNavbarInfo();
	res.render('publicchatpage', {
		lang: lang,
		navbarInfo: navbarInfo,
		details: roomInfo.detail,
		roomName: roomInfo.room_name,
		roomId: roomId,
		userId: userId,
		hostUrl: protocolName + req.headers.host,
		isModerator: isModerator,
		isLoggedIn: req.session.isLoggedIn,
		theme: theme,
		roomInfo: roomInfo
	});

}
