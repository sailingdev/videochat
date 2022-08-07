
login_manager = require('../app/controllers/login_controller');
user_manager = require('../app/controllers/user_controller');
theme_manager = require('../app/controllers/theme_controller');
bad_word_manager = require('../app/controllers/bad_word_controller');
room_manager = require('../app/controllers/room_controller');
var formidable = require('formidable');

util = require('util');
lang = require('../app/lang/en');

module.exports = function(app)
{
    app.get('/', function(req,res){
        res.render('login.ejs' , { message : "", lang : lang})
    });

    app.get('/login', function(req,res){
        res.render('login.ejs' , { message : "", lang : lang})
    });

    app.post('/update_lang', function (req, res) {

        var id = req.body.id;
        var key = req.body.key;
        var value = req.body.value;
        theme_manager.updateLangData(id, key, value, function (error, result) {
            if (!result){
                res.send({msg : 'Language Update Failed', type : 'failed'});
            } else {
                res.send({msg : 'Language Update Success', type : 'success'});
            }
        })

    });

    app.get('/language', function(req, res){
        
        room_manager.getLangData(function (error, result) {
            if(error){
                console.log("/language => getLangData fails from db.");
                res.redirect('/dashboard');
                return;
            }
            var info = {active_rooms : 2, total_rooms : 9, online_users : 5};
            res.render('language.ejs' , { message : "", lang : lang, langdata : result, info: info})
            
        
        })

        
    });


    app.post('/updatelogo', function(req,res){
                var form = new formidable.IncomingForm();

        form.uploadDir = setting.logoImgDir4Formidable;

        form.parse(req, (err, fields, files) => {

            if (files.logoimage == undefined || files.logoimage.size == 0) {
                res.json({
                    status: "fail",
                    msg: "Please select logo image."
                });
                return;
            }

            var logoImgUrl = files.logoimage.path;
            
            logoImgUrl = logoImgUrl.substring(0, logoImgUrl.lastIndexOf("/") + 1);

            var fs = require('fs');
            fs.rename(files.logoimage.path, "../client/public/navbar_logo.png", function(err) {
                if (err){
                    console.log()
                }
                res.end();
            });

            res.json({
                status: "ok",
                msg: "Logo image set successfully."
            });
        });
    });
    

    app.post('/sign-in', function(req, res){

        var name = req.body.name;
        var password = req.body.password;

        login_manager.manualLogin(name, password, function(error, result) {

            if (!result) {
                res.render('login.ejs', {message: "", lang: lang})
            } else {
                var resp = JSON.parse(result);
                if (resp.status) {
                    req.session.user = resp.user;
                    if (req.body.remember){
                        res.cookie('name', user.name, { maxAge: 900000 });
                        res.cookie('password', user.password, { maxAge: 900000 });
                    }
                    res.redirect('/dashboard');
                } else {
                    res.render('login.ejs', {message: "", lang: lang});
                }

            }

        });

    });

    app.get('/signup', function(req, res){
        res.render('signup.ejs' , { message : "", lang : lang})
    });

    app.post('/signup', function(req, res){

        var name = req.body.name;
        var email = req.body.email;
        var password = req.body.password;
        var confirm_password = req.body.confirm_password;

        if (name == undefined || name.length == 0 ||
            email == undefined || email.length == 0 ||
            password.length == 0 || password == undefined ||
            confirm_password == undefined || confirm_password.length == 0){

            res.render('signup.ejs' , { message : lang.text_empty_error , lang : lang})

        } else if (name.length > 0 && name.length < 2) {

            res.render('signup.ejs' , { message : lang.name_length_error , lang : lang})

        } else if ((password.length > 0 && password.length < 6) || (confirm_password.length > 0 && confirm_password.length < 6)){

            res.render('signup.ejs' , { message : lang.password_length_error , lang : lang})

        } else if (password !== confirm_password) {

            res.render('signup.ejs' , { message : lang.password_match_error , lang : lang})

        } else {

            login_manager.signUp(name, email, password, function(error, result){

                if (!result){
                    res.render('signup.ejs', {message : error.message, lang : lang});
                } else {
                    var resp = JSON.parse(result);
                    if (resp.status){
                        login_manager.manualLogin(name, password, function(error, result){
                            if(!result){

                                res.render('signup.ejs', {message : error.message, lang : lang});

                            } else {

                                var resp = JSON.parse(result);
                                if (resp.status){
                                    var user = resp.user;
                                    req.session.user = user;

                                    if (req.body.remember){
                                        res.cookie('name', user.name, { maxAge: 900000 });
                                        res.cookie('password', user.password, { maxAge: 900000 });
                                    }

                                    res.redirect('/dashboard');

                                }

                            }

                        });

                    } else {

                        res.render('signup.ejs', {message : resp.msg, lang : lang});

                    }

                }

            });

        }

    });

    app.get('/dashboard', function(req, res){

        var info = {active_rooms : 2, total_rooms : 9, online_users : 5};

        res.render('dashboard.ejs', {info : info, lang : lang});

    });

    app.post('/updateroom', function(req, res){
        
        var formData = req.body;

        var roomId = formData.roomid;
        var roomName = formData.roomname;
        var roomCapacity = formData.roomcapacity;
        var is_text_enabled = formData.input_text_enabled == "on";
        var is_voice_enabled = formData.input_voice_enabled == "on";
        var is_video_enabled = formData.input_video_enabled == "on";
        var is_room_activated = formData.input_room_activated == "on";
        var moderatorId = formData.roommoderator;
        console.log(moderatorId);

        room_manager.updateRoomData(roomId, roomName, roomCapacity, is_text_enabled, is_voice_enabled, is_video_enabled, is_room_activated, moderatorId, (error, result) => {
            if(error){
                console.log("/updateroom => updateRoomData fails from db.");
                res.json({
                    status: "fail",
                    msg: "Updating room information failed."
                });
                return;
            }
            res.json({
                status: "ok",
                msg: "Updating room information successed."
            });
        });
    });

    app.post("/delete_room", function(req, res){
        var roomId = req.body.roomid;
        if(roomId == undefined){
            res.json({
                status: "fail",
                msg: "Bad room id"
            });
            return;
        }
        room_manager.deleteRoom(roomId, (error, result) => {
            if(error){
                console.log("/delete_room => deleteRoom fails from db.");
                res.json({
                    status: "fail",
                    msg: "Deleting room failed."
                });
                return;
            }
            res.json({
                status: "ok",
                msg: "Deleting room failed."
            });
        });

    });

    app.post('/createroom', function(req, res){
        

        var form = new formidable.IncomingForm();

        form.uploadDir = setting.roomImgDir4Formidable;

        form.parse(req, (err, fields, files) => {

            if (files.roomimage == undefined || files.roomimage.size == 0) {
                res.json({
                    status: "fail",
                    msg: "Please select room image."
                });
                return;
            }

            var roomName = fields.newroomname;
            var roomDetails = fields.newroomdetail;
            var roomCapacity = fields.newroomcapacity;
            var canText = fields.new_room_input_text_enabled == "on";
            var canVoice = fields.new_room_input_voice_enabled == "on";
            var canVideo = fields.new_room_input_video_enabled == "on";
            var password = fields.newroompassword;
            var moderatorId = fields.moderator_id;


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

            if (password.length != 0 && password.length < 6) {
                res.json({
                    status: "fail",
                    msg: "Password length must be at least " + 6 + "."
                });
                return;
            }

            var logOimGurl = files.roomimage.path;
            logOimGurl = logOimGurl.replace(new RegExp(/\\/g), "/");
            logOimGurl = logOimGurl.substring(logOimGurl.lastIndexOf("/") + 1);

            room_manager.addRoom(roomName, password, roomDetails, roomCapacity, logOimGurl, canText, canVoice, canVideo, moderatorId, (db_err, db_res) => {
                if (db_err) {
                    console.log(db_err);
                    res.json({
                        status: "fail",
                        msg: "Adding new room failed at DB."
                    });
                    return;
                }


                res.json({
                    status: "ok",
                    type: "createroom",
                    msg: "Room created successfully"
                });
                return;
            });



            return;
        });
    });

    app.get('/rooms', function(req, res){

        //var info = {active_rooms : 2, total_rooms : 9, online_users : 5};

        room_manager.getRoomData(function (error, result) {
            if(error){
                console.log("/rooms => getRoomData fails from db.");
                res.redirect('/dashboard');
                return;
            }
            
            //var user_list = JSON.parse(result).user;
            // res.render('users.ejs', {user_list : user_list, info : info, lang : lang});

            var info = {active_rooms : 2, total_rooms : 9, online_users : 5};

            var dateTime = require('node-datetime');

            for(i=0;i<result.length;i++){
                result[i].create_datetime = dateTime.create(result[i].create_datetime).format('Y-m-d H:M:S');
                result[i].last_event_datetime = dateTime.create(result[i].last_event_datetime).format('Y-m-d H:M:S');
            }

            user_manager.getUserData(function (error, result2) {
                if (!result){
                    res.redirect('/dashboard');
                } else {
                    var user_list = JSON.parse(result2).user;
                    res.render('rooms.ejs', {info: info, roomInfo : result, lang : lang, user_list : user_list});
                }
            })
            
        })

        // var info = {active_rooms : 2, total_rooms : 9, online_users : 5};



        

    });

    app.get('/theme', function(req, res){

        var info = {active_rooms : 2, total_rooms : 9, online_users : 5};

        theme_manager.getThemeData(function (error, result1) {
            if (!result1){
                res.redirect('/dashboard');
            } else {
                theme_manager.getFontFamilyData(function (error, result2) {
                    if (!result2){
                        res.redirect('/dashboard');
                    } else {
                        family = JSON.parse(JSON.stringify(result2));
                        res.render('theme.ejs',{ info : info, lang : lang, theme : result1, font_family : family});
                    }
                })
            }
        })

    });

    app.post('/change_theme_fontsize', function (req, res) {
        var name = req.body.name;
        var size = req.body.size;

        theme_manager.updateThemeFontSize(name, size, function (error, result) {
            if (!result){
                res.send({msg : 'Font Size update failed', type : 'failed'})
            } else {
                res.send({msg : 'Font Size update success', type : 'success'})
            }
        })

    })

    app.post('/change_theme_bgcolor', function (req, res) {
        var name = req.body.name;
        var color = req.body.color;

        theme_manager.updateThemeBgColor(name, color, function (error, result) {
            if (!result){
                res.send({msg : 'Color update failed', type : 'failed'})
            } else {
                res.send({msg : 'Color update success', type : 'success'})
            }
        })

    })

    app.post('/change_theme_fontfamily', function (req, res) {
        var name = req.body.name;
        var font_family = req.body.font;

        theme_manager.updateThemeFontFamily(name, font_family, function (error, result) {
            if (!result){
                res.send({msg : 'Font Family update failed', type : 'failed'})
            } else {
                res.send({msg : 'Font Family update success', type : 'success'})
            }
        })

    })

    app.get('/users', function(req, res){

        var info = {active_rooms : 2, total_rooms : 9, online_users : 5};

        user_manager.getUserData(function (error, result) {
            if (!result){
                res.redirect('/dashboard');
            } else {
                var user_list = JSON.parse(result).user;
                res.render('users.ejs', {user_list : user_list, info : info, lang : lang});
            }
        })

    });

    app.get('/settings', function(req, res){

        var info = {active_rooms : 2, total_rooms : 9, online_users : 5};

        res.render('settings.ejs', {info : info, lang : lang});

    });

    app.get('/bad_word', function(req, res){

        var info = {active_rooms : 2, total_rooms : 9, online_users : 5};

        bad_word_manager.getBadWordData(function (error, result) {
            if (!result){
                res.render('badword.ejs', {info : info, lang : lang, bad_word : null});
            } else {
                res.render('badword.ejs', {info : info, lang : lang, bad_word : result.bad_word});
            }
        })

    });

    app.post('/change_bad_word_content', function (req, res) {

        var id = req.body.id;
        var bad_word = req.body.bad_word;

        bad_word_manager.editBadWordData(id, bad_word, function (error, result) {
            if (!result){
                res.send({msg : 'Bad word edit failed', type : 'failed'});
            } else {
                res.send({msg : 'Bad word edit success', type : 'success'});
            }
        })

    });

    app.post('/add_bad_word_content', function (req, res) {

        var bad_word = req.body.bad_word;

        bad_word_manager.addBadWordData(bad_word, function (error, result) {
            if (!result){
                res.send({msg : 'Bad word add failed', type : 'failed'})
            } else {
                res.send({msg : 'Bad word add success', type : 'success'})
            }
        })

    });

    app.post('/delete_bad_word', function (req, res) {

        var id = req.body.id;

        bad_word_manager.deleteBadWordData(id, function (error, result) {
            if (!result){
                res.send({msg : 'Bad word delete failed', type : 'failed'})
            } else {
                res.send({msg : 'Bad word delete success', type : 'success'})
            }
        })

    });

    app.post('/login', function(req, res){

        var name = req.body.name;
        var password = req.body.password;

        login_manager.manualLogin(name, password, function(error, result){

            if(!result){

                res.render('login.ejs', {message : error.message, lang : lang});

            } else {

                var resp = JSON.parse(result);

                if (resp.status){

                    var user = resp.user;
                    req.session.user = user;

                    if (req.body.remember){
                        res.cookie('name', user.name, { maxAge: 900000 });
                        res.cookie('password', user.password, { maxAge: 900000 });
                    }
                    res.redirect('/dashboard');

                } else {
                    res.render('login.ejs', {message : resp.msg, lang : lang});
                }


            }

        });

    });

    app.get('/logout', function(req, res){
        var sess = req.session;
        if(sess.name || sess.password){
            res.clearCookie('name', { path: '/' , value: ''})
            res.clearCookie('password', { path: '/', value: '' })
            req.session.destroy(function(err){
                if(err){
                    console.log(err);
                }else{
                    res.redirect('/');
                }
            })
        }else{
            res.redirect('/');
        }
    })

    app.post('/change_user_status', function (req, res) {

        var id = req.body.id;
        var kind = req.body.kind;
        var value = req.body.value;

        var filed_name, resp_msg;
        if (kind == 'activated') {
            if (value == 'true') {
                resp_msg = lang.user_activate_alert
            } else {
                resp_msg = lang.user_deactivate_alert
            }
            filed_name = 'is_activated'
        } else {
            if (value == 'true') {
                resp_msg = util.format(lang.chat_active_alert, kind)
            } else {
                resp_msg = util.format(lang.chat_deactive_alert, kind)
            }
            filed_name = 'is_' + kind + '_enabled';
        }

        user_manager.setActivatedUser(id, filed_name, value, function (error, result) {
            if (!result) {
                res.send({message : error, isSuccess : false});
            } else {
                res.send({message : resp_msg, isSuccess : true});
            }
        })

    })

};
