var bulk = require('./bulk');
var insert = require('./insert');
var request = require('./request');

function Connection(conn) {
	this.close = function () { conn.close(); };
	this.conn = conn;
}

Connection.prototype = {
	bulk: function (options) {
		return bulk({ connection: this.conn, tableOptions: options });
	},
	enableIndexes: function (options) {
		return require('./indexes').enable(this, options)	
	},
	insert: function (table) {
		return insert({ connection: this, table: table });
	},
	query: function (options) {
		return request({
			batch: options && options.batch,
			connection: this.conn,
			sql: options && options.sql || options,
			parameters: options && options.parameters
		});
	}
};

module.exports = Connection;