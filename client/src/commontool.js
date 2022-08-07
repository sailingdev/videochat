exports.getCurrentDateTime = function() {
	var dateTime = require('node-datetime');
	var dt = dateTime.create();
	var formatted = dt.format('Y-m-d H:M:S');
	return formatted;
}