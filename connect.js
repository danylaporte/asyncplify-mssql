var Asyncplify = require('asyncplify');
var debug = require('debug')('asyncplify-mssql:connect');
var Connection = require('./connection');
var SqlConnection = require('mssql').Connection;

function Connect(config, sink) {
	this.conn = new SqlConnection(config);
	this.sink = sink;
	this.sink.source = this;
	
	debug('connecting to %s on %s', config.database, config.server);
	
	var self = this;
	
	this.conn.connect(function(err) {
		if (self.sink) {
			if (err) {
				debug('error connecting on %s', config.server);
				debug(err);
			} else {
				debug('connected to %s on %s', config.database, config.server);
			}
			
			self.sink.emit(new Connection(self.conn));
			self.conn = null;
			
			if (self.sink) self.sink.end(err);
		} else if (self.conn) {
			self.conn.close();
			self.conn = null;
		}
	});
}

Connect.prototype.close = function () {
	this.sink = null;
	if (this.conn) this.conn.close();
	this.conn = null;	
};

module.exports = function (config) {
	return new Asyncplify(Connect, config);
};