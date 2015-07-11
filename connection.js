var bulk = require('./bulk');
var request = require('./request');

function Connection(conn) {
	this.close = function () { conn.close(); };
	this.conn = conn;
}

Connection.prototype = {
	bulk: function (options) {
		return bulk({connection: this.conn, tableOptions: options});
	},
	query: function (sql, params) {
		return request(this.conn, sql, params);
	}
};

module.exports = Connection;