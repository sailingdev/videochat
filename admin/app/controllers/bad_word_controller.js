/**
 * Created by BlueSky on 2017-09-16.
 */

var mysql = require('mysql');
var lang = require('../lang/en');
var dbconfig = require('../config/database');


var connection = mysql.createConnection({
    host: dbconfig.host,
    user: dbconfig.user,
    password:  dbconfig.password,
    database: dbconfig.database
});


exports.getBadWordData = function(callback){

    var sql = "SELECT * FROM " + dbconfig.bad_word_table;

    connection.query(sql, function (err, rows)
    {
        if(err) throw err;

        if (rows == null){
            callback(null, {"msg" : lang.failed, "status" : true, "bad_word" : null});
        } else {
            callback(null, {"msg" : lang.success, "bad_word" : JSON.parse(JSON.stringify(rows))});
        }

    });


    //var sql = "INSERT INTO customers (name, address) VALUES ('1', '" + req.files.file.name + "','" + req.files.file.path +  "')";
    //sql = "UPDATE " + dbconfig.theme_table + " SET size='" + size + "' WHERE name='" + name + "' AND category='FONT_SIZE'";

};

exports.editBadWordData = function (id, bad_word, callback) {

    var sql = "UPDATE " + dbconfig.bad_word_table + " SET bad_word='" + bad_word + "' WHERE id='" + id + "'";

    connection.query(sql, function (err, rows)
    {
        if (err) throw err;
        callback(null, lang.success);

    });

}

exports.addBadWordData = function (bad_word, callback) {

    var sql = "INSERT INTO " + dbconfig.bad_word_table + " (bad_word) VALUES ('" + bad_word + "')";

    connection.query(sql, function (err, rows)
    {
        if (err) throw err;
        callback(null, lang.success);

    });

}

exports.deleteBadWordData = function (id, callback) {

    var sql = "DELETE FROM " + dbconfig.bad_word_table + " WHERE id='" + id + "'";

    connection.query(sql, function (err, rows)
    {
        if (err) throw err;
        callback(null, lang.success);

    });

}
