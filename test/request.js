var config = require('./config.json');
var lib = require('../index');
var tests = require('asyncplify-tests');

describe('request', function () {

	lib
		.connect(config)
		.flatMap(function (connection) {
			return connection
				.request('SELECT TOP 1 * FROM sys.tables')
				.finally(connection.close);
		})
		.pipe(tests.itShouldClose())
		//.pipe(tests.itShouldACountOf(1));
});