var asyncplify = require('asyncplify');
var config = require('./config.json');
var lib = require('../index');
var tests = require('asyncplify-tests');

describe('bulk', function () {

	lib
		.connect(config)
		.flatMap(function (connection) {
			return asyncplify
				.range(2)
				.map(function (x) { return { id: x, name: 'Record #' + x }; })
				.pipe(connection.bulk({
					columns: {
						id: 'bigint NOT NULL',
						name: 'nvarchar(50) NOT NULL'
					},
					create: true,
					table: 'bulk-test'
				}))
				.finally(connection.close);
		})
		.pipe(tests.itShouldEmitValues([
			{ id: 0, name: 'Record #0' },
			{ id: 1, name: 'Record #1' }]
		));
});