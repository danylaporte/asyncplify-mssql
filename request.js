var Asyncplify = require('asyncplify');
var debug = require('debug')('asyncplify-mssql:request');
var SqlRequest = require('mssql').Request;
var states = Asyncplify.states;

function Request(options, sink) {
	this.count = 0;
	this.sink = sink;
	this.sink.source = this;
	this.request = new SqlRequest(options.connection);
	this.request.stream = true;

	var self = this;

	if (Array.isArray(options.parameters))
		this.addParameterArray(options.parameters);
	else
		this.addParameters(options.parameters);

	this.request.on('row', function (row) { self.emit(row); });
	this.request.on('error', function (err) { self.end(err); });
	this.request.on('done', function () { self.end(null); });
	this.request.query(options.sql);

	debug('querying %s', options.sql);
}

Request.prototype = {
	addParameterArray: function (array) {
		for (var i = 0; i < array.length; i++) {
			var parameter = array[i];
			
			if (parameter.type)
				this.request.input(parameter.name, parameter.type, parameter.value);
			else
				this.request.input(parameter.name, parameter.value);
		}
	},
	addParameters: function (parameters) {
		for (var k in parameters) {
			var item = parameters[k];

			if (item && item.type)
				this.request.input(k, item.type, item.value);
			else
				this.request.input(k, item);
		}
	},
	emit: function (row) {
		if (this.sink) {
			if (this.count++ === 0) debug('received the first row');
			this.sink.emit(row);
		}
	},
	end: function (err) {
		if (this.sink) {
			if (err)
				debug(err);
			else
				debug('received %d row(s)', this.count);

			this.sink.end(err);
			this.sink = null;
		}
	},
	setState: function (state) {
		if (state === Asyncplify.states.CLOSED) {
			this.sink = null;
			if (this.request) this.request.cancel();
			this.request = null;
		}
	}
};

module.exports = function (connection, sql, parameters) {
	return new Asyncplify(Request, { connection: connection, sql: sql, parameters: parameters });
};