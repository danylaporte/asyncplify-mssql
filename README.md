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
		.subscribe(console.log.bind(console));
// 5000
// 5000
// 1
// end.
```

### request(sql, params)
Asynchronously insert records using bulk insert to a table in a database.

options:
- sql String
- params

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