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

exports.manualLogin = function(name, password, callback){

        var sql = "SELECT * FROM " + dbconfig.admin_table + " WHERE name='" + name + "'";

        connection.query(sql, function (err2, rows)
        {
            if(err2) throw err2;

            if (rows[0] == null)
            {
                callback(null, JSON.stringify({"msg" : lang.admin_not_found, "status" : false, "user" : null}));
            }
            else
            {
                var user = rows[0];

                if (user.password == password) {
                    callback(null, JSON.stringify({"msg" : lang.login_success, "status" : true, "user" : user}));
                } else {
                    callback(null, JSON.stringify({"msg" : lang.password_match_error,"status" : false,  "user" : null}));
                }
            }

        });

};

exports.signUp = function(name, email, password, callback){

        var sql = "SELECT * FROM " + dbconfig.admin_table + " WHERE name='" + name + "'";

        connection.query(sql, function (err2, rows)
        {
            if(err2) throw err2;

            if (rows[0] !== null)
            {
                callback(null, JSON.stringify({"msg" : lang.admin_exist, "status" : false}));

            } else {

                sql = "SELECT * FROM " + dbconfig.admin_table + " WHERE email='" + email + "'";

                connection.query(sql, function (err2, rows)
                {
                    if(err2) throw err2;

                    if (rows[0] !== null)
                    {
                        callback(null, JSON.stringify({"msg" : lang.email_exist, "status" : false}));

                    } else {

                        var dt = dateTime.create('');
                        var create_time = dt.format('Y-m-d H:M:S');

                        //var sql = "INSERT INTO customers (name, address) VALUES ('1', '" + req.files.file.name + "','" + req.files.file.path +  "')";

                        sql = "INSERT INTO " +
                            dbconfig.admin_table +
                            " (name, email, password, create_datetime, is_email_verified) VALUES ('" +
                            name + "','" + email + "','" + password + "','" + create_time + "','YES')";

                        connection.query(sql, function (err2, rows)
                        {
                            if(err2) throw err2;

                            callback(null, JSON.stringify({"msg" : lang.signup_success, "status" : true}));

                        });
                    }

                });

            }

        });

};
