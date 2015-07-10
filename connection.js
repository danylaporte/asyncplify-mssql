var request = require('./request');

function Connection(conn) {
	this.close = function () { conn.close(); };
	this.conn = conn;
}

Connection.prototype = {
	query: function (sql, params) {
		return request(this.conn, sql, params);
	}
};

module.exports = Connection;