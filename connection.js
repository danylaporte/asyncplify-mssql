var bulk = require('./bulk');
var insert = require('./insert');
var request = require('./request');

function Connection(conn) {
	this.close = function () { conn.close(); };
	this.conn = conn;
}

Connection.prototype = {
	bulk: function (options) {
		return bulk({connection: this.conn, tableOptions: options});
	},
	insert: function (table) {
		return insert({connection: this, table: table});
	},
	query: function (sql, params) {
		return request(this.conn, sql, params);
	}
};

module.exports = Connection;