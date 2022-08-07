// defined by me.
global.appConfig = require('./src/appconfig');
global.commonTool = require('./src/commontool');
global.userModel = require('./src/models/usermodel');
global.roomModel = require('./src/models/roommodel');

// language
global.lang = require('./src/language');

// bad words
global.badwords = [];

// guest user names
global.guestNames = [];

// theme settings
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
// font_big: 30,
// font_normal: 20,
// font_small: 15
// };
global.theme = {
	font_big: 30,
	font_normal: 20,
	font_small: 15,
	c_main_r: 255,
	c_main_g: 255,
	c_main_b: 255,
	c_main_a: 1,
	c_accent_r: 63,
	c_accent_g: 63,
	c_accent_b: 63,
	c_accent_a: 1,
	c_alt_r: 255,
	c_alt_g: 245,
	c_alt_b: 104,
	c_alt_a: 1,
	c1_r: 255,
	c2_r: 255,
	c3_r: 255,
	c4_r: 255,
	c5_r: 255,
	c6_r: 255,
	c7_r: 255,
	c8_r: 255,
	c9_r: 255,
	c10_r: 255,
	c11_r: 255,
	c12_r: 255,
	c13_r: 255,
	c14_r: 255,
	c15_r: 255,
	c1_g: 255,
	c2_g: 255,
	c3_g: 255,
	c4_g: 255,
	c5_g: 255,
	c6_g: 255,
	c7_g: 255,
	c8_g: 255,
	c9_g: 255,
	c10_g: 255,
	c11_g: 255,
	c12_g: 255,
	c13_g: 255,
	c14_g: 255,
	c15_g: 255,
	c1_b: 255,
	c2_b: 255,
	c3_b: 255,
	c4_b: 255,
	c5_b: 255,
	c6_b: 255,
	c7_b: 255,
	c8_b: 255,
	c9_b: 255,
	c10_b: 255,
	c11_b: 255,
	c12_b: 255,
	c13_b: 255,
	c14_b: 255,
	c15_b: 255,
	c1_a: 255,
	c2_a: 255,
	c3_a: 255,
	c4_a: 255,
	c5_a: 255,
	c6_a: 255,
	c7_a: 255,
	c8_a: 255,
	c9_a: 255,
	c10_a: 255,
	c11_a: 255,
	c12_a: 255,
	c13_a: 255,
	c14_a: 255,
	c15_a: 255
};

global.isThemeLoaded = false;

//saves header real-time update information.
// navbar info
global.navbarInfo = {
	activateRoomCount: 0,
	allRoomCount: 0,
	onlineUserCount: 0,
	activateRoomLinks: [], // room_id: item.room_id, room_url: item.room_url });
	roomInfoArray: {}
};


//hostname
global.hostname = "not_set_yet";
global.protocolName = "https://";

// db
global.dbSettings = {
	host: appConfig.dbConfig.host,
	database: appConfig.dbConfig.db_name,
	user: appConfig.dbConfig.username,
	password: appConfig.dbConfig.password,
};
global.appDB = require('node-querybuilder').QueryBuilder(dbSettings, 'mysql', 'single');

//mailer


var nodemailer = require('nodemailer');
global.transporter = nodemailer.createTransport(appConfig.mailConfig); // emailer

// port
var port = process.env.PORT || appConfig.port;

// other modules
var bodyParser = require('body-parser');
var session = require('express-session');
var fs = require("fs")
var cookieParser = require('cookie-parser');
var express = require('express');

var app = express();

app.set('views', __dirname + '/src/views');
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);
app.use(express.static('public'));
app.use(bodyParser.json());
app.use(cookieParser());



app.use(bodyParser.urlencoded({
	extended: true
}));
app.use(session({
	secret: '@#@$MYSIGN#@$#$',
	resave: false,
	saveUninitialized: true
}));

// Yes, SSL is required
const serverConfig = {
	key: fs.readFileSync('key.pem'),
	cert: fs.readFileSync('cert.pem'),
};


const https = require('https');
var httpsServer = https.createServer(serverConfig, app);

var router = require('./src/router')(app, fs);

// var http = require('http').Server(app);

var io = require('socket.io')(httpsServer);

// saves last man info who started private chat.
global.lastManFromRoomSocketId = [];

// saves information for socket;	json {user_id: xxx, room_id: yyy}
global.socketInfo = {};



String.prototype.replaceAll = function(search, replacement) {
	var target = this;
	return target.replace(new RegExp(search, 'g'), replacement);
};

function uuid() {
	function s4() {
		return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
	}

	return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
}

/*
activateRoomCount: 0,
allRoomCount: 0,
onlineUserCount: 0
*/

function getActivateRoomCount() {
	var rooms = [];
	var activeRoomCount = 0;
	navbarInfo.activateRoomLinks = [];
	for (var i in socketInfo) {
		item = socketInfo[i];
		if (item.type != "public_room") {
			continue;
		}
		if (rooms[item.room_id] == undefined) {
			rooms[item.room_id] = true;
			navbarInfo.activateRoomLinks.push({
				room_id: item.room_id,
				room_url: item.room_url
			});
			activeRoomCount++;
		}
	}
	console.log(navbarInfo.activateRoomLinks);
	return activeRoomCount;
}

io.on('connection', function(socket) {
	console.log("a new connection. socket_id: " + socket.id);

	// mic toggle control
	socket.on('mic_toggled', function(data){
		io.in(roomId).emit('mic_toggled', data);
	});




	// moderator user text control
	socket.on('disable_text_request', function(data) {
		var moderatorSocketId = data.from_id;
		var targetUserSocketId = data.to_id;
		//check if moderatorSocketId is valid.
		if (socketInfo[moderatorSocketId] == undefined) {
			return;
		}

		if (socketInfo[moderatorSocketId].is_moderator != true) {
			return;
		}
		if (moderatorSocketId != socket.id) {
			return;
		}

		roomModel.setTextDisableFromModerator(roomId, userId, (db_err, db_res) => {
			if (db_err) {
				console.log("disable_text_request => setTextDisableFromModerator error from db. roomId: " + roomId + ", userId: " + userId);
				return;
			}
			// need to send this information to client.
			var data = {
				msg: lang.server_moderator_disallowed_text
			};
			io.to(targetUserSocketId).emit('disabled_text_from_moderator', data);
			data = {
				msg: lang.server_user_text_disabled_success,
				user_id: targetUserSocketId
			};
			io.to(moderatorSocketId).emit('disabled_text_user', data);
		});

	});

	socket.on('enable_text_request', function(data) {
		var moderatorSocketId = data.from_id;
		var targetUserSocketId = data.to_id;
		//check if moderatorSocketId is valid.
		if (socketInfo[moderatorSocketId] == undefined) {
			return;
		}

		if (socketInfo[moderatorSocketId].is_moderator != true) {
			return;
		}
		if (moderatorSocketId != socket.id) {
			return;
		}

		roomModel.setTextEnableFromModerator(roomId, userId, (db_err, db_res) => {
			if (db_err) {
				console.log("enable_text_request => setTextEnableFromModerator error from db. roomId: " + roomId + ", userId: " + userId);
				return;
			}
			// need to send this information to client.
			var data = {
				msg: lang.server_moderator_allowed_text
			};
			io.to(targetUserSocketId).emit('enabled_text_from_moderator', data);
			data = {
				msg: lang.server_user_text_enabled_success,
				user_id: targetUserSocketId
			};
			io.to(moderatorSocketId).emit('enabled_text_user', data);
		});

	});

	// moderator user mic control
	socket.on('disable_mic_request', function(data) {
		var moderatorSocketId = data.from_id;
		var targetUserSocketId = data.to_id;
		//check if moderatorSocketId is valid.
		if (socketInfo[moderatorSocketId] == undefined) {
			return;
		}

		if (socketInfo[moderatorSocketId].is_moderator != true) {
			return;
		}
		if (moderatorSocketId != socket.id) {
			return;
		}

		roomModel.setMicDisableFromModerator(roomId, userId, (db_err, db_res) => {
			if (db_err) {
				console.log("disable_mic_request => setMicDisableFromModerator error from db. roomId: " + roomId + ", userId: " + userId);
				return;
			}
			// need to send this information to client.
			var data = {
				msg: lang.server_moderator_disallowed_mic
			};
			io.to(targetUserSocketId).emit('disabled_mic_from_moderator', data);
			data = {
				msg: lang.server_user_mic_disabled_success,
				user_id: targetUserSocketId
			};
			io.to(moderatorSocketId).emit('disabled_mic_user', data);
		});

	});

	socket.on('enable_video_request', function(data) {
		var moderatorSocketId = data.from_id;
		var targetUserSocketId = data.to_id;
		//check if moderatorSocketId is valid.
		if (socketInfo[moderatorSocketId] == undefined) {
			return;
		}

		if (socketInfo[moderatorSocketId].is_moderator != true) {
			return;
		}
		if (moderatorSocketId != socket.id) {
			return;
		}

		roomModel.setVideoEnableFromModerator(roomId, userId, (db_err, db_res) => {
			if (db_err) {
				console.log("enable_video_request => setVideoEnableFromModerator error from db. roomId: " + roomId + ", userId: " + userId);
				return;
			}
			// need to send this information to client.
			var data = {
				msg: lang.server_moderator_allowed_camera
			};
			io.to(targetUserSocketId).emit('enabled_video_from_moderator', data);
			data = {
				msg: lang.server_user_camera_disabled_success,
				user_id: targetUserSocketId
			};
			io.to(moderatorSocketId).emit('enabled_video_user', data);
		});

	});

	// moderator user video control
	socket.on('disable_video_request', function(data) {
		var moderatorSocketId = data.from_id;
		var targetUserSocketId = data.to_id;
		//check if moderatorSocketId is valid.
		if (socketInfo[moderatorSocketId] == undefined) {
			return;
		}

		if (socketInfo[moderatorSocketId].is_moderator != true) {
			return;
		}
		if (moderatorSocketId != socket.id) {
			return;
		}

		roomModel.setVideoDisableFromModerator(roomId, userId, (db_err, db_res) => {
			if (db_err) {
				console.log("disable_video_request => setVideoDisableFromModerator error from db. roomId: " + roomId + ", userId: " + userId);
				return;
			}
			// need to send this information to client.
			var data = {
				msg: lang.server_moderator_disallowed_camera
			};
			io.to(targetUserSocketId).emit('disabled_video_from_moderator', data);
			data = {
				msg: lang.server_user_camera_disabled_success,
				user_id: targetUserSocketId
			};
			io.to(moderatorSocketId).emit('disabled_video_user', data);
		});

	});

	socket.on('enable_mic_request', function(data) {
		var moderatorSocketId = data.from_id;
		var targetUserSocketId = data.to_id;
		//check if moderatorSocketId is valid.
		if (socketInfo[moderatorSocketId] == undefined) {
			return;
		}

		if (socketInfo[moderatorSocketId].is_moderator != true) {
			return;
		}
		if (moderatorSocketId != socket.id) {
			return;
		}

		roomModel.setMicEnableFromModerator(roomId, userId, (db_err, db_res) => {
			if (db_err) {
				console.log("enable_mic_request => setMicEnableFromModerator error from db. roomId: " + roomId + ", userId: " + userId);
				return;
			}
			// need to send this information to client.
			var data = {
				msg: lang.server_moderator_allowed_mic
			};
			io.to(targetUserSocketId).emit('enabled_mic_from_moderator', data);
			data = {
				msg: lang.server_user_mic_disabled_success,
				user_id: targetUserSocketId
			};
			io.to(moderatorSocketId).emit('enabled_mic_user', data);
		});

	});



	// private room video chat message. (mettings.js)
	socket.on('message', function(data) {
		// console.log("===============message===============");
		// console.log(data);
		socket.broadcast.emit('message', data);
	});

	// // public room video chat message. (mettings.js)
	// socket.on('message_public_video', function(data) {
	// 	// console.log("===============message===============");
	// 	// console.log(data);
	// 	socket.broadcast.emit('message_public_video', data);
	// });

	socket.on('private_video_chat_setup', function(data) {
		var fromSocketId = data.from_id;
		var toSocketId = data.to_id;
		var privateRoomId = data.private_room_id;
		io.to(toSocketId).emit('private_video_chat_check', data);
	});

	socket.on('accept_call', function(data) {
		// console.log("===============accept_call===============");
		// console.log(data);

		// here, the from_id is caller and to_id has accepted the call.
		var fromId = data.from_id;
		var toId = data.to_id;

		if (socketInfo[fromId] == undefined) {
			console.log("accept call from id is bad. socket_id: " + fromId);
			return;
		}

		if (socketInfo[toId] == undefined) {
			console.log("accept call to id is bad. socket_id: " + fromId);
			return;
		}

		var fromUserId = socketInfo[fromId].user_id;
		var toUserId = socketInfo[toId].user_id;

		var privateRoomId = uuid();

		var privateChatUrl = protocolName + hostname + "/privatechat?" + ("type=" + "from") + "&" + ("id=" + privateRoomId) + "&" + ("from_id=" + fromUserId) + "&" + ("to_id=" + toUserId);
		var data2From = {
			from_id: fromId,
			to_id: toId,
			// url: privateChatUrl,
			private_room_url: privateRoomId,
			opp_id: toId
		}
		io.to(fromId).emit('start_call', data2From);

		// console.log("from socket id: " + fromSocket.id);
		// console.log(data2From);


		var privateChatUrl = protocolName + hostname + "/privatechat?" + ("type=" + "to") + "&" + ("id=" + privateRoomId) + "&" + ("from_id=" + fromUserId) + "&" + ("to_id=" + toUserId);
		var data2To = {
			from_id: fromId,
			to_id: toId,
			// url: privateChatUrl,
			private_room_url: privateRoomId,
			opp_id: fromId
		}
		io.to(toId).emit('start_call', data2To);
		// console.log("to socket id: " + toSocket.id);
		// console.log(data2To);
		lastManFromRoomSocketId[socketInfo[fromId].room_id] = fromId;

	});
	socket.on('reject_call', function(data) {
		// here, the from_id is caller and to_id has rejected the call.
		var fromId = data.from_id;
		data.msg = lang.server_sorry_your_call_rejected;
		io.to(fromId).emit('call_rejected', data);
	});

	socket.on('private_chat_request', function(data) {

		var fromId = data.from_id;
		var toId = data.to_id;

		// find socket id from all sockets where the user id is toId.
		io.to(toId).emit('incoming_private_chat_request', data);
	});

	socket.on('private_chat_become_online', function(data) {
		var privateRoomId = data.private_room_id;
		var userId = data.user_id;
		var socketId = socket.id;
		if (socketInfo[socketId] != undefined) {
			console.log("unexpected error. socket id already exists. here is private_chat_become_online. socket_id: " + socketId);
			return;
		}

		socket.join(privateRoomId);

		userModel.getUserById(userId, (db_err, db_res) => {
			if (db_err) {
				console.log("get user id from private_chat_become_online failed from db.");
			}
			if (db_res.length == 0) {
				console.log("no user found private_chat_become_online.");
			}

			console.log("saving socket to socketInfo. user_id: " + userId + ", roomId: " + privateRoomId + ", socketId: " + socketId);

			var userData = db_res[0];
			var avatar = protocolName + hostname + appConfig.avatarBasePath + userData.avatar;
			var username = userData.username;

			socketInfo[socketId] = {
				type: "private_room",
				user_id: userId,
				room_id: privateRoomId,
				socket_id: socketId,
				avatar: avatar,
				username: username
			}

			var respData = {
				user_id: socket.id,
				room_id: privateRoomId
			};

			io.in(privateRoomId).emit('private_user_online', respData);

			for (i in socketInfo) {
				if (socketInfo[i].room_id == privateRoomId && socketInfo[i].socket_id != socketId) {
					var respData = {
						user_id: socketInfo[i].socket_id
					}
					io.to(socketId).emit('joined_private_room_user_list', respData);
					return;
				}
			}
		});
	});

	socket.on('public_become_online', function(data) {
		roomId = data.room_id;
		userId = data.user_id;

		if (userId == 0) {
			// this user is guest
			var avatar = protocolName + hostname + appConfig.avatarBasePath + "guest.png";
			var guestNameId = data.guest_name_id;
			var username = guestNames[guestNameId] || "Guest";

			socketInfo[socket.id] = {
				type: "public_room",
				user_id: userId,
				room_id: roomId,
				avatar: avatar,
				username: username,
				/* + socket.id,*/
				socket_id: socket.id,
				room_url: protocolName + hostname + "/room?roomid=" + roomId
			}
			socket.join(roomId);
			console.log("A new guest connected to room. room_id: " + roomId);

			// increase online user count and braodcast.
			navbarInfo.onlineUserCount = navbarInfo.onlineUserCount + 1;
			navbarInfo.activateRoomCount = getActivateRoomCount();
			io.emit('navbar_info_change', navbarInfo);


			// need to braodcast new user.

			// this is copied code from just below....
			// this is sent to all room mates
			var respData = {
				user_id: socket.id,
				avatar: avatar,
				username: username,
				time: commonTool.getCurrentDateTime()
			};

			io.in(roomId).emit('public_new_user_online', respData);


			// this will be sent to just joint user
			var roomUserData = [];

			for (var i in socketInfo) {
				if (socketInfo[i].socket_id == socket.id) {
					continue;
				}
				item = socketInfo[i];
				if (item != undefined) {
					if (item.type != "public_room" || item.room_id != roomId /*|| item.user_id == 0*/) {
						continue;
					}
					tmp = {
						user_id: socketInfo[i].socket_id,
						avatar: item.avatar,
						username: item.username
					};
					roomUserData.push(tmp);
				}
			}

			io.to(socket.id).emit('joined_public_room_user_list', roomUserData);

			return;
		}

		console.log("A new user want to connect to room. room_id: " + roomId);
		socket.join(roomId);

		userModel.getUserById(userId, async (db_err, db_res) => {
			if (db_err) {
				console.log("public_become_online => getUserById failed from db.");
			}
			if (db_res.length == 0) {
				console.log("public_become_online => getUserById result length 0.");
			}

			console.log("saving socket to socketInfo. user_id: " + userId + ", roomId: " + roomId + ", socketId: " + socket.id);

			var userData = db_res[0];
			var avatar = protocolName + hostname + appConfig.avatarBasePath + userData.avatar;
			var username = userData.username;

			for (var i in socketInfo) {
				if (socketInfo[i].user_id == userId) {
					delete socketInfo[i];
					navbarInfo.onlineUserCount = navbarInfo.onlineUserCount - 1;
				}
			}

			// add user data to socketInfo
			socketInfo[socket.id] = {
				type: "public_room",
				user_id: userId,
				room_id: roomId,
				avatar: avatar,
				username: username,
				socket_id: socket.id,
				room_url: protocolName + hostname + "/room?roomid=" + roomId
			}

			// add moderation information to socketInfo.
			var roomInfo =  await roomModel.getRoomById(roomId);

				if (roomInfo.moderator_id == userId) {
					// this user is moderator.
					socketInfo[socket.id].is_moderator = true;
				}

				

				// increase online user count and braodcast.
				navbarInfo.onlineUserCount = navbarInfo.onlineUserCount + 1;
				navbarInfo.activateRoomCount = getActivateRoomCount();
				io.emit('navbar_info_change', navbarInfo);

				// this is sent to all room mates
				var respData = {
					user_id: socket.id,
					avatar: avatar,
					username: username,
					time: commonTool.getCurrentDateTime()
				};

				io.in(roomId).emit('public_new_user_online', respData);


				// this will be sent to just joint user
				var roomUserData = [];

				for (var i in socketInfo) {
					if (socketInfo[i].socket_id == socket.id) {
						continue;
					}
					item = socketInfo[i];
					if (item != undefined) {
						if (item.type != "public_room" || item.room_id != roomId || item.user_id == 0) {
							continue;
						}
						tmp = {
							user_id: socketInfo[i].socket_id,
							avatar: item.avatar,
							username: item.username
						};
						roomUserData.push(tmp);
					}
				}

				io.to(socket.id).emit('joined_public_room_user_list', roomUserData);



		});

	});
	socket.on('public_chat', function(data) {

		console.log(data);

		userId = data.userid;
		roomId = data.roomid;
		var socketData = socketInfo[userId];
		if (socketData == undefined) {
			console.log("bad socket id from client. socket_id: " + userId);
			return;
		}
		if (socketData.type != "public_room") {
			console.log("bad room type for socket id " + userId);
			return;
		}

		var msg = data.msg;
		for (i = 0; i < badwords.length; i++) {
			if (badwords[i].bad_word == undefined || badwords[i].bad_word == "") {
				continue;
			}
			var re = new RegExp(badwords[i].bad_word, 'g');
			msg = msg.replace(re, '<strike>' + badwords[i].bad_word + '</strike>');
		}

		var respData = {
			msg: msg,
			avatar: socketData.avatar,
			time: commonTool.getCurrentDateTime()
		};
		io.in(roomId).emit('public_chat', respData);
	});

	socket.on('private_chat', function(data) {

		console.log(data);

		userId = data.userid;
		roomId = data.roomid;
		toId = data.toid;
		var socketData = socketInfo[userId];
		if (socketData == undefined) {
			console.log("bad socket id from client. socket_id: " + userId);
			return;
		}
		// if (socketData.type != "private_room") {
		// 	console.log("bad room type for socket id " + userId);
		// 	return;
		// }
		var respData = {
			msg: data.msg,
			avatar: socketData.avatar,
			time: commonTool.getCurrentDateTime()
		};
		io.to(userId).emit('private_chat', respData);
		io.to(toId).emit('private_chat', respData);
	});

	socket.on('kick_user_request', function(data) {
		var moderatorSocketId = data.from_id;
		var targetUserSocketId = data.to_id;
		//check if moderatorSocketId is valid.
		if (socketInfo[moderatorSocketId] == undefined) {
			return;
		}

		if (socketInfo[moderatorSocketId].is_moderator != true) {
			return;
		}
		if (moderatorSocketId != socket.id) {
			return;
		}
		var kickData = {
			msg: lang.server_you_were_kicked,
			url: protocolName + hostname
		}
		io.to(targetUserSocketId).emit('kicked', kickData);
	});

	socket.on('ban_user_request', function(data) {
		var moderatorSocketId = data.from_id;
		var targetUserSocketId = data.to_id;
		//check if moderatorSocketId is valid.
		if (socketInfo[moderatorSocketId] == undefined) {
			return;
		}

		if (socketInfo[moderatorSocketId].is_moderator != true) {
			return;
		}
		if (moderatorSocketId != socket.id) {
			return;
		}

		if (socketInfo[targetUserSocketId] != undefined) {
			socketInfo[targetUserSocketId].isBanned = true;
			console.log("ban_user_request => setUserBanned db error. user_id: " + socketInfo[targetUserSocketId].user_id + ", room_id: " + socketInfo[targetUserSocketId].room_id);
			roomModel.setUserBanned(socketInfo[targetUserSocketId].user_id, socketInfo[targetUserSocketId].room_id, true, (db_err, db_res) => {
				if (db_err) {
					console.log("ban_user_request => setUserBanned db error. user_id: " + socketInfo[targetUserSocketId].user_id + ", room_id: " + socketInfo[targetUserSocketId].room_id);
					return;
				}
				var banData = {
					msg: lang.server_you_were_banned,
					url: protocolName + hostname
				}
				io.to(targetUserSocketId).emit('banned', banData);
				data = {
					msg: lang.server_user_banned_success,
					user_id: targetUserSocketId
				};
				io.to(moderatorSocketId).emit('banned_user', data);
			});
		}
	});

	socket.on('unban_user_request', function(data) {
		var moderatorSocketId = data.from_id;
		var targetUserSocketId = data.to_id;
		//check if moderatorSocketId is valid.
		if (socketInfo[moderatorSocketId] == undefined) {
			return;
		}

		if (socketInfo[moderatorSocketId].is_moderator != true) {
			return;
		}
		if (moderatorSocketId != socket.id) {
			return;
		}

		if (socketInfo[targetUserSocketId] != undefined) {
			socketInfo[targetUserSocketId].isBanned = true;

			roomModel.setUserBanned(socketInfo[targetUserSocketId].user_id, socketInfo[targetUserSocketId].room_id, false, (db_err, db_res) => {
				if (db_err) {
					console.log("unbanned_user => setUserBanned db error. user_id: " + socketInfo[targetUserSocketId].user_id + ", room_id: " + socketInfo[targetUserSocketId].room_id);
					return;
				}

				data = {
					msg: lang.server_user_unbanned_success,
					user_id: targetUserSocketId
				};
				io.to(moderatorSocketId).emit('unbanned_user', data);
			});
		}
	});


	socket.on('disconnect', () => {

		var socketData = socketInfo[socket.id];
		console.log('disconnect called =========================');
		console.log(socketData);
		console.log('===========================================');
		if (socketData == undefined) {
			console.log("disconnected user's socket data is undefined. socket_id: " + socket.id);
			return;
		}

		if (socketData.type == "public_room") {

			var respData = {
				user_id: socket.id
			};

			if (socketData.isBanned == true) {
				// just send offline message.
				io.in(socketData.room_id).emit('public_user_offline', respData);
			} else {
				// remove user join status from DB=>t_user_room_relation.
				// could be async, i think.
				roomModel.removeUserFromRoom(socketData.user_id, socketData.room_id, (db_err, db_res) => {
					if (db_err) {
						console.log('disconnect => public_room => removeUserFromRoom failed from db. user_id: ' + socketData.user_id + ', room_id: ' + socketData.room_id);
					}
					io.in(socketData.room_id).emit('public_user_offline', respData);
				});
			}
		}
		if (socketData.type == "private_room") {
			var respData = {
				user_id: socket.id
			};
			io.in(socketData.room_id).emit('private_user_offline', respData);
		}
		// remove from socketInfo.

		delete socketInfo[socket.id];
		// decrease online user count and braodcast.
		navbarInfo.onlineUserCount = navbarInfo.onlineUserCount - 1;
		navbarInfo.activateRoomCount = getActivateRoomCount();
		io.emit('navbar_info_change', navbarInfo);


		console.log("removed disconnected user info from socketInfo. socket_id: " + socket.id);
	});
});

httpsServer.listen(port, process.env.IP || "0.0.0.0", function() {

	console.log('server started on port: ' + port);
});