/**
 * Created by BlueSky on 2017-09-16.
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