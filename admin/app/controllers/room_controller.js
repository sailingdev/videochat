/**
 * Created by Joki on 2017-10-03.
 */

var mysql = require('mysql');
var dateTime = require('node-datetime');
var lang = require('../lang/en');
var dbconfig = require('../config/database');

var connection = mysql.createConnection({
    host: dbconfig.host,
    user: dbconfig.user,
    password:  dbconfig.password,
    database: dbconfig.database
});

exports.getLangData  = function (callback) {

        var sql = "SELECT * FROM " + dbconfig.language_table;
        console.log(sql);
        console.log(sql);

        connection.query(sql, function (err, rows) {
            if (err) throw err;

            callback(err, rows);

        });

};
exports.getRoomData = function (callback) {

        var sql = "SELECT * FROM " + dbconfig.room_table;

        connection.query(sql, function (err, rows) {
            if (err) throw err;

            callback(err, rows);

        });

};

exports.addRoom = function(roomName, password, roomDetails, roomCapacity, romImgUrl, canText, canVoice, canVideo, createUserId, callback) {



    var dateTime = require('node-datetime');
    var dt = dateTime.create();
    var formatted = dt.format('Y-m-d H:M:S');



    

    var sql =   "INSERT INTO " + 
                dbconfig.room_table + 
                " (room_name, " +
                "password, " +
                "is_password_protected, " +
                "detail, " +
                "capacity, " +
                "image, " +
                "is_text, " +
                "is_voice, " +
                "is_video, " +
                "create_datetime, " +
                "last_event_datetime, " +
                "moderator_id) " +
                "VALUES (" +
                "'" + roomName + "', " +
                "'" + password + "', " +
                "'" + (password == "" ? "NO" : "YES") + "', " +
                "'" + roomDetails + "', " +
                "'" + roomCapacity + "', " +
                "'" + romImgUrl + "', " +
                "'" + (canText?"YES" : "NO") + "', " +
                "'" + (canVoice?"YES" : "NO") + "', " +
                "'" + (canVideo?"YES" : "NO") + "', " +
                "'" + formatted + "', " +
                "'" + formatted + "', " +
                "'" + createUserId + "') ";

    console.log(sql);

    connection.query(sql, function (err, rows) {
        callback(err, rows);
    });

}

exports.deleteRoom = function (roomId, callback) {
    var sql =   "DELETE FROM " + 
                dbconfig.room_table + 
                " WHERE " + "id=" + "'" + roomId + "'";
    connection.query(sql, callback);
}

exports.updateRoomData = function (roomId, roomName, roomCapacity, is_text_enabled, is_voice_enabled, is_video_enabled, is_room_activated, moderatorId, callback){
    var sql =   "UPDATE " + 
                dbconfig.room_table + 
                " SET " + 
                "room_name" + "='" + roomName + "', " +
                "capacity" + "='" + roomCapacity + "', " +
                "is_text" + "='" + (is_text_enabled ? "YES" : "NO") + "', " +
                "is_voice" + "='" + (is_voice_enabled ? "YES" : "NO") + "', " +
                "is_video" + "='" + (is_video_enabled ? "YES" : "NO") + "', " +
                "is_activated" + "='" + (is_room_activated ? "YES" : "NO") + "' " +
                (moderatorId == 0 ? "" : (", moderator_id" + "='" + moderatorId + "' ")) + 
                "WHERE id=" + roomId;
    console.log(sql);

    connection.query(sql, function (err, rows) {
        if (err) throw err;
        callback(err, rows);
    });

};

//================================================================= below is not my code =================================================================

exports.getUserData = function (callback) {

        var sql = "SELECT * FROM " + dbconfig.user_table;

        connection.query(sql, function (err, rows) {
            if (err) throw err;

            if (rows == null){
                callback(null, JSON.stringify({"msg" : lang.no_user, "status" : false, "user" : null}));
            } else {

                for (i = 0; i < rows.length; i++){
                    temp = rows[i].create_datetime;
                    format_time = dateTime.create(temp).format('Y-m-d H:M:S');
                    rows[i].create_datetime = format_time;
                }

                callback(null, JSON.stringify({"msg" : lang.success, "status" : true, "user" : rows}));
            }

        });

};

exports.setActivatedUser = function (id, filed_name, value, callback) {

        if (value == 'true') value = "YES";
        else value = "NO";

        var sql = "UPDATE " + dbconfig.user_table + " SET " + filed_name + "='" + value + "' WHERE id=" + id;

        connection.query(sql, function (err, rows) {
            if (err) throw err;

            callback(null, "success");

        });


}