var Controller = require('./controller');

module.exports = function(app, fs) {
	// redirect to front page
	app.get('/', Controller.redirectToFrontPage);

	// shows front page
	app.get('/frontpage', Controller.showFrontPage);

	// get more rooms
	app.get('/getmorerooms', Controller.getMoreRooms);

	// user want to login to join room
	app.post('/login', Controller.signIn);

	// user want to register.
	app.post('/register', Controller.signUp);

	// // user sends email verification code to server.
	// app.post('/verifyemail', Controller.verifyEmail);

	// // user wants to resend email verification code.
	// app.get('/resendverifycode', Controller.resendEmailVerifyCode);

	// check room password
	app.post('/checkroompassword', Controller.checkRoomPassword);

	// user wants to join room.
	app.post('/joinroom', Controller.joinRoom);

	// shows public chat room.
	app.get('/room', Controller.showPublicRoom);

	// // shows private chat room.
	// app.get('/privatechat', Controller.showPrivateChatRoom);

	// shows create room page.
	app.get('/createroom', Controller.showCreateNewRoomPage);

	// createroom_show_request.
	app.get('/createroom_show_request', Controller.createNewRoomPageRequest);

	// process create room request.
	app.post('/createnewroomrequest', Controller.processCreateNewRoomRequest);

	// user updates profile.
	app.post('/updateprofile', Controller.processUpdateProfile);

	// user want to retrieve password.
	app.post('/retrievepassword', Controller.processPasswordRetrieveRequest);
	
	// user want to logout
	app.get('/logout', Controller.signOut);
}