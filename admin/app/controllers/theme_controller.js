/**
 * Created by BlueSky on 2017-09-16.
 */

var mysql = require('mysql');
var util = require('util');
var lang = require('../lang/en');
var dbconfig = require('../config/database');

var connection = mysql.createConnection({
    host: dbconfig.host,
    user: dbconfig.user,
    password:  dbconfig.password,
    database: dbconfig.database
});

exports.updateLangData = function (id, key, value, callback) {

    var sql = "UPDATE " + dbconfig.language_table + " SET value='" + value + "' WHERE id='" + id + "'";

    connection.query(sql, function (err, rows)
    {
        if (err) throw err;
        callback(null, lang.success);

    });

}

exports.getThemeData = function (callback) {

    sql = "SELECT * FROM " + dbconfig.theme_table;

    var theme_data = null;

    connection.query(sql, function (err, rows) {
        if (err) throw err;
        if (rows != null){
            theme_data = JSON.parse(JSON.stringify(rows));

            color_data = [];
            size_data = [];
            family_data = [];
            j = 0; k = 0; l = 0;

            for (i = 0; i < theme_data.length; i++){
                if (theme_data[i].category == "COLOR"){
                    color_data[j] = [];
                    color_data[j]['id'] = j + 1;
                    color_data[j]['name'] = theme_data[i]['name'];
                    color_data[j]['comment'] = theme_data[i]['comment'];
                    color_data[j]['color'] =
                        util.format(
                            "rgba(%s, %s, %s, %s)",
                            theme_data[i]['red'],
                            theme_data[i]['green'],
                            theme_data[i]['blue'],
                            theme_data[i]['alpha']
                        );
                    j++;
                } else if (theme_data[i].category == "FONT_SIZE") {
                    size_data[k] = [];
                    size_data[k]['id'] = k + 1;
                    size_data[k]['name'] = theme_data[i]['name'];
                    size_data[k]['comment'] = theme_data[i]['comment'];
                    size_data[k]['size'] =  theme_data[i]['size'];
                    k++;
                } else if (theme_data[i].category == "FONT_FAMILY") {
                    family_data[l] = [];
                    family_data[l]['id'] = l + 1;
                    family_data[l]['name'] = theme_data[i]['name'];
                    family_data[l]['comment'] = theme_data[i]['comment'];
                    family_data[l]['font_family'] = theme_data[i]['font_family'];
                    l++;
                }
            }

            callback
            (
                null,
                {
                    message : lang.success,
                    color_data : color_data,
                    size_data : size_data,
                    family_data : family_data
                }
            );

        } else {
            callback(null, {message : lang.theme_data_no, theme_data : null})
        }
    })

}

exports.updateThemeFontSize = function (name, size, callback) {

    sql = "UPDATE " + dbconfig.theme_table + " SET size='" + size + "' WHERE name='" + name + "' AND category='FONT_SIZE'";
    connection.query(sql, function (err, rows) {
        if (err) throw err;
        callback(null, lang.success);
    })

}

exports.updateThemeFontFamily = function (name, font_family, callback) {

    sql = "UPDATE " + dbconfig.theme_table + " SET font_family='" + font_family + "' WHERE name='" + name + "' AND category='FONT_FAMILY'";

    connection.query(sql, function (err, rows) {
        if (err) throw err;
        callback(null, lang.success);
    })

}

exports.updateThemeBgColor = function (name, color, callback) {

    var rgba;

    // if color contains string "#", it convert rgba color using regular expression
    if (color.indexOf("#") > -1){
        var patt = /^#([\da-fA-F]{2})([\da-fA-F]{2})([\da-fA-F]{2})$/;
        var matches = patt.exec(color);
        color = "rgba(" + parseInt(matches[1], 16) + "," + parseInt(matches[2], 16) + "," + parseInt(matches[3], 16) + ", 1)";
    }

    // rgba color split each color value(red, green, blue, alpha)
    rgba = color.match(/\d+/g);

    sql = "UPDATE " + dbconfig.theme_table + " SET " +
        "red='" + rgba[0] + "', green='" + rgba[1] + "', blue='" + rgba[2] + "', alpha='" + rgba[3] + "' " +
        "WHERE name='" + name + "' AND category='COLOR'";

    connection.query(sql, function (err, rows) {
        if (err) throw err;
        callback(null, lang.success);
    })

}

exports.getFontFamilyData = function (callback) {
    sql = "SELECT * FROM " + dbconfig.font_family_table;
    connection.query(sql, function (err, rows) {
        if (err) throw err;
        if (rows == null){
            callback(null, null);
        } else {
            callback(null, rows);
        }
    })
}