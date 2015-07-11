var config = require('./config.json');
var lib = require('../index');
var tests = require('asyncplify-tests');

describe('request', function () {

	lib
		.connect(config)
		.flatMap(function (connection) {
			return connection
				.query('SELECT id, name FROM Table1 ORDER BY id')
				.finally(connection.close);
		})
		.pipe(tests.itShouldClose())
		.pipe(tests.itShouldEmitValues([
			{ id: 1, name: 'Record 1' },
			{ id: 2, name: 'Record 2' },
			{ id: 3, name: 'Record 3' },
			{ id: 4, name: 'Record 4' }
		]));
});