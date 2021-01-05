module.exports = function (dateTime) {
	return dateTime && !isNaN(new Date(dateTime).getTime());
};
