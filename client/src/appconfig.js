/*
==================== session information ====================

username: current session's username.
userdata: current session's raw userdata from db.
isLoggedIn: true if user logged in. need to check everytime if this is true to check user is logged in.
email: current session's email address.
emailVerifyCode: email verify code which sent to user.
roomPasswordOk: an array that indicates if current session user has confirmed password with room id.
roomModerator: an array that indicates if current session user is moderator of room(id).
isGuest: boolean value indicates if this session is guest or not.
isRemember: boolean value indicates if server will save cookie on client.
guest_username_id: guest name reference.
*/


module.exports.dbConfig = {
    host: "localhost",
    username: "root",
    password: "",
    db_name: "db_video_chat"
};


module.exports.mailConfig = {
	host: 'smtp.126.com',
    port: 25,
    secure: false, // true for 465, false for other ports
    auth: {
        user: "kk@126.com", // generated ethereal user
        pass: "kk"  // generated ethereal password
    }
};

module.exports.passwordLength = 6;

module.exports.avatarBasePath = "/images/avatar/";
module.exports.roomBasePath = "/images/room/";

module.exports.avatarBasePath4Formidable = "./public/images/avatar/";
module.exports.roomBasePath4Formidable = "./public/images/room/";

module.exports.port = 15001;

module.exports.pageCount = 4;
