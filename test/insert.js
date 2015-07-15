var asyncplify = require('asyncplify');
var config = require('./config.json');
var lib = require('../index');
var tests = require('asyncplify-tests');

describe('insert', function () {

	lib
		.connect(config)
		.flatMap(function (connection) {
			return asyncplify
				.range(2)
				.map(function (x) { return { id: x, name: 'Record #' + x }; })
				.pipe(connection.insert('bulk-test'))
				.finally(connection.close);
		})
		.pipe(tests.itShouldEmitValues([
			{ id: 0, name: 'Record #0' },
			{ id: 1, name: 'Record #1' }
		]));
});