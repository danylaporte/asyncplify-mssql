var asyncplify = require('asyncplify');
var config = require('./config.json');
var lib = require('../index');
var tests = require('asyncplify-tests');

describe('bulk', function () {

	lib
		.connect(config)
		.flatMap(function (connection) {
			return asyncplify
				.range(10001)
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
		.pipe(tests.itShouldEmitValues([5000, 5000, 1]));
});