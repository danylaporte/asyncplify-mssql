# asyncplify-mssql
[asyncplify](https://github.com/danylaporte/asyncplify) mssql operators for quering, updating sql databases.

## Installation

``` bash
npm install asyncplify-mssql
```

## Documentation

### bulk
Asynchronously insert records using bulk insert to a table in a database.

options:
- columns: Array of string
- create: Boolean default = false: true to create the table if it does not exists
- size: Number default = 5000: the paging size
- table: String

Example:
```js
	asyncplifyMssql
		.connect({ 
			server: 'localhost',
			database: 'db-here',
			user: 'user-here',
			password: 'pw-here'
		})
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
		.subscribe(console.log.bind(console));
// { id: 0, name: 'Record #0' }
// { id: 1, name: 'Record #1' }
```

### insert(table)
Asynchronously insert records into a database table.

options:
- table: String

Example:
```js
	asyncplifyMssql
		.connect({ 
			server: 'localhost',
			database: 'db-here',
			user: 'user-here',
			password: 'pw-here'
		})
		.flatMap(function (connection) {
			return asyncplify
				.range(2)
				.map(function (x) { return { id: x, name: 'Record #' + x }; })
				.pipe(connection.insert('myTable'))
				.finally(connection.close);
		})
		.subscribe(console.log.bind(console));
// { id: 0, name: 'Record #0' }
// { id: 1, name: 'Record #1' }
// end.
```

### enableIndexes(options)
Enable or disable sql indexes on a table.

options:
- enabled: Boolean default = false, use true to enable/rebuild, false to disable
- table: String

Example:
```js
	asyncplifyMssql
		.connect({ 
			server: 'localhost',
			database: 'db-here',
			user: 'user-here',
			password: 'pw-here'
		})
		.flatMap(function (connection) {
			return connection
				.enableIndexes({ table: 'my-table', enabled: false })
				.finally(connection.close);
		})
		.subscribe(console.log.bind(console));
// { name: 'IX_INDEX1, table: 'my-table' }
// { name: 'IX_INDEX2, table: 'my-table' }
// end.
```

### query(sql, params)
Asynchronously execute a request.

options:
- batch: Boolean default = false, by default(false) use execute_sql to enable query plan.
- sql String
- parameters

Example:
```js
	asyncplifyMssql
		.connect({ 
			server: 'localhost',
			database: 'db-here',
			user: 'user-here',
			password: 'pw-here'
		})
		.flatMap(function (connection) {
			return connection
				.query('SELECT id, name FROM Table1 ORDER BY id')
				.finally(connection.close);
		})
		.subscribe(console.log.bind(console));
// { id: 1, name: 'Record 1' }
// { id: 2, name: 'Record 2' }
// { id: 3, name: 'Record 3' }
// { id: 4, name: 'Record 4' }
// end.
```

## License
The MIT License (MIT)

Copyright (c) 2015 Dany Laporte