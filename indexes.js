exports.get = function getIndexes(connection, options) {
	var sql = 'SELECT i.name AS name, o.name AS [table] ' +
		'FROM sys.indexes i ' +
		'INNER JOIN sys.objects o ' +
		'ON i.object_id = o.object_id ' +
		'WHERE 1 = 1 ';

	var parameters = {};

	if (options && options.type) {
		parameters.type = options.type;
		sql += 'AND i.type_desc = @type ';
	}

	if (options && options.table) {
		parameters.table = options.table;
		sql += 'AND o.name = @table ';
	}

	return connection.query({ sql: sql, parameters: parameters });
};

exports.enable = function enableIndexes(connection, options) {
	return exports
		.get(connection, { table: options && options.table, type: options && options.type || 'NONCLUSTERED' })
		.flatMap(function (index) {
			return connection
				.query({
					batch: true,
					sql: "EXEC('ALTER INDEX [' + @name + '] ON ' + @table + ' " + (options && options.enabled ? "REBUILD" : "DISABLE") + ";')",
					parameters: index
				})
				.map(function () { return index; });
		});
};